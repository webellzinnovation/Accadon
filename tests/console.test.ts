import {test} from 'node:test';import assert from 'node:assert/strict';import request from 'supertest';import {PGlite} from '@electric-sql/pglite';import {readFileSync} from 'node:fs';import {randomUUID} from 'node:crypto';import type pg from 'pg';import {createApp} from '../server/app.js';import {hashPassword} from '../server/live.js';
const origin='http://127.0.0.1:5173';const pw='Synthetic-test-only-password';
async function setup(){const db=new PGlite();for(const f of ['003_live_foundation','004_parent_workspace','005_partner_portals','006_superadmin_console'])await db.exec(readFileSync(`db/migrations/${f}.sql`,'utf8'));const query=async(sql:string,p?:unknown[])=>{const r=await db.query(sql,p);return{rows:r.rows,rowCount:r.rows.length||r.affectedRows||0}};const pool={query,connect:async()=>({query,release(){}})} as unknown as pg.Pool;const a=randomUUID(),b=randomUUID(),empty=randomUUID();await query('INSERT INTO academies(id,name) VALUES($1,$2),($3,$4),($5,$6)',[a,'Synthetic academy A',b,'Synthetic academy B',empty,'No-admin academy']);const hash=await hashPassword(pw);const ids:Record<string,string>={};for(const [name,role,academy]of [['root','superadmin',null],['admin','academy_admin',a],['org','organizer',a],['family','family',a],['adminb','academy_admin',b]]){const id=randomUUID();ids[name!]=id;await query('INSERT INTO app_users(id,email,display_name,password_hash,role,academy_id) VALUES($1,$2,$3,$4,$5,$6)',[id,`${name}@example.test`,name,hash,role,academy])}const app=createApp(undefined,pool);const portalFor:Record<string,string>={root:'superadmin',admin:'partner',org:'partner',adminb:'partner',family:'workspace'};async function login(name:string){const r=await request(app).post('/api/live/login').set('Origin',origin).send({email:`${name}@example.test`,password:pw,portal:portalFor[name]||'workspace'});assert.equal(r.status,200,JSON.stringify(r.body));return r.headers['set-cookie'][0].split(';')[0]}return{db,pool,app,a,b,empty,ids,login}}
const event=(a:string)=>({name:'Synthetic event',academy_id:a,sport:'badminton',format:'round_robin',status:'draft',venue:'Test venue',starts_on:'2026-12-01'});

test('console endpoints reject anonymous and non-superadmin callers',async()=>{const s=await setup();try{
 assert.equal((await request(s.app).get('/api/live/console/overview')).status,401);
 const admin=await s.login('admin'),family=await s.login('family');
 for(const cookie of [admin,family]){
  assert.equal((await request(s.app).get('/api/live/console/overview').set('Cookie',cookie)).status,403);
  assert.equal((await request(s.app).get('/api/live/console/users').set('Cookie',cookie)).status,403);
  assert.equal((await request(s.app).get('/api/live/console/plans').set('Cookie',cookie)).status,403);
  assert.equal((await request(s.app).get(`/api/live/console/academies/${s.a}`).set('Cookie',cookie)).status,403);
  assert.equal((await request(s.app).post(`/api/live/console/academies/${s.a}/impersonate`).set('Origin',origin).set('Cookie',cookie).send({})).status,403);
 }}finally{await s.db.close()}});

test('console overview, academy detail/edit and plans reflect seeded data',async()=>{const s=await setup();try{
 const root=await s.login('root');
 const overview=(await request(s.app).get('/api/live/console/overview').set('Cookie',root)).body;
 assert.equal(overview.academies.total,3);assert.equal(overview.users.total,5);assert(overview.tournaments.total===0);
 const plans=(await request(s.app).get('/api/live/console/plans').set('Cookie',root)).body.plans;
 assert.deepEqual(plans.map((p:{id:string})=>p.id),['free','pro','premium']);
 assert.equal(plans[0].limits.tournaments,2);assert.equal(plans[1].limits.website,true);assert.equal(plans[2].limits.custom_domain,true);
 const detail=(await request(s.app).get(`/api/live/console/academies/${s.a}`).set('Cookie',root)).body;
 assert.equal(detail.academy.name,'Synthetic academy A');assert.equal(detail.staff.length,3);assert.equal(detail.subscription,null);
 assert.equal((await request(s.app).get(`/api/live/console/academies/${randomUUID()}`).set('Cookie',root)).status,404);
 assert.equal((await request(s.app).patch(`/api/live/console/academies/${s.a}`).set('Origin',origin).set('Cookie',root).send({name:'Renamed academy',city:'Test city',published:true})).status,200);
 const renamed=(await request(s.app).get(`/api/live/console/academies/${s.a}`).set('Cookie',root)).body.academy;
 assert.equal(renamed.name,'Renamed academy');assert.equal(renamed.published,true);
 assert(detail.activity===undefined||(await request(s.app).get(`/api/live/console/academies/${s.a}`).set('Cookie',root)).body.activity.some((e:{action:string})=>e.action==='academy_updated'));
 // plans CRUD
 assert.equal((await request(s.app).post('/api/live/console/plans').set('Origin',origin).set('Cookie',root).send({id:'academy-plus',name:'Academy Plus',monthly_price_inr:4999,limits:{tournaments:null,website:true},sort:3})).status,201);
 assert.equal((await request(s.app).post('/api/live/console/plans').set('Origin',origin).set('Cookie',root).send({id:'academy-plus',name:'Dup',monthly_price_inr:1})).status,409);
 assert.equal((await request(s.app).patch('/api/live/console/plans/academy-plus').set('Origin',origin).set('Cookie',root).send({monthly_price_inr:3999,active:false})).status,200);
 assert.equal((await request(s.app).patch('/api/live/console/plans/missing').set('Origin',origin).set('Cookie',root).send({name:'Missing plan'})).status,404);
 const after=(await request(s.app).get('/api/live/console/plans').set('Cookie',root)).body.plans.find((p:{id:string})=>p.id==='academy-plus');
 assert.equal(after.monthly_price_inr,3999);assert.equal(after.active,false);
}finally{await s.db.close()}});

