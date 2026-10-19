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
 const hash=await hashPassword(pw);
 const acad=randomUUID();await query("INSERT INTO academies(id,name) VALUES($1,'History academy')",[acad]);
 const admin=randomUUID();await query("INSERT INTO app_users(id,email,display_name,password_hash,role,academy_id) VALUES($1,'hist-admin@example.test','Hist Admin',$2,'academy_admin',$3)",[admin,hash,acad]);
 const parent=randomUUID();await query("INSERT INTO app_users(id,email,display_name,password_hash,role) VALUES($1,'hist-parent@example.test','Hist Parent',$2,'parent')",[parent,hash]);
 await query("INSERT INTO parent_profiles(account_id,name) VALUES($1,'Hist Parent')",[parent]);
 const kid=randomUUID();await query("INSERT INTO player_profiles(id,display_name) VALUES($1,'Aarav Kid')",[kid]);
 await query("INSERT INTO guardian_profile_links(guardian_account_id,child_profile_id,relationship,status,verified_at) VALUES($1,$2,'parent','verified',now())",[parent,kid]);
 await query("INSERT INTO profile_sports(profile_id,sport_id) VALUES($1,'badminton')",[kid]);
 const app=createApp(undefined,pool);
 async function login(email:string,portal='workspace'){const r=await request(app).post('/api/live/login').set('Origin',origin).send({email,password:pw,portal});assert.equal(r.status,200,JSON.stringify(r.body));return r.headers['set-cookie'][0].split(';')[0]}
 async function mkPlayer(name:string){const u=randomUUID();await query("INSERT INTO app_users(id,email,display_name,password_hash,role) VALUES($1,$2,$3,$4,'player')",[u,`${name.toLowerCase().replace(/ /g,'')}@example.test`,name,hash]);return u}
 async function mkTournament(name:string,format:string){const t=randomUUID();await query("INSERT INTO tournaments(id,academy_id,owner_id,name,sport,format,status,venue,starts_on) VALUES($1,$2,$3,$4,'badminton',$5,'published','Hall','2026-12-01')",[t,acad,admin,name,format]);return t}
 async function entry(t:string,who:string,status='accepted',profile:string|null=null){const e=randomUUID();await query("INSERT INTO tournament_entries(id,tournament_id,player_id,profile_id,status) VALUES($1,$2,$3,$4,$5)",[e,t,who,profile,status]);return e}
 async function draw(t:string,format:string){const d=randomUUID();await query("INSERT INTO tournament_draws(id,tournament_id,format,status,created_by) VALUES($1,$2,$3,'active',$4)",[d,t,format,admin]);return d}
 async function match(d:string,round:number,position:number,a:string,b:string,sa:number,sb:number,winner:string){await query("INSERT INTO tournament_matches(id,draw_id,round,position,player_a,player_b,score_a,score_b,status,winner_id,played_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,'completed',$9,now())",[randomUUID(),d,round,position,a,b,sa,sb,winner])}
 return{db,query,app,acad,admin,parent,kid,login,mkPlayer,mkTournament,entry,draw,match}}

