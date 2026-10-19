import express from 'express';
import {randomUUID,createHmac,timingSafeEqual} from 'node:crypto';
import {z} from 'zod';
import type pg from 'pg';
import type {Actor} from './live.js';
import {notify} from './notifications.js';

// Payments are test mode only: each academy connects its own Razorpay TEST keys.
// When no gateway is configured the payment is honestly recorded as
// skipped_no_config and the entry stands - nothing pretends to charge.
const inr=(paise:number)=>`₹${(paise/100).toLocaleString('en-IN',{maximumFractionDigits:2})}`;

export async function createEntryPayment(pool:pg.Pool,q:{query:pg.Pool['query']},entry:{id:string;tournament_id:string;player_id:string},t:{academy_id:string|null;name:string;entry_fee_paise:number}):Promise<{id:string;status:string;amount_paise:number;order_id:string|null;key_id:string|null}|null>{
 if(!t.entry_fee_paise||t.entry_fee_paise<=0)return null;
 const id=randomUUID();
 if(!t.academy_id){
  await q.query("INSERT INTO payments(id,academy_id,tournament_id,entry_id,account_id,amount_paise,status,error) VALUES($1,NULL,$2,$3,$4,$5,'skipped_no_config','Fee collection needs an academy gateway. This event stays free in this stage.')",[id,entry.tournament_id,entry.id,entry.player_id,t.entry_fee_paise]);
  return {id,status:'skipped_no_config',amount_paise:t.entry_fee_paise,order_id:null,key_id:null};
 }
 const s=(await q.query('SELECT key_id,key_secret FROM academy_payment_settings WHERE academy_id=$1',[t.academy_id])).rows[0];
 if(!s){
  await q.query("INSERT INTO payments(id,academy_id,tournament_id,entry_id,account_id,amount_paise,status,error) VALUES($1,$2,$3,$4,$5,$6,'skipped_no_config','This academy has not connected its payment gateway yet. The entry is recorded and no payment was taken.')",[id,t.academy_id,entry.tournament_id,entry.id,entry.player_id,t.entry_fee_paise]);
  return {id,status:'skipped_no_config',amount_paise:t.entry_fee_paise,order_id:null,key_id:null};
 }
 await q.query("INSERT INTO payments(id,academy_id,tournament_id,entry_id,account_id,amount_paise,status) VALUES($1,$2,$3,$4,$5,$6,'created')",[id,t.academy_id,entry.tournament_id,entry.id,entry.player_id,t.entry_fee_paise]);
 try{
  const r=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{'content-type':'application/json','authorization':'Basic '+Buffer.from(`${s.key_id}:${s.key_secret}`).toString('base64')},body:JSON.stringify({amount:t.entry_fee_paise,currency:'INR',receipt:id})});
  const body=await r.json().catch(()=>({}));
  if(!r.ok||!body.id)throw new Error(`Razorpay returned ${r.status}`);
  await q.query('UPDATE payments SET provider_order_id=$1 WHERE id=$2',[body.id,id]);
  return {id,status:'created',amount_paise:t.entry_fee_paise,order_id:body.id,key_id:s.key_id};
 }catch(e){
  await q.query("UPDATE payments SET status='failed',error=$1 WHERE id=$2",['The gateway could not create an order ('+(e instanceof Error?e.message:'unknown')+'). No payment was taken.',id]);
  return {id,status:'failed',amount_paise:t.entry_fee_paise,order_id:null,key_id:null};
 }
}