test('console user management: filters, deactivation revokes sessions, self and superadmin protected',async()=>{const s=await setup();try{
 const root=await s.login('root'),org=await s.login('org');
 const byRole=(await request(s.app).get('/api/live/console/users?role=organizer').set('Cookie',root)).body.users;
 assert(byRole.length>=1&&byRole.every((u:{role:string})=>u.role==='organizer'));
 const bySearch=(await request(s.app).get('/api/live/console/users?q=admin@').set('Cookie',root)).body.users;
 assert(bySearch.some((u:{email:string})=>u.email==='admin@example.test')&&!bySearch.some((u:{email:string})=>u.email==='org@example.test'));
 assert(!JSON.stringify(byRole).includes('password_hash'));
 assert.equal((await request(s.app).patch('/api/live/console/users/'+s.ids.root).set('Origin',origin).set('Cookie',root).send({active:false})).status,409);
 assert.equal((await request(s.app).patch(`/api/live/console/users/${s.ids.org}`).set('Origin',origin).set('Cookie',root).send({role:'player'})).status,200);
 assert.equal((await request(s.app).patch(`/api/live/console/users/${s.ids.org}`).set('Origin',origin).set('Cookie',root).send({role:'organizer'})).status,422);
 assert.equal((await request(s.app).patch(`/api/live/console/users/${s.ids.org}`).set('Origin',origin).set('Cookie',root).send({role:'organizer',academy_id:s.a})).status,200);
 assert.equal((await request(s.app).patch(`/api/live/console/users/${s.ids.org}`).set('Origin',origin).set('Cookie',root).send({active:false})).status,200);
 assert.equal((await request(s.app).get('/api/live/me').set('Cookie',org)).status,401);
}finally{await s.db.close()}});

