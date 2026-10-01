const validScenarios = new Set(['normal', 'empty', 'runs-error', 'retry-error']);

function readConfig(environment = process.env) {
  const port = readInteger(environment.PORT, 8080, 'PORT', 1, 65535);
  const delayMs = readInteger(environment.DELAY_MS, 500, 'DELAY_MS', 0);
  const scenario = environment.SCENARIO ?? 'normal';

  if (!validScenarios.has(scenario)) {
    throw new Error('SCENARIO must be one of: normal, empty, runs-error, retry-error');
  }

  return { port, delayMs, scenario };
}

function readInteger(value, fallback, name, minimum, maximum = Number.MAX_SAFE_INTEGER) {
  if (value === undefined || value === '') {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
    const range = maximum === Number.MAX_SAFE_INTEGER ? `at least ${minimum}` : `between ${minimum} and ${maximum}`;
    throw new Error(`${name} must be an integer ${range}`);
  }
  return parsed;
}

module.exports = { readConfig, validScenarios };
