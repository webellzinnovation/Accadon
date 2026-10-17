import {test} from 'node:test';import assert from 'node:assert/strict';import request from 'supertest';import {PGlite} from '@electric-sql/pglite';import {readFileSync} from 'node:fs';import {randomUUID} from 'node:crypto';import type pg from 'pg';import {createApp} from '../server/app.js';import {hashPassword} from '../server/live.js';
const origin='http://127.0.0.1:5173';const pw='Synthetic-test-only-password';
async function setup(format='round_robin',playerCount=4){const db=new PGlite();for(const f of ['003_live_foundation','004_parent_workspace','005_partner_portals','006_superadmin_console','007_websites','008_independent_organizers','009_draws','010_coaching'])await db.exec(readFileSync(`db/migrations/${f}.sql`,'utf8'));const query=async(sql:string,p?:unknown[])=>{const r=await db.query(sql,p);return{rows:r.rows,rowCount:r.rows.length||r.affectedRows||0}};const pool={query,connect:async()=>({query,release(){}})} as unknown as pg.Pool;const a=randomUUID();await query("INSERT INTO academies(id,name) VALUES($1,'Draw academy')",[a]);const hash=await hashPassword(pw);const admin=randomUUID();await query("INSERT INTO app_users(id,email,display_name,password_hash,role,academy_id) VALUES($1,'admin@example.test','Admin',$2,'academy_admin',$3)",[admin,hash,a]);const players:string[]=[];for(let i=0;i<playerCount;i++){const p=randomUUID();players.push(p);await query(`INSERT INTO app_users(id,email,display_name,password_hash,role) VALUES($1,$2,$3,$4,'player')`,[p,`p${i+1}@example.test`,`Player ${i+1}`,hash])}const t=randomUUID();await query("INSERT INTO tournaments(id,academy_id,owner_id,name,sport,format,status) VALUES($1,$2,$3,'Draw cup','badminton',$4,'published')",[t,a,admin,format]);for(const p of players)await query("INSERT INTO tournament_entries(id,tournament_id,player_id,status) VALUES($1,$2,$3,'accepted')",[randomUUID(),t,p]);const app=createApp(undefined,pool);async function login(email:string,portal='partner'){const r=await request(app).post('/api/live/login').set('Origin',origin).send({email,password:pw,portal});assert.equal(r.status,200,JSON.stringify(r.body));return r.headers['set-cookie'][0].split(';')[0]}return{db,app,a,t,players,login}}

test('draw generation: round robin from accepted entries, archived on regenerate',async()=>{const s=await setup();try{
 const admin=await s.login('admin@example.test');
 const r=await request(s.app).post(`/api/live/tournaments/${s.t}/draw`).set('Origin',origin).set('Cookie',admin).send({});assert.equal(r.status,201,JSON.stringify(r.body));
 assert.equal(r.body.matches,6,'4 players round robin = 6 matches');assert.equal(r.body.entries,4);
 const view=await request(s.app).get(`/api/live/tournaments/${s.t}/draw`).set('Cookie',admin);assert.equal(view.status,200);
 assert.equal(view.body.matches.length,6);assert.equal(new Set(view.body.matches.map((m:{round:number})=>m.round)).size,3);
 assert(view.body.matches.every((m:{player_a_name:string})=>m.player_a_name),'names resolved');
 // regenerate: old draw archived, exactly one active
 const r2=await request(s.app).post(`/api/live/tournaments/${s.t}/draw`).set('Origin',origin).set('Cookie',admin).send({});assert.equal(r2.status,201);
 const draws=await s.db.query("SELECT status,count(*) FROM tournament_draws WHERE tournament_id=$1 GROUP BY status",[s.t]);
 assert.equal(draws.rows.find((d:{status:string})=>d.status==='active').count,1);assert.equal(draws.rows.find((d:{status:string})=>d.status==='archived').count,1);
}finally{await s.db.close()}});

test('draw generation refuses: under 2 accepted entries, unsupported format, wrong role',async()=>{const s=await setup('swiss',4);try{
 const admin=await s.login('admin@example.test');
 assert.equal((await request(s.app).post(`/api/live/tournaments/${s.t}/draw`).set('Origin',origin).set('Cookie',admin).send({})).status,422,'swiss not supported yet');
 await s.db.query("UPDATE tournaments SET format='round_robin' WHERE id=$1",[s.t]);
 const p1=await s.login('p1@example.test','workspace');
 assert.equal((await request(s.app).post(`/api/live/tournaments/${s.t}/draw`).set('Origin',origin).set('Cookie',p1).send({})).status,403);
 await s.db.query("UPDATE tournament_entries SET status='rejected' WHERE tournament_id=$1 AND player_id<>$2",[s.t,s.players[0]]);
 const r=await request(s.app).post(`/api/live/tournaments/${s.t}/draw`).set('Origin',origin).set('Cookie',admin).send({});
 assert.equal(r.status,422);assert(r.body.error.includes('2 accepted entries'));
}finally{await s.db.close()}});

