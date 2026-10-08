import { createApp } from './src/app.js';
import { config } from './src/config/index.js';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`[${config.systemName}] v${config.version}`);
  console.log(`Server actively running on http://localhost:${config.port}`);
  console.log(`Database: SQLite (${config.database.filename}) [ACID Relational Engine]`);
  console.log(`Environment: ${config.env}`);
  console.log(`====================================================`);
});

// Graceful process shutdown handling
function handleShutdown(signal) {
  console.log(`\nReceived ${signal}. Gracefully shutting down...`);
  server.close(() => {
    console.log('HTTP server closed. Exiting process.');
    process.exit(0);
  });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default app;
