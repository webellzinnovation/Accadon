import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {readFileSync} from 'node:fs';
import {randomUUID,createHmac} from 'node:crypto';
import request from 'supertest';
import type pg from 'pg';
import {createApp} from '../server/app.js';
import {hashPassword} from '../server/live.js';

const origin='http://127.0.0.1:5173';const pw='Browser-test-only-password';
async function setup(feePaise=50000){const db=new PGlite();for(const f of ['001_inquiries','002_academy_inquiries','003_live_foundation','004_parent_workspace','005_partner_portals','006_superadmin_console','007_websites','008_independent_organizers','009_draws','010_coaching','011_notifications','012_payments'])await db.exec(readFileSync(`db/migrations/${f}.sql`,'utf8'));
 const query=async(sql:string,p?:unknown[])=>{const r=await db.query(sql,p);return{rows:r.rows,rowCount:r.rows.length||r.affectedRows||0}};const pool={query,connect:async()=>({query,release(){}})} as unknown as pg.Pool;
 const a=randomUUID();await query("INSERT INTO academies(id,name) VALUES($1,'Pay academy')",[a]);const hash=await hashPassword(pw);
 const admin=randomUUID();await query("INSERT INTO app_users(id,email,display_name,password_hash,role,academy_id) VALUES($1,'pay-admin@example.test','Pay Admin',$2,'academy_admin',$3)",[admin,hash,a]);
 const player=randomUUID();await query("INSERT INTO app_users(id,email,display_name,password_hash,role) VALUES($1,'pay-player@example.test','Pay Player',$2,'player')",[player,hash]);
 const profile=randomUUID();await query("INSERT INTO player_profiles(id,account_id,display_name) VALUES($1,$2,'Pay Player')",[profile,player]);
 const t=randomUUID();await query("INSERT INTO tournaments(id,academy_id,owner_id,name,sport,format,status,entry_fee_paise) VALUES($1,$2,$3,'Pay cup','badminton','round_robin','published',$4)",[t,a,admin,feePaise]);
 const app=createApp(undefined,pool);
 async function login(email:string,portal='workspace'){const r=await request(app).post('/api/live/login').set('Origin',origin).send({email,password:pw,portal});assert.equal(r.status,200,JSON.stringify(r.body));return r.headers['set-cookie'][0].split(';')[0]}
 return{db,query,app,a,admin,player,profile,t,login}}

test('gateway settings are academy-scoped, test-keys only, and the secret is never returned',async()=>{
 const{query,app,a,login}=await setup();
 const ac=await login('pay-admin@example.test','partner');
 const live=await request(app).put('/api/live/payment-settings').set('Cookie',ac).set('Origin',origin).send({key_id:'rzp_live_12345678',key_secret:'live-secret-1234'});
 assert.equal(live.status,422);assert(live.body.error.includes('Test mode only'));
 const put=await request(app).put('/api/live/payment-settings').set('Cookie',ac).set('Origin',origin).send({key_id:'rzp_test_ABC12345',key_secret:'test-secret-1234'});
 assert.equal(put.status,200,JSON.stringify(put.body));
 const get=await request(app).get('/api/live/payment-settings').set('Cookie',ac);
 assert.equal(get.body.configured,true);assert.equal(get.body.settings.mode,'test');assert.equal(get.body.settings.key_id,'rzp_test_ABC12345');assert.equal(get.body.settings.key_secret,'••••••••');
 // a player cannot read or write settings
 const pc=await login('pay-player@example.test');
 assert.equal((await request(app).get('/api/live/payment-settings').set('Cookie',pc)).status,403);
 assert.equal((await request(app).put('/api/live/payment-settings').set('Cookie',pc).set('Origin',origin).send({key_id:'rzp_test_XYZ12345',key_secret:'test-secret-9999'})).status,403);
 // an admin of another academy sees only their own academy's settings (none yet)
 const oa=randomUUID();const other=randomUUID();const hash=await hashPassword(pw);
 await query("INSERT INTO academies(id,name) VALUES($1,'Other academy')",[oa]);
 await query("INSERT INTO app_users(id,email,display_name,password_hash,role,academy_id) VALUES($1,'other-admin@example.test','Other Admin',$2,'academy_admin',$3)",[other,hash,oa]);
 const oc=await login('other-admin@example.test','partner');
 const oget=await request(app).get('/api/live/payment-settings').set('Cookie',oc);
 assert.equal(oget.body.configured,false);assert.equal(oget.body.settings,null);
 void a;
});

