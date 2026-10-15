import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { createApp } from '../server/app.js';
import { PostgresInquiries } from '../server/db.js';
import type pg from 'pg';
const input = {name:'Test Person',phone:'9876543210',interest:'communities',locality:'Test locality',institution:'Test community',consent:true};
async function setup() {
  const db = new PGlite();
  await db.exec(readFileSync('db/migrations/001_inquiries.sql','utf8'));
  const query = async (sql: string, params?: unknown[]) => {
    const r = await db.query(sql, params);
    return { rows: r.rows, rowCount: r.affectedRows ?? r.rows.length };
  };
  const pool = { query, connect: async () => ({query,release() {}}) } as unknown as pg.Pool;
  return { pool, app: createApp(new PostgresInquiries(pool)) };
}
test('fresh schema has no fake records; inquiry and activity persist with normalized contact', async () => {
  const { pool, app } = await setup();
  assert.equal((await pool.query('SELECT count(*) FROM inquiries')).rows[0].count,0);
  const r = await request(app).post('/api/inquiries').set('Idempotency-Key',randomUUID()).send(input);
  assert.equal(r.status,201); assert.equal(r.body.saved,true);
  const row = (await pool.query('SELECT * FROM inquiries')).rows[0];
  assert.equal(row.phone,'+919876543210'); assert.equal(row.pipeline_status,'New'); assert.equal(row.contact_consent,true);
  assert.equal((await pool.query('SELECT count(*) FROM crm_activities')).rows[0].count,1);
});
test('same-key retries save once; changed payload is rejected', async () => {
  const { pool, app } = await setup(); const key = randomUUID();
  const first = await request(app).post('/api/inquiries').set('Idempotency-Key',key).send(input);
  const second = await request(app).post('/api/inquiries').set('Idempotency-Key',key).send(input);
  assert.equal(second.status,200); assert.equal(first.body.id,second.body.id);
  const changed = await request(app).post('/api/inquiries').set('Idempotency-Key',key).send({...input,name:'Other Person'});
  assert.equal(changed.status,409);
  assert.equal((await pool.query('SELECT count(*) FROM inquiries')).rows[0].count,1);
  assert.equal((await pool.query('SELECT count(*) FROM crm_activities')).rows[0].count,1);
});
test('missing database never returns success', async () => {
  const r = await request(createApp()).post('/api/inquiries').set('Idempotency-Key',randomUUID()).send(input);
  assert.equal(r.status,503); assert.equal(r.body.saved,undefined);
});
test('storage failures never return success or leak details', async () => {
  const r = await request(createApp({save:async()=>{throw new Error('secret connection string');}})).post('/api/inquiries').set('Idempotency-Key',randomUUID()).send(input);
  assert.equal(r.status,503); assert(!JSON.stringify(r.body).includes('secret'));
});
test('invalid phone, no consent, missing institution, honeypot and oversized input are rejected', async () => {
  for (const invalid of [{phone:'abc'},{consent:false},{institution:''},{website:'spam'},{message:'x'.repeat(2001)}]) {
    const r = await request(createApp()).post('/api/inquiries').set('Idempotency-Key',randomUUID()).send({...input,...invalid});
    assert.equal(r.status,422);
  }
});
test('public visitors cannot list inquiries or use cross-origin submissions', async () => {
  assert.equal((await request(createApp()).get('/api/inquiries')).status,404);
  assert.equal((await request(createApp()).post('/api/inquiries').set('Origin','https://other.invalid').set('Idempotency-Key',randomUUID()).send(input)).status,403);
});
test('missing idempotency key and malformed JSON are errors', async () => {
  assert.equal((await request(createApp()).post('/api/inquiries').send(input)).status,400);
  assert.equal((await request(createApp()).post('/api/inquiries').set('Content-Type','application/json').send('{bad')).status,400);
});
test('rate limiting rejects repeated requests', async () => {
  const app = createApp(); let last;
  for(let i=0;i<11;i++) last = await request(app).post('/api/inquiries').set('Idempotency-Key',randomUUID()).send(input);
  assert.equal(last!.status,429);
});
