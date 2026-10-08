import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { config } from './config/index.js';

export function createApp() {
  const app = express();

  // Cross-Origin Resource Sharing
  app.use(cors(config.cors));

  // JSON and URL-encoded body parsing with configured limit
  app.use(express.json({ limit: config.uploadLimit }));
  app.use(express.urlencoded({ extended: true, limit: config.uploadLimit }));

  // Mount API router
  app.use('/api', apiRouter);

  // Global Centralized Error Handler
  app.use(errorHandler);

  return app;
}

export default createApp;