test('scoring: round robin standings compute and publish honestly',async()=>{const s=await setup();try{
 const admin=await s.login('admin@example.test');
 await request(s.app).post(`/api/live/tournaments/${s.t}/draw`).set('Origin',origin).set('Cookie',admin).send({});
 const view=(await request(s.app).get(`/api/live/tournaments/${s.t}/draw`).set('Cookie',admin)).body;
 const m=view.matches[0];
 assert.equal((await request(s.app).post(`/api/live/matches/${m.id}/score`).set('Origin',origin).set('Cookie',admin).send({score_a:3,score_b:1})).status,200);
 const res=(await request(s.app).get(`/api/live/tournaments/${s.t}/results`).set('Cookie',admin)).body;
 assert.equal(res.format,'round_robin');assert.equal(res.complete,false);
 const leader=res.standings[0];assert.equal(leader.points,2);assert.equal(leader.won,1);
 // a player who entered can read results; an outsider cannot
 const p1=await s.login('p1@example.test','workspace');
 assert.equal((await request(s.app).get(`/api/live/tournaments/${s.t}/results`).set('Cookie',p1)).status,200);
}finally{await s.db.close()}});

test('single elimination: byes advance, winners progress, champion completes the tournament',async()=>{const s=await setup('single_elimination',3);try{
 const admin=await s.login('admin@example.test');
 const r=await request(s.app).post(`/api/live/tournaments/${s.t}/draw`).set('Origin',origin).set('Cookie',admin).send({});
 assert.equal(r.status,201);assert.equal(r.body.matches,3,'bracket of 4: 2 semifinal slots + final, one is a bye');
 const view=(await request(s.app).get(`/api/live/tournaments/${s.t}/draw`).set('Cookie',admin)).body;
 const semi=view.matches.find((m:{round:number;status:string})=>m.round===1&&m.status==='scheduled');
 const final=view.matches.find((m:{round:number})=>m.round===2);
 assert(final.player_a_name,'bye winner advanced into the final immediately');
 await request(s.app).post(`/api/live/matches/${semi.id}/score`).set('Origin',origin).set('Cookie',admin).send({score_a:2,score_b:0});
 const view2=(await request(s.app).get(`/api/live/tournaments/${s.t}/draw`).set('Cookie',admin)).body;
 const final2=view2.matches.find((m:{round:number})=>m.round===2);
 assert(final2.player_a&&final2.player_b,'both finalists known');
 assert.equal((await request(s.app).post(`/api/live/matches/${final2.id}/score`).set('Origin',origin).set('Cookie',admin).send({score_a:1,score_b:2})).status,200);
 const t=await s.db.query('SELECT status FROM tournaments WHERE id=$1',[s.t]);
 assert.equal(t.rows[0].status,'completed','final result completes the tournament');
 const res=(await request(s.app).get(`/api/live/tournaments/${s.t}/results`).set('Cookie',admin)).body;
 assert.equal(res.complete,true);assert(res.champion,'champion named');
 // knockout ties refused
}finally{await s.db.close()}});

test('knockout score edits lock once the next round is played',async()=>{const s=await setup('single_elimination',4);try{
 const admin=await s.login('admin@example.test');
 await request(s.app).post(`/api/live/tournaments/${s.t}/draw`).set('Origin',origin).set('Cookie',admin).send({});
 const view=(await request(s.app).get(`/api/live/tournaments/${s.t}/draw`).set('Cookie',admin)).body;
 const[s1,s2]=view.matches.filter((m:{round:number})=>m.round===1);
 assert.equal((await request(s.app).post(`/api/live/matches/${s1.id}/score`).set('Origin',origin).set('Cookie',admin).send({score_a:1,score_b:1})).status,422,'tie refused in knockout');
 await request(s.app).post(`/api/live/matches/${s1.id}/score`).set('Origin',origin).set('Cookie',admin).send({score_a:2,score_b:1});
 await request(s.app).post(`/api/live/matches/${s2.id}/score`).set('Origin',origin).set('Cookie',admin).send({score_a:2,score_b:0});
 const f=(await request(s.app).get(`/api/live/tournaments/${s.t}/draw`).set('Cookie',admin)).body.matches.find((m:{round:number})=>m.round===2);
 await request(s.app).post(`/api/live/matches/${f.id}/score`).set('Origin',origin).set('Cookie',admin).send({score_a:2,score_b:0});
 assert.equal((await request(s.app).post(`/api/live/matches/${s1.id}/score`).set('Origin',origin).set('Cookie',admin).send({score_a:0,score_b:2})).status,409,'locked after next round played');
}finally{await s.db.close()}});
