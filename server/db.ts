import pg from 'pg';
import type { InquiryInput } from './validation.js';
import { randomUUID, createHash } from 'node:crypto';
export function createPool(url: string) { return new pg.Pool({ connectionString: url, max: 5, connectionTimeoutMillis: 5000, idleTimeoutMillis: 30000 }); }
export interface InquiryRepository { save(input: InquiryInput, key: string): Promise<{ id: string; duplicate: boolean }> }
export class IdempotencyConflict extends Error {}
export class PostgresInquiries implements InquiryRepository {
  constructor(private pool: pg.Pool) {}
  async save(input: InquiryInput, key: string) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const id = randomUUID();
      const hash = createHash('sha256').update(JSON.stringify(input)).digest('hex');
      const result = await client.query(
        `INSERT INTO inquiries (id,idempotency_key,payload_hash,requester_name,phone,email,interest,locality,learner_name,age_group,institution,message,contact_consent,consent_version)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,true,'contact-inquiry-v1') ON CONFLICT (idempotency_key) DO NOTHING RETURNING id`,
        [id,key,hash,input.name,input.phone,input.email || null,input.interest,input.locality,input.learnerName || null,input.ageGroup || null,input.institution || null,input.message]);
      if (!result.rowCount) {
        const existing = await client.query('SELECT id,payload_hash FROM inquiries WHERE idempotency_key=$1', [key]);
        if (existing.rows[0]?.payload_hash !== hash) throw new IdempotencyConflict();
        await client.query('COMMIT');
        return { id: existing.rows[0].id as string, duplicate: true };
      }
      await client.query(`INSERT INTO crm_activities(id,inquiry_id,activity_type,safe_summary) VALUES ($1,$2,'inquiry_received','Website inquiry received with contact consent.')`, [randomUUID(),id]);
      await client.query('COMMIT');
      return { id, duplicate: false };
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
  }
}
