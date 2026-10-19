// TEST-ONLY: isolated embedded Postgres for browser verification. Never imported by production.
import {PGlite} from '@electric-sql/pglite';import {readFileSync} from 'node:fs';import {randomUUID} from 'node:crypto';import type pg from 'pg';import {createApp} from '../server/app.js';import {hashPassword} from '../server/live.js';
const db=new PGlite();for(const f of ['001_inquiries','002_academy_inquiries','003_live_foundation','004_parent_workspace','005_partner_portals','006_superadmin_console','007_websites','008_independent_organizers','009_draws','010_coaching', '011_notifications', '012_payments'])await db.exec(readFileSync(`db/migrations/${f}.sql`,'utf8'));
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
if(process.env.FIXTURE_COACH==='1'){
const cAcad=randomUUID(),cAdm=randomUUID(),cCoach=randomUUID();
await query("INSERT INTO academies(id,name,city) VALUES($1,'Coaching Test Academy','Bengaluru')",[cAcad]);
await query("INSERT INTO app_users(id,email,display_name,password_hash,role,academy_id) VALUES($1,'coach-admin@example.test','Coaching Admin',$2,'academy_admin',$3),($4,'coach@example.test','Kavya Coach',$2,'coach',$3)",[cAdm,await hashPassword('Browser-test-only-password'),cAcad,cCoach]);
await query("INSERT INTO academy_subscriptions(id,academy_id,plan_id,status) VALUES($1,$2,'pro','active')",[randomUUID(),cAcad]);
const profs:string[]=[];
for(let i=0;i<3;i++){const u=randomUUID(),pr=randomUUID();profs.push(pr);await query(`INSERT INTO app_users(id,email,display_name,password_hash,role) VALUES($1,$2,$3,$4,'player')`,[u,`coachp${i+1}@example.test`,`Trainee Player ${i+1}`,await hashPassword('Browser-test-only-password')]);await query("INSERT INTO player_profiles(id,account_id,display_name) VALUES($1,$2,$3)",[pr,u,`Trainee Player ${i+1}`]);await query("INSERT INTO academy_memberships(id,academy_id,profile_id,sport,status,invited_by,accepted_at) VALUES($1,$2,$3,'badminton','active',$4,now())",[randomUUID(),cAcad,pr,cAdm])}
const bt=randomUUID();await query("INSERT INTO batches(id,academy_id,name,sport,coach_id,schedule_label,venue) VALUES($1,$2,'U-13 Badminton','badminton',$3,'Mon/Wed 5-6 PM','Court 2')",[bt,cAcad,cCoach]);
for(const pr of profs.slice(0,2))await query("INSERT INTO batch_members(id,batch_id,membership_id,added_by) SELECT $1,$2,id,$3 FROM academy_memberships WHERE profile_id=$4",[randomUUID(),bt,cAdm,pr]);
}
if(process.env.FIXTURE_HISTORY==='1'){
const hAcad=randomUUID(),hAdm=randomUUID(),hCoach=randomUUID(),hPar=randomUUID(),hKid=randomUUID(),hRR=randomUUID(),hOpen=randomUUID(),hDraw=randomUUID(),hBatch=randomUUID(),hMem=randomUUID();
const hHash=await hashPassword('Browser-test-only-password');
await query("INSERT INTO academies(id,name,city) VALUES($1,'History Test Academy','Bengaluru')",[hAcad]);
await query("INSERT INTO app_users(id,email,display_name,password_hash,role,academy_id) VALUES($1,'history-admin@example.test','History Admin',$2,'academy_admin',$3),($4,'history-coach@example.test','Rekha',$2,'coach',$3)",[hAdm,hHash,hAcad,hCoach]);
await query("INSERT INTO academy_subscriptions(id,academy_id,plan_id,status) VALUES($1,$2,'pro','active')",[randomUUID(),hAcad]);
await query("INSERT INTO app_users(id,email,display_name,password_hash,role) VALUES($1,'history-parent@example.test','History Parent',$2,'parent')",[hPar,hHash]);
await query("INSERT INTO parent_profiles(account_id,name,location) VALUES($1,'History Parent','Bengaluru')",[hPar]);
await query("INSERT INTO player_profiles(id,display_name) VALUES($1,'Aarav Kumar')",[hKid]);
await query("INSERT INTO guardian_profile_links(guardian_account_id,child_profile_id,relationship,status,verified_at) VALUES($1,$2,'parent','verified',now())",[hPar,hKid]);
await query("INSERT INTO profile_sports(profile_id,sport_id) VALUES($1,'badminton')",[hKid]);
await query("INSERT INTO tournaments(id,academy_id,owner_id,name,sport,format,status,venue,starts_on) VALUES($1,$2,$3,'Winter League','badminton','round_robin','published','Court 1','2026-11-05'),($4,$2,$3,'Monsoon Open','badminton','single_elimination','published','Court 3','2026-12-10')",[hRR,hAcad,hAdm,hOpen]);
const opp:string[]=[];
for(let i=0;i<3;i++){const u=randomUUID();opp.push(u);await query("INSERT INTO app_users(id,email,display_name,password_hash,role) VALUES($1,$2,$3,$4,'player')",[u,`history-rival${i+1}@example.test`,`Rival ${i+1}`,hHash]);await query("INSERT INTO tournament_entries(id,tournament_id,player_id,status) VALUES($1,$2,$3,'accepted')",[randomUUID(),hRR,u])}
await query("INSERT INTO tournament_entries(id,tournament_id,player_id,profile_id,status) VALUES($1,$2,$3,$4,'accepted')",[randomUUID(),hRR,hPar,hKid]);
await query("INSERT INTO tournament_entries(id,tournament_id,player_id,profile_id,status) VALUES($1,$2,$3,$4,'accepted')",[randomUUID(),hOpen,hPar,hKid]);
await query("INSERT INTO tournament_draws(id,tournament_id,format,status,created_by) VALUES($1,$2,'round_robin','active',$3)",[hDraw,hRR,hAdm]);
const[p1,p2,p3]=opp;
const ms:[number,number,string,string,number,number,string][]=[[1,1,hPar,p3,21,10,hPar],[1,2,p1,p2,19,21,p2],[2,1,hPar,p2,15,21,p2],[2,2,p3,p1,12,21,p1],[3,1,hPar,p1,21,18,hPar],[3,2,p2,p3,21,8,p2]];
for(const[r,pos,ma,mb,sa,sb,w]of ms)await query("INSERT INTO tournament_matches(id,draw_id,round,position,player_a,player_b,score_a,score_b,status,winner_id,played_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,'completed',$9,now())",[randomUUID(),hDraw,r,pos,ma,mb,sa,sb,w]);
await query("INSERT INTO academy_memberships(id,academy_id,profile_id,sport,status,invited_by,accepted_at) VALUES($1,$2,$3,'badminton','active',$4,now())",[hMem,hAcad,hKid,hAdm]);
await query("INSERT INTO batches(id,academy_id,name,sport,coach_id,schedule_label,venue) VALUES($1,$2,'U-13 Badminton','badminton',$3,'Mon/Wed 5-6 PM','Court 2')",[hBatch,hAcad,hCoach]);
await query("INSERT INTO batch_members(id,batch_id,membership_id,added_by) VALUES($1,$2,$3,$4)",[randomUUID(),hBatch,hMem,hAdm]);
await query("INSERT INTO assessments(id,academy_id,profile_id,batch_id,coach_id,assessed_on,rating,strengths,focus) VALUES($1,$2,$3,$4,$5,'2026-10-10',4,'Fast footwork and steady clears','Net shots under pressure')",[randomUUID(),hAcad,hKid,hBatch,hCoach]);
}
if(process.env.FIXTURE_PAYMENTS==='1'){
const pAcad=randomUUID(),pAcad2=randomUUID(),pAdm=randomUUID(),pPlay=randomUUID(),pProf=randomUUID(),pT=randomUUID(),pT2=randomUUID(),pT3=randomUUID(),pEntry=randomUUID(),pEntry2=randomUUID(),pEntry3=randomUUID();
const pHash=await hashPassword('Browser-test-only-password');
await query("INSERT INTO academies(id,name,city) VALUES($1,'Payments Test Academy','Bengaluru'),($2,'No-Gateway Academy','Mysuru')",[pAcad,pAcad2]);
await query("INSERT INTO app_users(id,email,display_name,password_hash,role,academy_id) VALUES($1,'pay-admin@example.test','Payments Admin',$2,'academy_admin',$3)",[pAdm,pHash,pAcad]);
await query("INSERT INTO academy_subscriptions(id,academy_id,plan_id,status) VALUES($1,$2,'pro','active'),($3,$4,'pro','active')",[randomUUID(),pAcad,randomUUID(),pAcad2]);
await query("INSERT INTO app_users(id,email,display_name,password_hash,role) VALUES($1,'pay-player@example.test','Fee Player',$2,'player')",[pPlay,pHash]);
await query("INSERT INTO player_profiles(id,account_id,display_name) VALUES($1,$2,'Fee Player')",[pProf,pPlay]);
await query("INSERT INTO tournaments(id,academy_id,owner_id,name,sport,format,status,venue,starts_on,entry_fee_paise) VALUES($1,$2,$3,'Diwali Open','badminton','round_robin','published','Court 1','2026-11-15',50000),($4,$2,$3,'Monsoon Pairs','badminton','single_elimination','published','Court 2','2026-12-01',20000),($5,$6,$3,'Charity Cup','badminton','round_robin','published','Hall C','2026-12-20',15000)",[pT,pAcad,pAdm,pT2,pT3,pAcad2]);
await query("INSERT INTO academy_payment_settings(academy_id,key_id,key_secret) VALUES($1,'rzp_test_DEMO1234','test-secret-demo')",[pAcad]);
await query("INSERT INTO tournament_entries(id,tournament_id,player_id,profile_id,status) VALUES($1,$2,$3,$4,'accepted'),($5,$6,$3,$4,'submitted'),($7,$8,$3,$4,'submitted')",[pEntry,pT,pPlay,pProf,pEntry2,pT2,pEntry3,pT3]);
await query("INSERT INTO payments(id,academy_id,tournament_id,entry_id,account_id,amount_paise,status,provider_order_id,provider_payment_id,receipt_no,paid_at) VALUES($1,$2,$3,$4,$5,50000,'paid','order_demoPAID1','pay_demoPAID1','RCPT-DEMOPAID01',now())",[randomUUID(),pAcad,pT,pEntry,pPlay]);
await query("INSERT INTO payments(id,academy_id,tournament_id,entry_id,account_id,amount_paise,status,provider_order_id) VALUES($1,$2,$3,$4,$5,20000,'created','order_demoOPEN1')",[randomUUID(),pAcad,pT2,pEntry2,pPlay]);
await query("INSERT INTO payments(id,academy_id,tournament_id,entry_id,account_id,amount_paise,status,error) VALUES($1,$2,$3,$4,$5,15000,'skipped_no_config','This academy has not connected its payment gateway yet. The entry is recorded and no payment was taken.')",[randomUUID(),pAcad2,pT3,pEntry3,pPlay]);
}
const server=createApp(undefined,pool).listen(3001,'127.0.0.1',()=>console.log('TEST FIXTURE READY'));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>{server.close(()=>{void db.close().then(()=>process.exit(0))})});
