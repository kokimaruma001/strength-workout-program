const fs = require('node:fs/promises');
const fsSync = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const ROOT = __dirname;
loadDotEnv();
const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || '127.0.0.1';
const MAX_PORT_ATTEMPTS = 100;
const MAX_BODY_BYTES = 50 * 1024;
const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};
const RECOMMENDATION_SYSTEM_PROMPT = 'You are a conservative strength-training assistant. Use only the supplied workout and training history. Progress load and total work gradually based on recorded completion, kilograms, reps, and estimated volume; never invent missing performance data or recommend a large jump. If history is sparse, say so and give a cautious next-session target. Suggest equipment substitutions only from the supplied candidates, keep the same movement purpose, same gym/home mode, and avoid every unavailable item. Return JSON with keys summary (string), progression (array of {exerciseId, recommendation, rationale}), and alternatives (array of {originalExerciseId, alternativeId, rationale}). Do not diagnose injuries or prescribe through pain; advise stopping and seeking qualified help if pain is reported.';

function loadDotEnv(env = process.env, filePath = path.join(ROOT, '.env')) {
  let contents;
  try {
    contents = fsSync.readFileSync(filePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }

  contents.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || Object.prototype.hasOwnProperty.call(env, match[1])) return;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    } else {
      value = value.replace(/\s+#.*$/, '').trim();
    }
    env[match[1]] = value;
  });
  return true;
}

function sendJson(response, status, data) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
}

async function readJsonBody(request) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes > MAX_BODY_BYTES) {
      throw Object.assign(new Error('Request body is too large.'), { status: 413 });
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw Object.assign(new Error('Request body must be valid JSON.'), { status: 400 });
  }
}

function cleanText(value, maxLength = 500) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function sanitizeRecommendations(raw, payload) {
  const exerciseIds = new Set((payload.exercises || []).map(exercise => exercise.id));
  const candidates = new Map((payload.candidates || []).map(exercise => [exercise.id, exercise]));
  const progression = Array.isArray(raw.progression) ? raw.progression
    .filter(item => exerciseIds.has(item.exerciseId))
    .slice(0, 20)
    .map(item => ({
      exerciseId: item.exerciseId,
      recommendation: cleanText(item.recommendation),
      rationale: cleanText(item.rationale),
    })) : [];
  const alternatives = Array.isArray(raw.alternatives) ? raw.alternatives
    .filter(item => exerciseIds.has(item.originalExerciseId) &&
      candidates.has(item.alternativeId) && item.alternativeId !== item.originalExerciseId &&
      candidates.get(item.alternativeId).mode === payload.mode)
    .slice(0, 20)
    .map(item => {
      const candidate = candidates.get(item.alternativeId);
      return {
        originalExerciseId: item.originalExerciseId,
        alternativeId: candidate.id,
        name: candidate.name,
        sets: candidate.sets,
        equipment: candidate.equipment,
        rationale: cleanText(item.rationale),
      };
    }) : [];

  return {
    summary: cleanText(raw.summary, 800) || 'Review these suggestions against how the session felt.',
    progression,
    alternatives,
  };
}

function getProviderConfiguration(env = process.env, userCredentials = null) {
  if (userCredentials?.apiKey) {
    if (!['anthropic', 'openai'].includes(userCredentials.provider) ||
        typeof userCredentials.apiKey !== 'string' || userCredentials.apiKey.length > 500 ||
        /[\r\n]/.test(userCredentials.apiKey)) {
      throw Object.assign(new Error('The login API key or provider selection is invalid.'), { status: 400 });
    }
    const anthropic = userCredentials.provider === 'anthropic';
    return {
      provider: userCredentials.provider,
      apiKey: userCredentials.apiKey,
      model: anthropic
        ? env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001'
        : env.OPENAI_MODEL || 'gpt-4o-mini',
    };
  }
  if (env.ANTHROPIC_API_KEY) {
    return {
      provider: 'anthropic',
      apiKey: env.ANTHROPIC_API_KEY,
      model: env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
    };
  }
  if (env.OPENAI_API_KEY) {
    return {
      provider: 'openai',
      apiKey: env.OPENAI_API_KEY,
      model: env.OPENAI_MODEL || 'gpt-4o-mini',
    };
  }
  throw Object.assign(new Error('AI suggestions are not configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY and restart the app.'), { status: 503 });
}

function providerError(status, provider) {
  if (status === 401) {
    return `Authentication failed with ${provider}. Verify the API key for that provider and restart the app.`;
  }
  if (status === 403) {
    return `${provider} denied access. Check that the account can use the configured model.`;
  }
  if (status === 404) {
    return `${provider} could not find the configured model. Check the model name in the server environment.`;
  }
  if (status === 429) {
    return `${provider} is rate-limiting requests or the account has insufficient quota. Check the provider account and try again.`;
  }
  return `${provider} returned an error (HTTP ${status}). Check the server configuration and try again.`;
}

function parseRecommendationJson(content) {
  const text = content.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    if (start < 0) throw new Error('No JSON object found.');

    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let index = start; index < text.length; index += 1) {
      const character = text[index];
      if (inString) {
        if (escaped) escaped = false;
        else if (character === '\\') escaped = true;
        else if (character === '"') inString = false;
        continue;
      }
      if (character === '"') inString = true;
      else if (character === '{') depth += 1;
      else if (character === '}') {
        depth -= 1;
        if (depth === 0) return JSON.parse(text.slice(start, index + 1));
      }
    }
    throw new Error('Incomplete JSON object.');
  }
}

