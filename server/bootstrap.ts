import 'dotenv/config';
import {randomUUID} from 'node:crypto';
import {z} from 'zod';
import {createPool} from './db.js';
import {hashPassword} from './live.js';
const config=z.object({DATABASE_URL:z.string().min(1),BOOTSTRAP_EMAIL:z.email(),BOOTSTRAP_PASSWORD:z.string().min(12).max(128),BOOTSTRAP_NAME:z.string().min(2).max(100)}).parse(process.env);
const pool=createPool(config.DATABASE_URL);const c=await pool.connect();
try{await c.query('BEGIN');await c.query('SELECT pg_advisory_xact_lock(61584323)');const exists=await c.query("SELECT id FROM app_users WHERE role='superadmin'");if(exists.rowCount)throw new Error('Superadmin already exists. Bootstrap is disabled.');await c.query("INSERT INTO app_users(id,email,display_name,password_hash,role,academy_id) VALUES($1,$2,$3,$4,'superadmin',NULL)",[randomUUID(),config.BOOTSTRAP_EMAIL.toLowerCase(),config.BOOTSTRAP_NAME,await hashPassword(config.BOOTSTRAP_PASSWORD)]);await c.query('COMMIT');console.log('Initial superadmin created. Remove BOOTSTRAP_* variables now.')}catch(e){await c.query('ROLLBACK');throw e}finally{c.release();await pool.end()}
