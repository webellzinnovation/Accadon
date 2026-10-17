// TEST-ONLY: isolated embedded Postgres for browser verification. Never imported by production.
import {PGlite} from '@electric-sql/pglite';import {readFileSync} from 'node:fs';import {randomUUID} from 'node:crypto';import type pg from 'pg';import {createApp} from '../server/app.js';import {hashPassword} from '../server/live.js';
const db=new PGlite();for(const f of ['001_inquiries','002_academy_inquiries','003_live_foundation','004_parent_workspace','005_partner_portals','006_superadmin_console','007_websites','008_independent_organizers','009_draws','010_coaching'])await db.exec(readFileSync(`db/migrations/${f}.sql`,'utf8'));
const query=async(sql:string,p?:unknown[])=>{const r=await db.query(sql,p);return{rows:r.rows,rowCount:r.rows.length||r.affectedRows||0}};const pool={query,connect:async()=>({query,release(){}})} as unknown as pg.Pool;
const id=randomUUID();await query("INSERT INTO app_users(id,email,display_name,password_hash,role) VALUES($1,$2,$3,$4,'superadmin')",[id,'synthetic-admin@example.test','Synthetic test admin',await hashPassword('Browser-test-only-password')]);
if(process.env.FIXTURE_WEBSITE==='1'){
const acad=randomUUID(),adm=randomUUID(),prof=randomUUID(),mem1=randomUUID(),mem2=randomUUID(),tourn=randomUUID();
await query("INSERT INTO academies(id,name,city) VALUES($1,'Demo City Racquets','Bengaluru')",[acad]);
await query("INSERT INTO app_users(id,email,display_name,password_hash,role,academy_id) VALUES($1,$2,$3,$4,'academy_admin',$5)",[adm,'admin@racquets.test','Demo Admin',await hashPassword('Browser-test-only-password'),acad]);
await query("INSERT INTO academy_subscriptions(id,academy_id,plan_id,status) VALUES($1,$2,'pro','active')",[randomUUID(),acad]);
await query("INSERT INTO player_profiles(id,display_name) VALUES($1,'Demo Player')",[prof]);
await query("INSERT INTO academy_memberships(id,academy_id,profile_id,sport,status,invited_by,accepted_at) VALUES($1,$2,$3,'table_tennis','active',$4,now()),($5,$2,$3,'badminton','active',$4,now())",[mem1,acad,prof,adm,mem2]);
await query("INSERT INTO tournaments(id,academy_id,owner_id,name,sport,format,status,venue,starts_on) VALUES($1,$2,$3,'City Open 2026','table_tennis','single_elimination','published','Demo Hall','2026-11-20')",[tourn,acad,adm]);
await query("INSERT INTO academy_websites(academy_id,template_id,slug,published,sections) VALUES($1,'vibrant-pulse','demo-racquets',true,$2)",[acad,JSON.stringify({hero:{title:'Demo City Racquets',subtitle:'Table tennis and badminton coaching in Bengaluru'},contact:{email:'hello@racquets.test',phone:'+91 90000 00000'}})]);
}
if(process.env.FIXTURE_DRAWS==='1'){
const dAcad=randomUUID(),dAdm=randomUUID(),rrT=randomUUID(),seT=randomUUID();
await query("INSERT INTO academies(id,name,city) VALUES($1,'Draws Test Academy','Pune')",[dAcad]);
await query("INSERT INTO app_users(id,email,display_name,password_hash,role,academy_id) VALUES($1,'draws-admin@example.test','Draws Admin',$2,'academy_admin',$3)",[dAdm,await hashPassword('Browser-test-only-password'),dAcad]);
await query("INSERT INTO academy_subscriptions(id,academy_id,plan_id,status) VALUES($1,$2,'pro','active')",[randomUUID(),dAcad]);
await query("INSERT INTO tournaments(id,academy_id,owner_id,name,sport,format,status,venue,starts_on) VALUES($1,$2,$3,'Winter Round Robin','badminton','round_robin','published','Hall A','2026-12-05'),($4,$2,$3,'Winter Knockout','badminton','single_elimination','published','Hall B','2026-12-12')",[rrT,dAcad,dAdm,seT]);
for(let i=0;i<5;i++){const p=randomUUID();await query(`INSERT INTO app_users(id,email,display_name,password_hash,role) VALUES($1,$2,$3,$4,'player')`,[p,`draws-p${i+1}@example.test`,`Draws Player ${i+1}`,await hashPassword('Browser-test-only-password')]);if(i<4)await query("INSERT INTO tournament_entries(id,tournament_id,player_id,status) VALUES($1,$2,$3,'accepted')",[randomUUID(),rrT,p]);await query("INSERT INTO tournament_entries(id,tournament_id,player_id,status) VALUES($1,$2,$3,'accepted')",[randomUUID(),seT,p]);}
}
const server=createApp(undefined,pool).listen(3001,'127.0.0.1',()=>console.log('TEST FIXTURE READY'));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>{server.close(()=>{void db.close().then(()=>process.exit(0))})});
