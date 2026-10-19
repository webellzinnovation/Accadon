import express from 'express';
import {randomUUID} from 'node:crypto';
import {z} from 'zod';
import type pg from 'pg';
import type {Actor} from './live.js';

export type Notice={kind:string;title:string;body:string;link?:string|null;academyId?:string|null};

// Best-effort delivery: the in-app notification is the record of truth; email is queued
// and only attempted when Brevo (free tier) env is configured. Nothing ever pretends to send.
export async function notify(pool:pg.Pool,accountId:string,n:Notice):Promise<void>{
 const id=randomUUID();
 await pool.query('INSERT INTO notifications(id,account_id,academy_id,kind,title,body,link) VALUES($1,$2,$3,$4,$5,$6,$7)',[id,accountId,n.academyId||null,n.kind,n.title,n.body,n.link||null]);
 const pref=(await pool.query('SELECT email_enabled FROM notification_prefs WHERE account_id=$1',[accountId])).rows[0];
 if(pref&&pref.email_enabled===false)return;
 const to=(await pool.query('SELECT email FROM app_users WHERE id=$1 AND active=true',[accountId])).rows[0]?.email;
 if(!to)return;
 const outboxId=randomUUID();
 const key=process.env.BREVO_API_KEY;const from=process.env.MAIL_FROM;
 if(!key||!from){
  await pool.query("INSERT INTO notification_email_outbox(id,notification_id,account_id,to_email,subject,body,status,provider,error) VALUES($1,$2,$3,$4,$5,$6,'skipped_no_config','brevo','Email is not configured on this deployment. Set BREVO_API_KEY and MAIL_FROM to enable delivery.')",[outboxId,id,accountId,to,n.title,n.body]);
  return;
 }
 try{
  const r=await fetch('https://api.brevo.com/v3/smtp/email',{method:'POST',headers:{'api-key':key,'content-type':'application/json'},body:JSON.stringify({sender:{email:from,name:'Accadon'},to:[{email:to}],subject:n.title,textContent:n.body})});
  if(r.ok)await pool.query("INSERT INTO notification_email_outbox(id,notification_id,account_id,to_email,subject,body,status,provider,sent_at) VALUES($1,$2,$3,$4,$5,$6,'sent','brevo',now())",[outboxId,id,accountId,to,n.title,n.body]);
  else await pool.query("INSERT INTO notification_email_outbox(id,notification_id,account_id,to_email,subject,body,status,provider,error) VALUES($1,$2,$3,$4,$5,$6,'failed','brevo',$7)",[outboxId,id,accountId,to,n.title,n.body,`Brevo returned ${r.status}`]);
 }catch(e){
  await pool.query("INSERT INTO notification_email_outbox(id,notification_id,account_id,to_email,subject,body,status,provider,error) VALUES($1,$2,$3,$4,$5,$6,'failed','brevo',$7)",[outboxId,id,accountId,to,n.title,n.body,'Delivery attempt failed before a provider response.']);
 }
}

export function notificationsRouter(pool:pg.Pool){
 const router=express.Router();
 router.get('/notifications',async(_req,res,next)=>{try{const a=res.locals.actor as Actor;const rows=await pool.query('SELECT id,kind,title,body,link,read_at,created_at FROM notifications WHERE account_id=$1 ORDER BY created_at DESC LIMIT 100',[a.id]);res.json({notifications:rows.rows})}catch(e){next(e)}});
 router.get('/notifications/unread-count',async(_req,res,next)=>{try{const a=res.locals.actor as Actor;const r=await pool.query('SELECT count(*)::int AS n FROM notifications WHERE account_id=$1 AND read_at IS NULL',[a.id]);res.json({unread:r.rows[0].n})}catch(e){next(e)}});
 router.post('/notifications/:id/read',async(req,res,next)=>{try{const a=res.locals.actor as Actor;const id=z.uuid().parse(req.params.id);const r=await pool.query('UPDATE notifications SET read_at=now() WHERE id=$1 AND account_id=$2 AND read_at IS NULL',[id,a.id]);if(!r.rowCount)res.status(404).json({error:'Notification not found.'});else res.json({read:true})}catch(e){next(e)}});
 router.post('/notifications/read-all',async(_req,res,next)=>{try{const a=res.locals.actor as Actor;await pool.query('UPDATE notifications SET read_at=now() WHERE account_id=$1 AND read_at IS NULL',[a.id]);res.json({read:true})}catch(e){next(e)}});
 router.get('/notification-prefs',async(_req,res,next)=>{try{const a=res.locals.actor as Actor;const p=(await pool.query('SELECT email_enabled FROM notification_prefs WHERE account_id=$1',[a.id])).rows[0];res.json({email_enabled:p?p.email_enabled:true,whatsapp_enabled:false,whatsapp_note:'WhatsApp notifications need API access, which is not configured. Nothing is sent over WhatsApp.'})}catch(e){next(e)}});
 router.put('/notification-prefs',async(req,res,next)=>{try{const a=res.locals.actor as Actor;const i=z.object({email_enabled:z.boolean()}).parse(req.body);await pool.query('INSERT INTO notification_prefs(account_id,email_enabled,updated_at) VALUES($1,$2,now()) ON CONFLICT(account_id) DO UPDATE SET email_enabled=$2,updated_at=now()',[a.id,i.email_enabled]);res.json({saved:true})}catch(e){next(e)}});
 router.get('/notification-email-log',async(_req,res,next)=>{try{const a=res.locals.actor as Actor;if(!['superadmin','academy_admin'].includes(a.role)){res.status(403).json({error:'This role cannot perform that action.'});return}const rows=await pool.query(`SELECT o.id,o.to_email,o.subject,o.status,o.provider,o.error,o.created_at,o.sent_at FROM notification_email_outbox o JOIN app_users u ON u.id=o.account_id LEFT JOIN notifications n ON n.id=o.notification_id WHERE ($1::uuid IS NULL OR u.academy_id=$1 OR n.academy_id=$1) ORDER BY o.created_at DESC LIMIT 100`,[a.role==='superadmin'?null:a.academy_id]);res.json({log:rows.rows})}catch(e){next(e)}});
 return router;
}
