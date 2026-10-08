import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  cors: {
    origin: '*',
    credentials: true,
  },
  uploadLimit: '50mb',
  systemName: 'VeriJuris Agentic Legal Assistant',
  version: '2.0.0',
  database: {
    type: 'sqlite',
    filename: 'verijuris.db'
  }
};