export function paymentsRouter(pool:pg.Pool){
 const router=express.Router();
 router.get('/payment-settings',async(_req,res,next)=>{try{const a=res.locals.actor as Actor;if(a.role!=='academy_admin'){res.status(403).json({error:'This role cannot perform that action.'});return}const s=(await pool.query('SELECT provider,mode,key_id,updated_at FROM academy_payment_settings WHERE academy_id=$1',[a.academy_id])).rows[0];res.json({configured:!!s,settings:s?{provider:s.provider,mode:s.mode,key_id:s.key_id,key_secret:'••••••••',updated_at:s.updated_at}:null,note:'Test mode only. Connect your academy\'s own Razorpay TEST keys (rzp_test_...). No live money moves in this stage.'})}catch(e){next(e)}});
 router.put('/payment-settings',async(req,res,next)=>{try{const a=res.locals.actor as Actor;if(a.role!=='academy_admin'){res.status(403).json({error:'This role cannot perform that action.'});return}const i=z.object({key_id:z.string().trim().min(8).max(80),key_secret:z.string().trim().min(8).max(120)}).parse(req.body);if(!i.key_id.startsWith('rzp_test_')){res.status(422).json({error:'Test mode only: use Razorpay TEST keys (key id starts with rzp_test_).'});return}await pool.query("INSERT INTO academy_payment_settings(academy_id,provider,mode,key_id,key_secret,updated_at) VALUES($1,'razorpay','test',$2,$3,now()) ON CONFLICT(academy_id) DO UPDATE SET key_id=$2,key_secret=$3,updated_at=now()",[a.academy_id,i.key_id,i.key_secret]);res.json({saved:true})}catch(e){next(e)}});
 router.get('/payments',async(_req,res,next)=>{try{const a=res.locals.actor as Actor;if(!['superadmin','academy_admin','player','family'].includes(a.role)){res.status(403).json({error:'This role cannot perform that action.'});return}const rows=await pool.query(`SELECT p.id,p.account_id,p.amount_paise,p.currency,p.status,p.receipt_no,p.error,p.created_at,p.paid_at,p.provider_order_id,t.name AS tournament_name,u.display_name AS player_name,s.key_id AS gateway_key_id FROM payments p JOIN tournaments t ON t.id=p.tournament_id JOIN app_users u ON u.id=p.account_id LEFT JOIN academy_payment_settings s ON s.academy_id=p.academy_id WHERE ($1::text='superadmin' OR ($1::text='academy_admin' AND p.academy_id=$2) OR ($1::text IN ('player','family') AND p.account_id=$3)) ORDER BY p.created_at DESC LIMIT 200`,[a.role,a.academy_id,a.id]);res.json({payments:rows.rows})}catch(e){next(e)}});
 router.post('/payments/:id/verify',async(req,res,next)=>{try{const a=res.locals.actor as Actor;const id=z.uuid().parse(req.params.id);const i=z.object({razorpay_payment_id:z.string().trim().min(4).max(80),razorpay_signature:z.string().trim().min(16).max(256)}).parse(req.body);const p=(await pool.query('SELECT * FROM payments WHERE id=$1',[id])).rows[0];if(!p||p.account_id!==a.id){res.status(404).json({error:'Payment not found.'});return}if(p.status!=='created'||!p.provider_order_id){res.status(409).json({error:'This payment is not awaiting verification.'});return}const s=(await pool.query('SELECT key_secret FROM academy_payment_settings WHERE academy_id=$1',[p.academy_id])).rows[0];if(!s){res.status(409).json({error:'The academy gateway is no longer configured.'});return}const expected=createHmac('sha256',s.key_secret).update(`${p.provider_order_id}|${i.razorpay_payment_id}`).digest('hex');const ok=expected.length===i.razorpay_signature.length&&timingSafeEqual(Buffer.from(expected),Buffer.from(i.razorpay_signature));if(!ok){await pool.query("UPDATE payments SET status='failed',error='The gateway signature did not match. No payment was recorded.',provider_payment_id=$1 WHERE id=$2",[i.razorpay_payment_id,id]);res.status(422).json({error:'Payment verification failed. No payment was recorded.'});return}const receipt='RCPT-'+id.replaceAll('-','').slice(0,10).toUpperCase();await pool.query("UPDATE payments SET status='paid',provider_payment_id=$1,receipt_no=$2,paid_at=now() WHERE id=$3",[i.razorpay_payment_id,receipt,id]);const t=(await pool.query('SELECT name FROM tournaments WHERE id=$1',[p.tournament_id])).rows[0];await notify(pool,p.account_id,{kind:'payment_received',title:'Entry fee paid',body:`Your ${inr(p.amount_paise)} entry fee for ${t?.name||'the tournament'} was received. Receipt ${receipt}.`,link:'#/app/payments',academyId:p.academy_id}).catch(()=>{});res.json({paid:true,receipt_no:receipt})}catch(e){next(e)}});
 router.get('/payments/:id/receipt',async(req,res,next)=>{try{const a=res.locals.actor as Actor;const id=z.uuid().parse(req.params.id);const p=(await pool.query(`SELECT p.id,p.amount_paise,p.currency,p.status,p.receipt_no,p.created_at,p.paid_at,p.account_id,p.academy_id,t.name AS tournament_name,u.display_name AS player_name,ac.name AS academy_name FROM payments p JOIN tournaments t ON t.id=p.tournament_id JOIN app_users u ON u.id=p.account_id LEFT JOIN academies ac ON ac.id=p.academy_id WHERE p.id=$1`,[id])).rows[0];if(!p||(a.role==='academy_admin'&&p.academy_id!==a.academy_id)||(['player','family'].includes(a.role)&&p.account_id!==a.id)||(!['superadmin','academy_admin','player','family'].includes(a.role))){res.status(404).json({error:'Receipt not found.'});return}if(p.status!=='paid'){res.status(409).json({error:'A receipt exists only after the fee is paid.'});return}res.json({receipt:p})}catch(e){next(e)}});
 return router;
}
