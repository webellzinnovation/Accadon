import {test} from 'node:test';import assert from 'node:assert/strict';import {PGlite} from '@electric-sql/pglite';import {readFileSync} from 'node:fs';import {randomUUID} from 'node:crypto';import type pg from 'pg';import request from 'supertest';import {createApp} from '../server/app.js';import {hashPassword} from '../server/live.js';
const pw='Browser-test-only-password',origin='http://127.0.0.1:5173';
async function setup(){const db=new PGlite();for(const f of ['001_inquiries','002_academy_inquiries','003_live_foundation','004_parent_workspace','005_partner_portals','006_superadmin_console','007_websites','008_independent_organizers','009_draws','010_coaching', '011_notifications'])await db.exec(readFileSync(`db/migrations/${f}.sql`,'utf8'));const query=async(sql:string,p?:unknown[])=>{const r=await db.query(sql,p);return{rows:r.rows,rowCount:r.rows.length||r.affectedRows||0}};const pool={query,connect:async()=>({query,release(){}})} as unknown as pg.Pool;
 const a=randomUUID();await query("INSERT INTO academies(id,name) VALUES($1,'Coach academy')",[a]);const hash=await hashPassword(pw);
 const admin=randomUUID(),coach=randomUUID(),coach2=randomUUID();
 await query("INSERT INTO app_users(id,email,display_name,password_hash,role,academy_id) VALUES($1,'admin@example.test','Admin',$2,'academy_admin',$3),($4,'coach@example.test','Coach One',$2,'coach',$3),($5,'coach2@example.test','Coach Two',$2,'coach',$3)",[admin,hash,a,coach,coach2]);
 const mkPlayer=async(n:number,sport='badminton')=>{const u=randomUUID(),pr=randomUUID(),m=randomUUID();await query(`INSERT INTO app_users(id,email,display_name,password_hash,role) VALUES($1,$2,$3,$4,'player')`,[u,`pl${n}@example.test`,`Player ${n}`,hash]);await query("INSERT INTO player_profiles(id,account_id,display_name) VALUES($1,$2,$3)",[pr,u,`Player ${n}`]);await query("INSERT INTO academy_memberships(id,academy_id,profile_id,sport,status,invited_by,accepted_at) VALUES($1,$2,$3,$4,'active',$5,now())",[m,a,pr,sport,admin]);return{u,pr,m}};
 const p1=await mkPlayer(1),p2=await mkPlayer(2),pF=await mkPlayer(3,'football');
 const app=createApp(undefined,pool);
 async function login(email:string,portal='workspace'){const r=await request(app).post('/api/live/login').set('Origin',origin).send({email,password:pw,portal});assert.equal(r.status,200,JSON.stringify(r.body));return r.headers['set-cookie'][0].split(';')[0]}
 return{db,app,a,admin,coach,coach2,p1,p2,pF,login}}
async function mkBatch(app:unknown,adminCookie:string,a:string,coach:string,sport='badminton'){const r=await request(app as Parameters<typeof request>[0]).post('/api/live/batches').set('Origin',origin).set('Cookie',adminCookie).send({name:`Batch ${sport}`,sport,coach_id:coach,schedule_label:'Mon 5-6 PM',venue:'Hall 1'});assert.equal(r.status,201,JSON.stringify(r.body));return r.body.id as string}

test('admin issues a coach account scoped to their academy',async(t)=>{const{app,a,login,db}=await setup();t.after(()=>db.close());const c=await login('admin@example.test','partner');
 const r=await request(app).post('/api/live/users').set('Origin',origin).set('Cookie',c).send({email:'coach3@example.test',display_name:'Coach Three',password:pw,role:'coach',academy_id:a});assert.equal(r.status,201,JSON.stringify(r.body));
 const bad=await request(app).post('/api/live/users').set('Origin',origin).set('Cookie',c).send({email:'coach4@example.test',display_name:'Coach Four',password:pw,role:'coach',academy_id:randomUUID()});assert.equal(bad.status,403)});

test('batches: create, scope, member add with sport and status checks',async(t)=>{const{app,a,coach,p1,pF,login,db}=await setup();t.after(()=>db.close());const c=await login('admin@example.test','partner');
 const b=await mkBatch(app,c,a,coach);
 const otherAcad=randomUUID();const r2=await request(app).post('/api/live/batches').set('Origin',origin).set('Cookie',c).send({name:'Foreign',sport:'badminton',coach_id:null,academy_id:otherAcad});assert.equal(r2.status,201); // academy_id in body ignored for admins: scoped to own academy
 const list=await request(app).get('/api/live/batches').set('Cookie',c);assert.equal(list.body.batches.length,2);assert.ok(list.body.batches.every((x:{academy_id:string})=>x.academy_id===a));
 const add=await request(app).post(`/api/live/batches/${b}/members`).set('Origin',origin).set('Cookie',c).send({membership_id:p1.m});assert.equal(add.status,201,JSON.stringify(add.body));
 const wrongSport=await request(app).post(`/api/live/batches/${b}/members`).set('Origin',origin).set('Cookie',c).send({membership_id:pF.m});assert.equal(wrongSport.status,422);
 const members=await request(app).get(`/api/live/batches/${b}/members`).set('Cookie',c);assert.equal(members.body.members.length,1)});

