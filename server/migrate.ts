import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { createPool } from './db.js';
if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL before running migrations.');
const pool = createPool(process.env.DATABASE_URL);
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock(61584322)');
  await client.query('CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())');
  const version = '001_inquiries';
  const done = await client.query('SELECT name FROM schema_migrations WHERE name=$1', [version]);
  if (!done.rowCount) {
    await client.query(await readFile('db/migrations/001_inquiries.sql', 'utf8'));
    await client.query('INSERT INTO schema_migrations(name) VALUES($1)', [version]);
  }
  await client.query('COMMIT'); console.log(`Migration ${version}: ready.`);
} catch (error) { await client.query('ROLLBACK'); throw error; }
finally { client.release(); await pool.end(); }