test('child history returns round robin matches, final standing, batches and assessments',async()=>{
 const{query,app,parent,kid,acad,admin,login,mkPlayer,mkTournament,entry,draw,match}=await setup();
 const t=await mkTournament('Winter League','round_robin');
 const p1=await mkPlayer('Hist Player 1'),p2=await mkPlayer('Hist Player 2'),p3=await mkPlayer('Hist Player 3');
 await entry(t,parent,'accepted',kid);await entry(t,p1);await entry(t,p2);await entry(t,p3);
 const d=await draw(t,'round_robin');
 await match(d,1,1,parent,p3,21,10,parent);await match(d,1,2,p1,p2,19,21,p2);
 await match(d,2,1,parent,p2,15,21,p2);await match(d,2,2,p3,p1,12,21,p1);
 await match(d,3,1,parent,p1,21,18,parent);await match(d,3,2,p2,p3,21,8,p2);
 const coach=randomUUID(),hash='x';void hash;
 await query("INSERT INTO app_users(id,email,display_name,password_hash,role,academy_id) VALUES($1,'hist-coach@example.test','Rekha Coach',$2,'coach',$3)",[coach,await hashPassword(pw),acad]);
 const mem=randomUUID();await query("INSERT INTO academy_memberships(id,academy_id,profile_id,sport,status,invited_by,accepted_at) VALUES($1,$2,$3,'badminton','active',$4,now())",[mem,acad,kid,admin]);
 const batch=randomUUID();await query("INSERT INTO batches(id,academy_id,name,sport,coach_id,schedule_label,venue) VALUES($1,$2,'U-13 Badminton','badminton',$3,'Mon/Wed 5-6 PM','Court 2')",[batch,acad,coach]);
 await query("INSERT INTO batch_members(id,batch_id,membership_id,added_by) VALUES($1,$2,$3,$4)",[randomUUID(),batch,mem,admin]);
 await query("INSERT INTO assessments(id,academy_id,profile_id,batch_id,coach_id,assessed_on,rating,strengths,focus) VALUES($1,$2,$3,$4,$5,'2026-10-10',4,'Fast footwork','Net shots')",[randomUUID(),acad,kid,batch,coach]);
 const pc=await login('hist-parent@example.test');
 const r=await request(app).get(`/api/live/parent/kids/${kid}/history`).set('Cookie',pc);
 assert.equal(r.status,200,JSON.stringify(r.body));
 assert.equal(r.body.entries.length,1);
 const e=r.body.entries[0];
 assert.equal(e.name,'Winter League');assert.equal(e.draw_format,'round_robin');
 assert.equal(e.matches.length,3);
 const m1=e.matches.find((m:{round:number})=>m.round===1);
 assert.equal(m1.opponent_name,'Hist Player 3');assert.equal(m1.result,'won');assert.equal(m1.score_for,21);assert.equal(m1.score_against,10);
 const m2=e.matches.find((m:{round:number})=>m.round===2);
 assert.equal(m2.result,'lost');assert.equal(m2.score_for,15);
 assert.deepEqual(e.outcome,{kind:'round_robin',complete:true,rank:2,of:4,played:3,won:2,drawn:0,lost:1,points:4});
 assert.equal(r.body.batches.length,1);assert.equal(r.body.batches[0].name,'U-13 Badminton');assert.equal(r.body.batches[0].coach_name,'Rekha Coach');
 assert.equal(r.body.assessments.length,1);assert.equal(r.body.assessments[0].rating,4);assert.equal(r.body.assessments[0].batch_name,'U-13 Badminton');
});

test('elimination outcome and honest states for entries without a draw',async()=>{
 const{app,parent,kid,login,mkPlayer,mkTournament,entry,draw,match}=await setup();
 const t=await mkTournament('Spring Knockout','single_elimination');
 const q1=await mkPlayer('Hist Rival 1'),q2=await mkPlayer('Hist Rival 2'),q3=await mkPlayer('Hist Rival 3');
 await entry(t,parent,'accepted',kid);await entry(t,q1);await entry(t,q2);await entry(t,q3);
 const d=await draw(t,'single_elimination');
 await match(d,1,1,parent,q1,21,10,parent);await match(d,1,2,q2,q3,21,15,q2);
 await match(d,2,1,parent,q2,18,21,q2);
 const open=await mkTournament('Open Signups','single_elimination');
 await entry(open,parent,'accepted',kid);
 const pc=await login('hist-parent@example.test');
 const r=await request(app).get(`/api/live/parent/kids/${kid}/history`).set('Cookie',pc);
 assert.equal(r.status,200,JSON.stringify(r.body));
 const ko=r.body.entries.find((e:{name:string})=>e.name==='Spring Knockout');
 assert.equal(ko.outcome.kind,'elimination');assert.equal(ko.outcome.eliminated_round,2);assert.equal(ko.outcome.rounds,2);assert.equal(ko.outcome.champion,false);assert.equal(ko.outcome.complete,true);
 assert.equal(ko.matches.length,2);
 const noDraw=r.body.entries.find((e:{name:string})=>e.name==='Open Signups');
 assert.equal(noDraw.draw_format,null);assert.equal(noDraw.matches.length,0);assert.equal(noDraw.outcome,null);
});

test('history is scoped to the owning guardian account',async()=>{
 const{query,app,kid,login}=await setup();
 const pc=await login('hist-parent@example.test');
 const stranger=randomUUID();const hash=await hashPassword(pw);
 await query("INSERT INTO app_users(id,email,display_name,password_hash,role) VALUES($1,'stranger@example.test','Stranger Parent',$2,'parent')",[stranger,hash]);
 await query("INSERT INTO parent_profiles(account_id,name) VALUES($1,'Stranger Parent')",[stranger]);
 const sc=await login('stranger@example.test');
 const denied=await request(app).get(`/api/live/parent/kids/${kid}/history`).set('Cookie',sc);
 assert.equal(denied.status,404);
 const player=randomUUID();await query("INSERT INTO app_users(id,email,display_name,password_hash,role) VALUES($1,'plain-player@example.test','Plain Player',$2,'player')",[player,hash]);
 const plc=await login('plain-player@example.test');
 const forbidden=await request(app).get(`/api/live/parent/kids/${kid}/history`).set('Cookie',plc);
 assert.equal(forbidden.status,403);
 const ok=await request(app).get(`/api/live/parent/kids/${kid}/history`).set('Cookie',pc);
 assert.equal(ok.status,200);assert.deepEqual(ok.body,{entries:[],batches:[],assessments:[]});
});
