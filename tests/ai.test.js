const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const vm = require('node:vm');
const { createRecommendation, createServer, getProviderConfiguration, loadDotEnv, parseRecommendationJson, sanitizeRecommendations } = require('../server');

const aiSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'js', 'ai.js'), 'utf8');
const context = { Date, Set, Map, Number, String, Array, Object, fetch() {} };
vm.createContext(context);
vm.runInContext(aiSource, context);

test('recommendation payload limits history to the active eight-week workout and estimates work', () => {
  const today = new Date();
  const recentDate = new Date(today.getTime() - (3 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
  const oldDate = new Date(today.getTime() - (60 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
  const workout = { key: 'upper', label: 'Upper Power', focus: 'Push and pull' };
  const exercises = [{ id: 'bp', name: 'Bench Press', sets: '4x8', note: 'Controlled reps' }];
  const payload = context.buildWorkoutRecommendationPayload({
    workout,
    mode: 'gym',
    unavailableEquipment: '  bench rack  ',
    exercises,
    candidates: [...exercises, { id: 'pup', name: 'Push-up', sets: '3x12', mode: 'gym' }],
    workoutLog: {
      [recentDate]: {
        workoutKey: 'upper',
        mode: 'gym',
        completed: { bp: true },
        weights: { bp: { kg: '50', reps: '8' } },
      },
      [oldDate]: {
        workoutKey: 'upper',
        mode: 'gym',
        weights: { bp: { kg: '45', reps: '8' } },
      },
      '2026-01-01': {
        workoutKey: 'lower',
        mode: 'gym',
        weights: { bp: { kg: '40', reps: '8' } },
      },
    },
    equipmentLabel: exercise => exercise.equipment || 'barbell',
  });

  assert.equal(payload.unavailableEquipment, 'bench rack');
  assert.equal(payload.history.length, 1);
  assert.equal(payload.history[0].estimatedVolumeKg, 1600);
  assert.equal(payload.history[0].completed, true);
});

test('AI substitutions are limited to supplied candidates in the active mode', () => {
  const payload = {
    mode: 'home',
    exercises: [{ id: 'sq', name: 'Goblet Squat' }],
    candidates: [
      { id: 'sq', mode: 'home' },
      { id: 'split-squat', name: 'Split Squat', sets: '3x8', equipment: 'Bodyweight', mode: 'home' },
      { id: 'barbell-squat', mode: 'gym' },
    ],
  };
  const result = sanitizeRecommendations({
    summary: 'Try a controlled variation.',
    progression: [{ exerciseId: 'sq', recommendation: 'Add one rep.', rationale: 'Recent work is steady.' }],
    alternatives: [
      { originalExerciseId: 'sq', alternativeId: 'split-squat', rationale: 'Keeps the squat pattern.' },
      { originalExerciseId: 'sq', alternativeId: 'barbell-squat', rationale: 'Wrong mode.' },
      { originalExerciseId: 'sq', alternativeId: 'invented', rationale: 'Not in the catalog.' },
    ],
  }, payload);

  assert.equal(result.progression.length, 1);
  assert.equal(result.alternatives.length, 1);
  assert.equal(result.alternatives[0].name, 'Split Squat');
});

test('Anthropic key selects its Messages API and parses JSON text content', async () => {
  const payload = {
    workout: { key: 'lower' },
    mode: 'home',
    exercises: [{ id: 'sq' }],
    candidates: [{ id: 'sq', mode: 'home' }],
    history: [],
  };
  const answer = { summary: 'Start conservatively.', progression: [], alternatives: [] };
  let requestedUrl;
  let requestedOptions;

  const result = await createRecommendation(payload, {
    ANTHROPIC_API_KEY: 'test-anthropic-key',
    ANTHROPIC_MODEL: 'test-model',
  }, async (url, options) => {
    requestedUrl = url;
    requestedOptions = options;
    return {
      ok: true,
      json: async () => ({ content: [{ type: 'text', text: JSON.stringify(answer) }] }),
    };
  });

  assert.equal(requestedUrl, 'https://api.anthropic.com/v1/messages');
  assert.equal(requestedOptions.headers['x-api-key'], 'test-anthropic-key');
  assert.equal(JSON.parse(requestedOptions.body).model, 'test-model');
  assert.deepEqual(result, answer);
});

test('login provider key overrides server key and is not included in the workout body', async () => {
  const payload = {
    workout: { key: 'lower' },
    mode: 'home',
    exercises: [{ id: 'sq' }],
    candidates: [{ id: 'sq', mode: 'home' }],
    history: [],
  };
  let requestOptions;
  await createRecommendation(payload, { ANTHROPIC_API_KEY: 'server-key' }, async (url, options) => {
    requestOptions = options;
    return {
      ok: true,
      json: async () => ({ choices: [{ message: { content: '{"summary":"OK","progression":[],"alternatives":[]}' } }] }),
    };
  }, { provider: 'openai', apiKey: 'login-key' });

  assert.equal(requestOptions.headers.Authorization, 'Bearer login-key');
  assert.equal(JSON.parse(requestOptions.body).model, 'gpt-4o-mini');
  assert.equal(JSON.stringify(JSON.parse(requestOptions.body)).includes('login-key'), false);
});

test('browser recommendation request sends the user key in headers, not JSON', async () => {
  let requestOptions;
  context.fetch = async (url, options) => {
    requestOptions = options;
    return { ok: true, json: async () => ({ summary: 'OK', progression: [], alternatives: [] }) };
  };

  await context.requestWorkoutRecommendations({ workout: { key: 'lower' } }, {
    provider: 'anthropic',
    apiKey: 'masked-test-key',
  });

  assert.equal(requestOptions.headers['x-ai-provider'], 'anthropic');
  assert.equal(requestOptions.headers['x-ai-api-key'], 'masked-test-key');
  assert.equal(requestOptions.body.includes('masked-test-key'), false);
});

test('Anthropic authentication failures explain which server setting to check', async () => {
  const payload = { workout: {}, mode: 'gym', exercises: [], candidates: [], history: [] };
  await assert.rejects(
    createRecommendation(payload, { ANTHROPIC_API_KEY: 'invalid-test-key' }, async () => ({ ok: false, status: 401 })),
    error => error.status === 502 && /Authentication failed with anthropic/.test(error.message),
  );
  assert.equal(getProviderConfiguration({ ANTHROPIC_API_KEY: 'a', OPENAI_API_KEY: 'o' }).provider, 'anthropic');
});

test('recommendation response parser accepts fenced and prefaced JSON', () => {
  const expected = { summary: 'Steady progress.', progression: [], alternatives: [] };
  assert.deepEqual(parseRecommendationJson(`\`\`\`json\n${JSON.stringify(expected)}\n\`\`\``), expected);
  assert.deepEqual(parseRecommendationJson(`Here is the plan:\n${JSON.stringify(expected)}\nDone.`), expected);
});

test('token-limited provider response reports truncation instead of unreadable JSON', async () => {
  const payload = { workout: {}, mode: 'gym', exercises: [], candidates: [], history: [] };
  await assert.rejects(
    createRecommendation(payload, { ANTHROPIC_API_KEY: 'test-key' }, async () => ({
      ok: true,
      json: async () => ({ stop_reason: 'max_tokens', content: [{ type: 'text', text: '{"summary":' }] }),
    })),
    error => error.message === 'The AI response was cut off. Try again.',
  );
});

test('dotenv loader fills missing values without overriding the current environment', () => {
  const os = require('node:os');
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'strength-program-env-'));
  const envFile = path.join(temporaryDirectory, '.env');
  const environment = { KEEP_EXISTING: 'from-process' };
  try {
    fs.writeFileSync(envFile, 'ANTHROPIC_API_KEY="local-secret-value"\nMODEL=haiku # comment\nKEEP_EXISTING=file-value\n');
    assert.equal(loadDotEnv(environment, envFile), true);
    assert.equal(environment.ANTHROPIC_API_KEY, 'local-secret-value');
    assert.equal(environment.MODEL, 'haiku');
    assert.equal(environment.KEEP_EXISTING, 'from-process');
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
});

test('static server does not serve dotenv or other dotfiles', async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const port = server.address().port;
    const status = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/.env.example`, response => {
        response.resume();
        response.on('end', () => resolve(response.statusCode));
      }).on('error', reject);
    });
    assert.equal(status, 404);
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});