test('coach signs in at the workspace portal and sees only own batches',async(t)=>{const{app,a,coach,coach2,p1,login,db}=await setup();t.after(()=>db.close());const ac=await login('admin@example.test','partner');
 const b1=await mkBatch(app,ac,a,coach,'badminton');await mkBatch(app,ac,a,coach2,'badminton');
 await request(app).post(`/api/live/batches/${b1}/members`).set('Origin',origin).set('Cookie',ac).send({membership_id:p1.m});
 const cc=await login('coach@example.test','workspace');
 const list=await request(app).get('/api/live/batches').set('Cookie',cc);assert.equal(list.body.batches.length,1);assert.equal(list.body.batches[0].id,b1);
 const blocked=await request(app).post('/api/live/batches').set('Origin',origin).set('Cookie',cc).send({name:'Nope',sport:'badminton'});assert.equal(blocked.status,403);
 const partnerGate=await request(app).post('/api/live/login').set('Origin',origin).send({email:'coach@example.test',password:pw,portal:'partner'});assert.equal(partnerGate.status,401)});

test('assessments: coach records for own batch players only, edits own only',async(t)=>{const{app,a,coach,coach2,p1,p2,login,db}=await setup();t.after(()=>db.close());const ac=await login('admin@example.test','partner');
 const b=await mkBatch(app,ac,a,coach);await request(app).post(`/api/live/batches/${b}/members`).set('Origin',origin).set('Cookie',ac).send({membership_id:p1.m});
 const cc=await login('coach@example.test','workspace'),cc2=await login('coach2@example.test','workspace');
 const ok=await request(app).post('/api/live/assessments').set('Origin',origin).set('Cookie',cc).send({profile_id:p1.pr,batch_id:b,assessed_on:'2026-10-18',rating:4,strengths:'Solid footwork',focus:'Backhand consistency'});assert.equal(ok.status,201,JSON.stringify(ok.body));
 const notMember=await request(app).post('/api/live/assessments').set('Origin',origin).set('Cookie',cc).send({profile_id:p2.pr,assessed_on:'2026-10-18',rating:3,strengths:'',focus:''});assert.equal(notMember.status,422);
 const otherCoach=await request(app).post('/api/live/assessments').set('Origin',origin).set('Cookie',cc2).send({profile_id:p1.pr,batch_id:b,assessed_on:'2026-10-18',rating:3,strengths:'',focus:''});assert.equal(otherCoach.status,403);
 const adminBlocked=await request(app).post('/api/live/assessments').set('Origin',origin).set('Cookie',ac).send({profile_id:p1.pr,batch_id:b,assessed_on:'2026-10-18',rating:3,strengths:'',focus:''});assert.equal(adminBlocked.status,403);
 const edit=await request(app).patch(`/api/live/assessments/${ok.body.id}`).set('Origin',origin).set('Cookie',cc).send({rating:5});assert.equal(edit.status,200);
 const editOther=await request(app).patch(`/api/live/assessments/${ok.body.id}`).set('Origin',origin).set('Cookie',cc2).send({rating:1});assert.equal(editOther.status,403)});

test('players read only their own assessments',async(t)=>{const{app,a,coach,p1,p2,login,db}=await setup();t.after(()=>db.close());const ac=await login('admin@example.test','partner');
 const b=await mkBatch(app,ac,a,coach);await request(app).post(`/api/live/batches/${b}/members`).set('Origin',origin).set('Cookie',ac).send({membership_id:p1.m});
 const cc=await login('coach@example.test','workspace');await request(app).post('/api/live/assessments').set('Origin',origin).set('Cookie',cc).send({profile_id:p1.pr,batch_id:b,assessed_on:'2026-10-18',rating:4,strengths:'Solid footwork',focus:'Backhand'});
 const pc=await login('pl1@example.test','workspace');
 const mine=await request(app).get('/api/live/assessments').set('Cookie',pc);assert.equal(mine.body.assessments.length,1);assert.equal(mine.body.assessments[0].rating,4);
 const foreign=await request(app).get(`/api/live/assessments?profile_id=${p2.pr}`).set('Cookie',pc);assert.equal(foreign.status,403);
 const pc2=await login('pl2@example.test','workspace');const none=await request(app).get('/api/live/assessments').set('Cookie',pc2);assert.equal(none.body.assessments.length,0)});
