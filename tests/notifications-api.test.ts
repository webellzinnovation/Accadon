import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {readFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import request from 'supertest';
import type pg from 'pg';
import {createApp} from '../server/app.js';
import {hashPassword} from '../server/live.js';

const origin='http://127.0.0.1:5173';const pw='Browser-test-only-password';
async function setup(){const db=new PGlite();for(const f of ['001_inquiries','002_academy_inquiries','003_live_foundation','004_parent_workspace','005_partner_portals','006_superadmin_console','007_websites','008_independent_organizers','009_draws','010_coaching','011_notifications', '012_payments'])await db.exec(readFileSync(`db/migrations/${f}.sql`,'utf8'));
 const query=async(sql:string,p?:unknown[])=>{const r=await db.query(sql,p);return{rows:r.rows,rowCount:r.rows.length||r.affectedRows||0}};const pool={query,connect:async()=>({query,release(){}})} as unknown as pg.Pool;
 const a=randomUUID();await query("INSERT INTO academies(id,name) VALUES($1,'Notify academy')",[a]);const hash=await hashPassword(pw);
 const admin=randomUUID();await query("INSERT INTO app_users(id,email,display_name,password_hash,role,academy_id) VALUES($1,'admin@example.test','Admin',$2,'academy_admin',$3)",[admin,hash,a]);
 const player=randomUUID();await query("INSERT INTO app_users(id,email,display_name,password_hash,role) VALUES($1,'player@example.test','Player One',$2,'player')",[player,hash]);
 const profile=randomUUID();await query("INSERT INTO player_profiles(id,account_id,display_name) VALUES($1,$2,'Player One')",[profile,player]);
 const t=randomUUID();await query("INSERT INTO tournaments(id,academy_id,owner_id,name,sport,format,status) VALUES($1,$2,$3,'Notify cup','badminton','round_robin','published')",[t,a,admin]);
 const app=createApp(undefined,pool);
 async function login(email:string,portal='workspace'){const r=await request(app).post('/api/live/login').set('Origin',origin).send({email,password:pw,portal});assert.equal(r.status,200,JSON.stringify(r.body));return r.headers['set-cookie'][0].split(';')[0]}
 return{db,query,app,a,admin,player,profile,t,login}}

test('entry decisions notify the player in-app and queue an honest no-config email record',async()=>{
 const{query,app,player,t,login}=await setup();
 const pc=await login('player@example.test');
 const entry=randomUUID();await query("INSERT INTO tournament_entries(id,tournament_id,player_id,status) VALUES($1,$2,$3,'submitted')",[entry,t,player]);
 const ac=await login('admin@example.test','partner');
 const r=await request(app).patch(`/api/live/entries/${entry}`).set('Cookie',ac).set('Origin',origin).send({status:'accepted'});
 assert.equal(r.status,200,JSON.stringify(r.body));
 const notes=(await query('SELECT * FROM notifications WHERE account_id=$1',[player])).rows;
 assert.equal(notes.length,1);assert.equal(notes[0].kind,'entry_accepted');assert(notes[0].body.includes('Notify cup'));
 const outbox=(await query('SELECT * FROM notification_email_outbox WHERE account_id=$1',[player])).rows;
 assert.equal(outbox.length,1);assert.equal(outbox[0].status,'skipped_no_config');
 const list=await request(app).get('/api/live/notifications').set('Cookie',pc);
 assert.equal(list.body.notifications.length,1);
 const unread=await request(app).get('/api/live/notifications/unread-count').set('Cookie',pc);
 assert.equal(unread.body.unread,1);
 const read=await request(app).post(`/api/live/notifications/${list.body.notifications[0].id}/read`).set('Cookie',pc).set('Origin',origin).send({});
 assert.equal(read.status,200);
 const unread2=await request(app).get('/api/live/notifications/unread-count').set('Cookie',pc);
 assert.equal(unread2.body.unread,0);
});

test('email preference off skips the outbox entirely; notifications stay isolated per account',async()=>{
 const{query,app,player,t,login}=await setup();
 const pc=await login('player@example.test');
 const pref=await request(app).put('/api/live/notification-prefs').set('Cookie',pc).set('Origin',origin).send({email_enabled:false});
 assert.equal(pref.status,200,JSON.stringify(pref.body));
 const entry=randomUUID();await query("INSERT INTO tournament_entries(id,tournament_id,player_id,status) VALUES($1,$2,$3,'submitted')",[entry,t,player]);
 const ac=await login('admin@example.test','partner');
 const rej=await request(app).patch(`/api/live/entries/${entry}`).set('Cookie',ac).set('Origin',origin).send({status:'rejected'});
 assert.equal(rej.status,200,JSON.stringify(rej.body));
 assert.equal((await query('SELECT * FROM notifications WHERE account_id=$1',[player])).rows.length,1);
 assert.equal((await query('SELECT * FROM notification_email_outbox WHERE account_id=$1',[player])).rows.length,0);
 // another user sees nothing and cannot touch the player's notification
 const other=randomUUID();const hash=await hashPassword(pw);await query("INSERT INTO app_users(id,email,display_name,password_hash,role) VALUES($1,'other@example.test','Other',$2,'player')",[other,hash]);
 const oc=await login('other@example.test');
 const list=await request(app).get('/api/live/notifications').set('Cookie',oc);
 assert.equal(list.body.notifications.length,0);
 const nid=(await query('SELECT id FROM notifications WHERE account_id=$1',[player])).rows[0].id;
 const foreign=await request(app).post(`/api/live/notifications/${nid}/read`).set('Cookie',oc).set('Origin',origin).send({});
 assert.equal(foreign.status,404);
});

test('assessments and batch adds notify the player account',async()=>{
 const{query,app,a,admin,player,profile,login}=await setup();
 const hash=await hashPassword(pw);
 const coach=randomUUID();await query("INSERT INTO app_users(id,email,display_name,password_hash,role,academy_id) VALUES($1,'coach@example.test','Kavya',$2,'coach',$3)",[coach,hash,a]);
 const membership=randomUUID();await query("INSERT INTO academy_memberships(id,academy_id,profile_id,sport,status,invited_by,accepted_at) VALUES($1,$2,$3,'badminton','active',$4,now())",[membership,a,profile,admin]);
 const batch=randomUUID();await query("INSERT INTO batches(id,academy_id,name,sport,coach_id) VALUES($1,$2,'U-13','badminton',$3)",[batch,a,coach]);
 const cc=await login('coach@example.test','workspace');
 const ac=await login('admin@example.test','partner');
 const add=await request(app).post(`/api/live/batches/${batch}/members`).set('Cookie',ac).set('Origin',origin).send({membership_id:membership});
 assert.equal(add.status,201,JSON.stringify(add.body));
 const kinds=async()=>(await query('SELECT kind FROM notifications WHERE account_id=$1 ORDER BY created_at',[player])).rows.map(r=>r.kind);
 assert.deepEqual(await kinds(),['batch_added']);
 const assess=await request(app).post('/api/live/assessments').set('Cookie',cc).set('Origin',origin).send({profile_id:profile,batch_id:batch,assessed_on:'2026-10-18',rating:4,strengths:'Quick feet',focus:'Backhand'});
 assert.equal(assess.status,201,JSON.stringify(assess.body));
 assert.deepEqual(await kinds(),['batch_added','assessment_recorded']);
});