test('owner registration starts a free trial with 2 tournament credits; publishing charges credits and blocks at zero with 402',async()=>{const s=await setup();try{
 const reg=await request(s.app).post('/api/live/partner/register').set('Origin',origin).send({email:'owner@example.test',display_name:'Synthetic Owner',password:pw,consent:true,account_type:'owner',academy_name:'Credit Academy',city:'Testville'});assert.equal(reg.status,201);
 const ownerLogin=await request(s.app).post('/api/live/login').set('Origin',origin).send({email:'owner@example.test',password:pw,portal:'partner'});const owner=ownerLogin.headers['set-cookie'][0].split(';')[0];
 const academy=(await request(s.app).get('/api/live/me').set('Cookie',owner)).body.academy;
 const sub=(await s.pool.query('SELECT plan_id,status,tournaments_credit FROM academy_subscriptions WHERE academy_id=$1',[academy.id])).rows[0];
 assert.equal(sub.plan_id,'free');assert.equal(sub.status,'trial');assert.equal(sub.tournaments_credit,2);
 const subView=(await request(s.app).get('/api/live/partner/subscription').set('Cookie',owner)).body;
 assert.equal(subView.subscription.plan_name,'Free');assert.equal(subView.used_tournaments,0);
 await request(s.app).put('/api/live/partner/onboarding').set('Origin',origin).set('Cookie',owner).send({step:1,data:{basics:{name:'Credit Academy',city:'Testville'}}});
 await request(s.app).put('/api/live/partner/onboarding').set('Origin',origin).set('Cookie',owner).send({step:2,data:{sports:{sports:['badminton']}}});
 assert.equal((await request(s.app).post('/api/live/partner/onboarding/complete').set('Origin',origin).set('Cookie',owner).send({})).status,200);
 for(let i=0;i<2;i++)assert.equal((await request(s.app).post('/api/live/tournaments').set('Origin',origin).set('Cookie',owner).send({...event(academy.id),status:'published'})).status,201);
 assert.equal((await s.pool.query('SELECT tournaments_credit FROM academy_subscriptions WHERE academy_id=$1',[academy.id])).rows[0].tournaments_credit,0);
 const blocked=await request(s.app).post('/api/live/tournaments').set('Origin',origin).set('Cookie',owner).send({...event(academy.id),status:'published'});
 assert.equal(blocked.status,402);assert.match(blocked.body.error,/used up/);
 // draft create + publish transition also charges; still blocked
 const draft=await request(s.app).post('/api/live/tournaments').set('Origin',origin).set('Cookie',owner).send(event(academy.id));assert.equal(draft.status,201);
 assert.equal((await request(s.app).put(`/api/live/tournaments/${draft.body.id}`).set('Origin',origin).set('Cookie',owner).send({...event(academy.id),status:'published'})).status,402);
 // upgrading to pro (uncapped) unblocks without touching credits
 const root=await s.login('root');
 assert.equal((await request(s.app).put(`/api/live/console/academies/${academy.id}/subscription`).set('Origin',origin).set('Cookie',root).send({plan_id:'pro',status:'active'})).status,200);
 assert.equal((await request(s.app).put(`/api/live/tournaments/${draft.body.id}`).set('Origin',origin).set('Cookie',owner).send({...event(academy.id),status:'published'})).status,200);
 const proView=(await request(s.app).get('/api/live/partner/subscription').set('Cookie',owner)).body;
 assert.equal(proView.subscription.plan_name,'Pro');assert.equal(proView.used_tournaments,3);
 assert.equal((await request(s.app).put(`/api/live/console/academies/${academy.id}/subscription`).set('Origin',origin).set('Cookie',root).send({plan_id:'missing',status:'active'})).status,422);
 assert.equal((await request(s.app).put(`/api/live/console/academies/${randomUUID()}/subscription`).set('Origin',origin).set('Cookie',root).send({plan_id:'pro',status:'active'})).status,404);
}finally{await s.db.close()}});

test('impersonation opens a 2h academy-admin view with restore cookie and audit trail, and ends cleanly',async()=>{const s=await setup();try{
 const root=await s.login('root');
 assert.equal((await request(s.app).post(`/api/live/console/academies/${s.empty}/impersonate`).set('Origin',origin).set('Cookie',root).send({})).status,422);
 const start=await request(s.app).post(`/api/live/console/academies/${s.a}/impersonate`).set('Origin',origin).set('Cookie',root).send({});
 assert.equal(start.status,200,JSON.stringify(start.body));assert.equal(start.body.as,'admin@example.test');
 const cookies=start.headers['set-cookie'].map((c:string)=>c.split(';')[0]);
 const sessionCookie=cookies.find((c:string)=>c.startsWith('accadon_session='));
 const restoreCookie=cookies.find((c:string)=>c.startsWith('accadon_impersonator='));
 assert(sessionCookie&&restoreCookie);assert(!restoreCookie.includes(root.split('=')[1])===false);
 const row=(await s.pool.query('SELECT user_id,impersonator_id,expires_at>now()+\'115 minutes\' AS long_enough,expires_at<now()+\'125 minutes\' AS capped FROM app_sessions WHERE impersonator_id IS NOT NULL')).rows[0];
 assert.equal(row.user_id,s.ids.admin);assert.equal(row.impersonator_id,s.ids.root);assert(row.long_enough&&row.capped);
 const both=[sessionCookie,restoreCookie].join('; ');
 const me=(await request(s.app).get('/api/live/me').set('Cookie',both)).body;
 assert.equal(me.user.email,'admin@example.test');assert.equal(me.impersonation.by.email,'root@example.test');
 // the impersonated view keeps academy-admin boundaries
 assert.equal((await request(s.app).get('/api/live/console/overview').set('Cookie',both)).status,403);
 assert.equal((await request(s.app).post('/api/live/console/impersonation/end').set('Origin',origin).set('Cookie',root).send({})).status,409);
 const end=await request(s.app).post('/api/live/console/impersonation/end').set('Origin',origin).set('Cookie',both).send({});
 assert.equal(end.status,200);
 const restored=end.headers['set-cookie'].map((c:string)=>c.split(';')[0]).find((c:string)=>c.startsWith('accadon_session='));
 assert.equal((await request(s.app).get('/api/live/me').set('Cookie',restored)).body.user.email,'root@example.test');
 assert.equal((await request(s.app).get('/api/live/me').set('Cookie',sessionCookie)).status,401);
 const actions=(await s.pool.query('SELECT action FROM audit_events WHERE action LIKE \'impersonation_%\' ORDER BY created_at')).rows.map((r:{action:string})=>r.action);
 assert.deepEqual(actions,['impersonation_started','impersonation_ended']);
}finally{await s.db.close()}});
