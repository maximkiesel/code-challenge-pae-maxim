const express = require('express');
const cors = require('cors');
const path = require('node:path');
const { createInitialRuns } = require('./data');

function createApp({ scenario, delayMs }) {
  const app = express();
  const runs = createInitialRuns();

  app.use(cors({
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 204
  }));
  app.use(express.json());

  app.route('/health')
    .get((_request, response) => response.status(200).json({ status: 'ok' }))
    .all(methodNotAllowed(['GET', 'OPTIONS']));

  app.route('/docs')
    .get((_request, response) => response.sendFile(path.join(__dirname, '..', 'public', 'docs.html')))
    .all(methodNotAllowed(['GET', 'OPTIONS']));
  app.route('/docs/')
    .get((_request, response) => response.sendFile(path.join(__dirname, '..', 'public', 'docs.html')))
    .all(methodNotAllowed(['GET', 'OPTIONS']));
  app.route('/openapi.json')
    .get((_request, response) => response.sendFile(path.join(__dirname, '..', 'openapi.json')))
    .all(methodNotAllowed(['GET', 'OPTIONS']));

  app.route('/api/automation-runs')
    .get(async (_request, response) => {
      await wait(delayMs);
      if (scenario === 'runs-error') {
        return sendError(response, 500, 'automation runs could not be loaded');
      }
      if (scenario === 'empty') {
        return response.status(200).json([]);
      }
      return response.status(200).json(runs.map((run) => ({ ...run })));
    })
    .all(methodNotAllowed(['GET', 'OPTIONS']));

  app.route('/api/automation-runs/:id/retry')
    .post(async (request, response) => {
      const id = Number(request.params.id);
      if (!Number.isSafeInteger(id) || id < 1) {
        return sendError(response, 404, 'automation run not found');
      }

      await wait(delayMs);
      if (scenario === 'retry-error') {
        return sendError(response, 500, 'automation retry could not be started');
      }

      const run = runs.find((candidate) => candidate.id === id);
      if (!run) {
        return sendError(response, 404, 'automation run not found');
      }
      if (run.status !== 'failed') {
        return sendError(response, 409, 'only failed automation runs can be retried');
      }

      run.status = 'running';
      run.duration_ms = null;
      return response.status(202).json({ id: run.id, status: run.status });
    })
    .all(methodNotAllowed(['POST', 'OPTIONS']));

  app.use((_request, response) => sendError(response, 404, 'route not found'));
  return app;
}

function methodNotAllowed(allowedMethods) {
  return (_request, response) => {
    response.set('Allow', allowedMethods.join(', '));
    return sendError(response, 405, 'method not allowed');
  };
}

function sendError(response, status, error) {
  return response.status(status).json({ error });
}

function wait(delayMs) {
  return delayMs === 0 ? Promise.resolve() : new Promise((resolve) => setTimeout(resolve, delayMs));
}

module.exports = { createApp };
