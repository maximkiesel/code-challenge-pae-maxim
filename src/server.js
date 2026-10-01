const { createApp } = require('./app');
const { readConfig } = require('./config');

try {
  const config = readConfig();
  const app = createApp(config);

  app.listen(config.port, '127.0.0.1', () => {
    console.log(`Automation Runs API listening on http://127.0.0.1:${config.port} (scenario: ${config.scenario}, delay: ${config.delayMs}ms)`);
  });
} catch (error) {
  console.error(`Configuration error: ${error.message}`);
  process.exitCode = 2;
}