test('fee entry without a gateway records an honest skipped_no_config payment; free entries create none',async()=>{
 const{query,app,player,t,login}=await setup(50000);
 const pc=await login('pay-player@example.test');
 const r=await request(app).post('/api/live/entries').set('Cookie',pc).set('Origin',origin).send({tournament_id:t});
 assert.equal(r.status,201,JSON.stringify(r.body));
 assert.equal(r.body.payment.status,'skipped_no_config');assert.equal(r.body.payment.amount_paise,50000);
 const rows=(await query('SELECT * FROM payments WHERE account_id=$1',[player])).rows;
 assert.equal(rows.length,1);assert.equal(rows[0].status,'skipped_no_config');assert(rows[0].error.includes('has not connected'));
 const list=await request(app).get('/api/live/payments').set('Cookie',pc);
 assert.equal(list.body.payments.length,1);assert.equal(list.body.payments[0].tournament_name,'Pay cup');
 // free tournament: no payment row
 const free=randomUUID();await query("INSERT INTO tournaments(id,academy_id,owner_id,name,sport,format,status) VALUES($1,(SELECT academy_id FROM tournaments WHERE id=$2),$3,'Free cup','badminton','round_robin','published')",[free,t,player]);
 const r2=await request(app).post('/api/live/entries').set('Cookie',pc).set('Origin',origin).send({tournament_id:free});
 assert.equal(r2.status,201,JSON.stringify(r2.body));assert.equal(r2.body.payment,null);
 assert.equal((await query('SELECT count(*)::int AS n FROM payments WHERE account_id=$1',[player])).rows[0].n,1);
});

test('signature-verified mark-paid issues a receipt; bad signatures fail honestly; receipts are scoped',async()=>{
 const{query,app,a,player,t,login}=await setup(50000);
 await query("INSERT INTO academy_payment_settings(academy_id,key_id,key_secret) VALUES($1,'rzp_test_ABC12345','test-secret-1234')",[a]);
 const entry=randomUUID();await query("INSERT INTO tournament_entries(id,tournament_id,player_id,status) VALUES($1,$2,$3,'submitted')",[entry,t,player]);
 const pay=randomUUID();await query("INSERT INTO payments(id,academy_id,tournament_id,entry_id,account_id,amount_paise,status,provider_order_id) VALUES($1,$2,$3,$4,$5,50000,'created','order_testABC')",[pay,a,t,entry,player]);
 const pc=await login('pay-player@example.test');
 // bad signature fails honestly
 const bad=await request(app).post(`/api/live/payments/${pay}/verify`).set('Cookie',pc).set('Origin',origin).send({razorpay_payment_id:'pay_BAD123',razorpay_signature:'0'.repeat(64)});
 assert.equal(bad.status,422);
 let row=(await query('SELECT * FROM payments WHERE id=$1',[pay])).rows[0];
 assert.equal(row.status,'failed');assert(row.error.includes('did not match'));
 // reset to created and verify properly
 await query("UPDATE payments SET status='created',error=NULL WHERE id=$1",[pay]);
 const sig=createHmac('sha256','test-secret-1234').update('order_testABC|pay_OK12345').digest('hex');
 const ok=await request(app).post(`/api/live/payments/${pay}/verify`).set('Cookie',pc).set('Origin',origin).send({razorpay_payment_id:'pay_OK12345',razorpay_signature:sig});
 assert.equal(ok.status,200,JSON.stringify(ok.body));assert(ok.body.receipt_no.startsWith('RCPT-'));
 row=(await query('SELECT * FROM payments WHERE id=$1',[pay])).rows[0];
 assert.equal(row.status,'paid');assert(row.receipt_no===ok.body.receipt_no);assert(row.paid_at);
 // player notified in-app
 const notes=(await query("SELECT * FROM notifications WHERE account_id=$1 AND kind='payment_received'",[player])).rows;
 assert.equal(notes.length,1);assert(notes[0].body.includes('₹500'));
 // receipt visible to owner and academy admin, 409 before paid, hidden from others
 const rc=await request(app).get(`/api/live/payments/${pay}/receipt`).set('Cookie',pc);
 assert.equal(rc.status,200);assert.equal(rc.body.receipt.receipt_no,ok.body.receipt_no);assert.equal(rc.body.receipt.academy_name,'Pay academy');
 const ac=await login('pay-admin@example.test','partner');
 assert.equal((await request(app).get(`/api/live/payments/${pay}/receipt`).set('Cookie',ac)).status,200);
 const stranger=randomUUID();const hash=await hashPassword(pw);await query("INSERT INTO app_users(id,email,display_name,password_hash,role) VALUES($1,'stranger@example.test','Stranger',$2,'player')",[stranger,hash]);
 const sc=await login('stranger@example.test');
 assert.equal((await request(app).get(`/api/live/payments/${pay}/receipt`).set('Cookie',sc)).status,404);
 assert.equal((await request(app).post(`/api/live/payments/${pay}/verify`).set('Cookie',sc).set('Origin',origin).send({razorpay_payment_id:'pay_X1',razorpay_signature:'1'.repeat(64)})).status,404);
});
