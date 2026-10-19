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
  for (const version of ['001_inquiries', '002_academy_inquiries', '003_live_foundation', '004_parent_workspace', '005_partner_portals', '006_superadmin_console', '007_websites', '008_independent_organizers', '009_draws', '010_coaching', '011_notifications', '012_payments']) {
  const done = await client.query('SELECT name FROM schema_migrations WHERE name=$1', [version]);
  if (!done.rowCount) {
    await client.query(await readFile(`db/migrations/${version}.sql`, 'utf8'));
    await client.query('INSERT INTO schema_migrations(name) VALUES($1)', [version]);
  }
  console.log(`Migration ${version}: ready.`);
  }
  await client.query('COMMIT');
} catch (error) { await client.query('ROLLBACK'); throw error; }
finally { client.release(); await pool.end(); }
