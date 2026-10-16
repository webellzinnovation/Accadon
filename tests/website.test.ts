import {test} from 'node:test';import assert from 'node:assert/strict';import request from 'supertest';import {PGlite} from '@electric-sql/pglite';import {readFileSync} from 'node:fs';import {randomUUID} from 'node:crypto';import type pg from 'pg';import {createApp} from '../server/app.js';import {hashPassword} from '../server/live.js';
const origin='http://127.0.0.1:5173';const pw='Synthetic-test-only-password';
async function setup(){const db=new PGlite();for(const f of ['003_live_foundation','004_parent_workspace','005_partner_portals','006_superadmin_console','007_websites'])await db.exec(readFileSync(`db/migrations/${f}.sql`,'utf8'));const query=async(sql:string,p?:unknown[])=>{const r=await db.query(sql,p);return{rows:r.rows,rowCount:r.rows.length||r.affectedRows||0}};const pool={query,connect:async()=>({query,release(){}})} as unknown as pg.Pool;const a=randomUUID(),b=randomUUID();await query("INSERT INTO academies(id,name,city) VALUES($1,'Synthetic academy A','Testville'),($2,'Synthetic academy B','Otherville')",[a,b]);const hash=await hashPassword(pw);const ids:Record<string,string>={};for(const [name,role,academy]of [['admin','academy_admin',a],['org','organizer',a],['adminb','academy_admin',b]]){const id=randomUUID();ids[name!]=id;await query('INSERT INTO app_users(id,email,display_name,password_hash,role,academy_id) VALUES($1,$2,$3,$4,$5,$6)',[id,`${name}@example.test`,name,hash,role,academy])}await query("INSERT INTO academy_subscriptions(id,academy_id,plan_id,status) VALUES($1,$2,'pro','active'),($3,$4,'free','active')",[randomUUID(),a,randomUUID(),b]);const app=createApp(undefined,pool);async function login(name:string){const r=await request(app).post('/api/live/login').set('Origin',origin).send({email:`${name}@example.test`,password:pw,portal:'partner'});assert.equal(r.status,200,JSON.stringify(r.body));return r.headers['set-cookie'][0].split(';')[0]}return{db,query,app,a,b,ids,login}}

test('public site endpoint serves only published sites with real academy data',async()=>{const s=await setup();try{
 const admin=await s.login('admin');
 await request(s.app).put('/api/live/partner/website').set('Origin',origin).set('Cookie',admin).send({template_id:'classic-club',slug:'synthetic-a',sections:{hero:{title:'Academy A'}}});
 assert.equal((await request(s.app).get('/api/live/sites/synthetic-a')).status,404,'unpublished site must not be public');
 await request(s.app).post('/api/live/partner/website/publish').set('Origin',origin).set('Cookie',admin).send({published:true});
 const r=await request(s.app).get('/api/live/sites/synthetic-a');assert.equal(r.status,200,JSON.stringify(r.body));
 assert.equal(r.body.site.template_id,'classic-club');assert.equal(r.body.site.name,'Synthetic academy A');assert.equal(r.body.site.city,'Testville');
 assert.deepEqual(r.body.site.sports,[]);assert.deepEqual(r.body.site.tournaments,[]);
 assert.deepEqual(r.body.site.coaches,['admin','org'],'admin and organizer names listed');
 assert.equal((await request(s.app).get('/api/live/sites/no-such-slug')).status,404);
}finally{await s.db.close()}});

test('website settings require an academy admin session and validate input',async()=>{const s=await setup();try{
 assert.equal((await request(s.app).get('/api/live/partner/website')).status,401);
 const admin=await s.login('admin'),org=await s.login('org'),adminb=await s.login('adminb');
 assert.equal((await request(s.app).put('/api/live/partner/website').set('Origin',origin).set('Cookie',org).send({template_id:'vibrant-pulse',slug:'org-slug',sections:{}})).status,403);
 assert.equal((await request(s.app).put('/api/live/partner/website').set('Origin',origin).set('Cookie',admin).send({template_id:'not-a-template',slug:'bad',sections:{}})).status,422);
 assert.equal((await request(s.app).put('/api/live/partner/website').set('Origin',origin).set('Cookie',admin).send({template_id:'vibrant-pulse',slug:'INVALID SLUG!',sections:{}})).status,422);
 assert.equal((await request(s.app).put('/api/live/partner/website').set('Origin',origin).set('Cookie',admin).send({template_id:'vibrant-pulse',slug:'synthetic-a',sections:{}})).status,200);
 assert.equal((await request(s.app).put('/api/live/partner/website').set('Origin',origin).set('Cookie',adminb).send({template_id:'vibrant-pulse',slug:'synthetic-a',sections:{}})).status,409,'slug clash across academies');
 const mine=(await request(s.app).get('/api/live/partner/website').set('Cookie',admin)).body;
 assert.equal(mine.website_included,true);assert.equal(mine.site.slug,'synthetic-a');
 const other=(await request(s.app).get('/api/live/partner/website').set('Cookie',adminb)).body;
 assert.equal(other.website_included,false,'free plan does not include the website builder');
}finally{await s.db.close()}});

test('publishing is gated on the plan website entitlement and onboarding',async()=>{const s=await setup();try{
 const admin=await s.login('admin'),adminb=await s.login('adminb');
 await request(s.app).put('/api/live/partner/website').set('Origin',origin).set('Cookie',adminb).send({template_id:'soft-mist',slug:'synthetic-b',sections:{}});
 const blocked=await request(s.app).post('/api/live/partner/website/publish').set('Origin',origin).set('Cookie',adminb).send({published:true});
 assert.equal(blocked.status,402,'free plan cannot publish a website');
 await request(s.app).put('/api/live/partner/website').set('Origin',origin).set('Cookie',admin).send({template_id:'vibrant-pulse',slug:'synthetic-a',sections:{}});
 await s.query('UPDATE academies SET published=false WHERE id=$1',[s.a]);
 assert.equal((await request(s.app).post('/api/live/partner/website/publish').set('Origin',origin).set('Cookie',admin).send({published:true})).status,409,'onboarding incomplete blocks publish');
 await s.query('UPDATE academies SET published=true WHERE id=$1',[s.a]);
 assert.equal((await request(s.app).post('/api/live/partner/website/publish').set('Origin',origin).set('Cookie',admin).send({published:true})).status,200);
 assert.equal((await request(s.app).get('/api/live/sites/synthetic-a')).status,200);
 assert.equal((await request(s.app).post('/api/live/partner/website/publish').set('Origin',origin).set('Cookie',admin).send({published:false})).status,200);
 assert.equal((await request(s.app).get('/api/live/sites/synthetic-a')).status,404,'unpublished site is no longer public');
}finally{await s.db.close()}});