async function createRecommendation(payload, env = process.env, fetchImpl = fetch, userCredentials = null) {
  if (!payload || !payload.workout || !['gym', 'home'].includes(payload.mode) ||
      !Array.isArray(payload.exercises) || !Array.isArray(payload.candidates) ||
      !Array.isArray(payload.history)) {
    throw Object.assign(new Error('Workout recommendation data is incomplete.'), { status: 400 });
  }

  const config = getProviderConfiguration(env, userCredentials);
  const anthropic = config.provider === 'anthropic';
  const endpoint = anthropic
    ? 'https://api.anthropic.com/v1/messages'
    : 'https://api.openai.com/v1/chat/completions';
  const headers = anthropic
    ? {
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    }
    : {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    };
  const requestBody = anthropic
    ? {
      model: config.model,
      max_tokens: 2200,
      temperature: 0.3,
      system: `${RECOMMENDATION_SYSTEM_PROMPT} Return only valid JSON with no markdown fences.`,
      messages: [{ role: 'user', content: JSON.stringify(payload) }],
    }
    : {
      model: config.model,
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 2200,
      messages: [
        { role: 'system', content: RECOMMENDATION_SYSTEM_PROMPT },
        { role: 'user', content: JSON.stringify(payload) },
      ],
    };

  let providerResponse;
  try {
    providerResponse = await fetchImpl(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });
  } catch {
    throw Object.assign(new Error(`Could not connect to ${config.provider}. Check the server network connection and try again.`), { status: 502 });
  }

  if (!providerResponse.ok) {
    const status = providerResponse.status === 429 ? 429 : 502;
    throw Object.assign(new Error(providerError(providerResponse.status, config.provider)), { status });
  }

  let providerData;
  try {
    providerData = await providerResponse.json();
  } catch {
    throw Object.assign(new Error(`${config.provider} returned an invalid response. Try again shortly.`), { status: 502 });
  }
  const content = anthropic
    ? providerData.content?.find(block => block.type === 'text')?.text
    : providerData.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    const stopReason = anthropic ? providerData.stop_reason : providerData.choices?.[0]?.finish_reason;
    const message = stopReason === 'max_tokens' || stopReason === 'length'
      ? 'The AI response was cut off. Try again.'
      : `${config.provider} returned no text for the recommendation. Try again.`;
    throw Object.assign(new Error(message), { status: 502 });
  }
  try {
    const recommendations = parseRecommendationJson(content);
    if (!recommendations || typeof recommendations !== 'object' || Array.isArray(recommendations)) {
      throw new Error('Expected a JSON object.');
    }
    return sanitizeRecommendations(recommendations, payload);
  } catch (error) {
    if (error.status) throw error;
    const stopReason = anthropic ? providerData.stop_reason : providerData.choices?.[0]?.finish_reason;
    const message = stopReason === 'max_tokens' || stopReason === 'length'
      ? 'The AI response was cut off. Try again.'
      : `${config.provider} returned a response that was not valid JSON. Try again.`;
    throw Object.assign(new Error(message), { status: 502 });
  }
}

async function serveStatic(request, response, pathname) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }

  let relativePath;
  try {
    relativePath = decodeURIComponent(pathname === '/' ? '/index.html' : pathname);
  } catch {
    response.writeHead(400);
    response.end();
    return;
  }
  if (relativePath.split('/').some(segment => segment.startsWith('.'))) {
    response.writeHead(404);
    response.end();
    return;
  }
  const filePath = path.resolve(ROOT, `.${relativePath}`);
  if (filePath !== ROOT && !filePath.startsWith(`${ROOT}${path.sep}`)) {
    response.writeHead(403);
    response.end();
    return;
  }

  try {
    const content = await fs.readFile(filePath);
    response.writeHead(200, {
      'Content-Type': MIME_TYPES[path.extname(filePath)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}

function createServer() {
  return http.createServer(async (request, response) => {
    let pathname;
    try {
      pathname = new URL(request.url, `http://${request.headers.host || 'localhost'}`).pathname;
    } catch {
      sendJson(response, 400, { error: 'Invalid request URL.' });
      return;
    }

    if (pathname !== '/api/recommendations') {
      await serveStatic(request, response, pathname);
      return;
    }
    if (request.method !== 'POST') {
      response.writeHead(405, { Allow: 'POST' });
      response.end();
      return;
    }

    try {
      const payload = await readJsonBody(request);
      const apiKey = request.headers['x-ai-api-key'];
      const provider = request.headers['x-ai-provider'];
      const userCredentials = apiKey ? { provider, apiKey } : null;
      sendJson(response, 200, await createRecommendation(payload, process.env, fetch, userCredentials));
    } catch (error) {
      sendJson(response, error.status || 502, { error: error.message || 'Recommendation request failed.' });
    }
  });
}

function listenOnAvailablePort(server, port = PORT, attemptsRemaining = MAX_PORT_ATTEMPTS) {
  return new Promise((resolve, reject) => {
    const handleError = error => {
      server.removeListener('listening', handleListening);
      if (error.code === 'EADDRINUSE' && attemptsRemaining > 0) {
        listenOnAvailablePort(server, port + 1, attemptsRemaining - 1).then(resolve, reject);
        return;
      }
      reject(error);
    };
    const handleListening = () => {
      server.removeListener('error', handleError);
      resolve(server.address().port);
    };

    server.once('error', handleError);
    server.once('listening', handleListening);
    server.listen(port, HOST);
  });
}

if (require.main === module) {
  const server = createServer();
  listenOnAvailablePort(server)
    .then(port => console.log(`Strength Workout Program running at http://${HOST}:${port}`))
    .catch(error => {
      console.error(`Could not start the app server: ${error.message}`);
      process.exitCode = 1;
    });
}

module.exports = {
  createRecommendation,
  createServer,
  getProviderConfiguration,
  loadDotEnv,
  listenOnAvailablePort,
  parseRecommendationJson,
  sanitizeRecommendations,
};