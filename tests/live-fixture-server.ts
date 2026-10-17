// TEST-ONLY: isolated embedded Postgres for browser verification. Never imported by production.
import {PGlite} from '@electric-sql/pglite';import {readFileSync} from 'node:fs';import {randomUUID} from 'node:crypto';import type pg from 'pg';import {createApp} from '../server/app.js';import {hashPassword} from '../server/live.js';
const db=new PGlite();for(const f of ['001_inquiries','002_academy_inquiries','003_live_foundation','004_parent_workspace','005_partner_portals','006_superadmin_console'])await db.exec(readFileSync(`db/migrations/${f}.sql`,'utf8'));
const query=async(sql:string,p?:unknown[])=>{const r=await db.query(sql,p);return{rows:r.rows,rowCount:r.rows.length||r.affectedRows||0}};const pool={query,connect:async()=>({query,release(){}})} as unknown as pg.Pool;
const id=randomUUID();await query("INSERT INTO app_users(id,email,display_name,password_hash,role) VALUES($1,$2,$3,$4,'superadmin')",[id,'synthetic-admin@example.test','Synthetic test admin',await hashPassword('Browser-test-only-password')]);
const server=createApp(undefined,pool).listen(3001,'127.0.0.1',()=>console.log('TEST FIXTURE READY'));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>{server.close(()=>{void db.close().then(()=>process.exit(0))})});
