const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');

const ROOT = __dirname;
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

async function createRecommendation(payload) {
  if (!process.env.OPENAI_API_KEY) {
    throw Object.assign(new Error('AI suggestions are not configured. Set OPENAI_API_KEY and restart the app.'), { status: 503 });
  }
  if (!payload || !payload.workout || !['gym', 'home'].includes(payload.mode) ||
      !Array.isArray(payload.exercises) || !Array.isArray(payload.candidates) ||
      !Array.isArray(payload.history)) {
    throw Object.assign(new Error('Workout recommendation data is incomplete.'), { status: 400 });
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const providerResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 1200,
      messages: [
        {
          role: 'system',
          content: 'You are a conservative strength-training assistant. Use only the supplied workout and training history. Progress load and total work gradually based on recorded completion, kilograms, reps, and estimated volume; never invent missing performance data or recommend a large jump. If history is sparse, say so and give a cautious next-session target. Suggest equipment substitutions only from the supplied candidates, keep the same movement purpose, same gym/home mode, and avoid every unavailable item. Return JSON with keys summary (string), progression (array of {exerciseId, recommendation, rationale}), and alternatives (array of {originalExerciseId, alternativeId, rationale}). Do not diagnose injuries or prescribe through pain; advise stopping and seeking qualified help if pain is reported.',
        },
        { role: 'user', content: JSON.stringify(payload) },
      ],
    }),
  });

  if (!providerResponse.ok) {
    const status = providerResponse.status === 429 ? 429 : 502;
    throw Object.assign(new Error(status === 429
      ? 'The AI provider is rate-limiting requests. Try again shortly.'
      : 'The AI provider could not complete this request. Check the server configuration and try again.'), { status });
  }

  const providerData = await providerResponse.json();
  const content = providerData.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw Object.assign(new Error('The AI provider returned an unreadable response.'), { status: 502 });
  }
  try {
    return sanitizeRecommendations(JSON.parse(content), payload);
  } catch (error) {
    if (error.status) throw error;
    throw Object.assign(new Error('The AI provider returned an unreadable response.'), { status: 502 });
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
      sendJson(response, 200, await createRecommendation(payload));
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

module.exports = { createServer, listenOnAvailablePort, sanitizeRecommendations };