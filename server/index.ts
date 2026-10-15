import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { createApp } from './app.js';
import { createPool, PostgresInquiries } from './db.js';
const pool = process.env.DATABASE_URL ? createPool(process.env.DATABASE_URL) : undefined;
const app = createApp(pool ? new PostgresInquiries(pool) : undefined,pool);
if (!pool) console.warn('DATABASE_URL is missing. Inquiry submissions will return 503, never false success.');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve('dist')));
  app.get('/{*path}', (_req, res) => res.sendFile(path.resolve('dist/index.html')));
}
const server = app.listen(Number(process.env.PORT || 3001), '0.0.0.0');
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => { server.close(() => { void pool?.end().then(() => process.exit(0)); if (!pool) process.exit(0); }); });
