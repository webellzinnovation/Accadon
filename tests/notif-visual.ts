import {chromium} from 'playwright';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';import {mkdir} from 'node:fs/promises';
const vite=spawn('node',['node_modules/vite/bin/vite.js','--host','127.0.0.1'],{stdio:'ignore'});let browser;
try{await mkdir('artifacts/notifications',{recursive:true});browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const width of [1440,390]){const server=spawn('node',['--import','tsx','tests/live-fixture-server.ts'],{stdio:['ignore','pipe','inherit'],env:{...process.env,FIXTURE_COACH:'1'}});await new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Fixture timeout')),20000);server.stdout.on('data',d=>{if(String(d).includes('READY')){clearTimeout(timer);resolve()}})});try{
 const errors:string[]=[];
 // coach records an assessment -> notifies the player
 const cpage=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});cpage.on('pageerror',e=>errors.push(e.message));
 await cpage.goto('http://127.0.0.1:5173/app');
 await cpage.getByLabel('Email',{exact:true}).fill('coach@example.test');await cpage.getByLabel('Password',{exact:true}).fill('Browser-test-only-password');await cpage.getByRole('button',{name:'Sign in ↗',exact:true}).click();
 await cpage.getByRole('heading',{name:'My batches'}).waitFor();
 await cpage.locator('.live-record').filter({hasText:'U-13 Badminton'}).getByRole('button',{name:'Players ↗'}).click();
 await cpage.getByRole('button',{name:'Assess ↗'}).first().click();
 await cpage.getByRole('heading',{name:'Record an assessment'}).waitFor();
 await cpage.getByLabel('Player').selectOption({index:1});
 await cpage.getByLabel('Overall rating').selectOption('4');
 await cpage.getByLabel('Strengths').fill('Quick feet, honest effort.');
 await cpage.getByLabel('Next focus').fill('Backhand clears under pressure.');
 await cpage.getByRole('button',{name:'Record assessment'}).click();
 await cpage.getByText('Assessment recorded. The player can read it now.').waitFor();
 await cpage.close();
 // player: unread badge, notification card, mark read, prefs
 const ppage=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});ppage.on('pageerror',e=>errors.push(e.message));
 await ppage.goto('http://127.0.0.1:5173/app');
 await ppage.getByLabel('Email',{exact:true}).fill('coachp1@example.test');await ppage.getByLabel('Password',{exact:true}).fill('Browser-test-only-password');await ppage.getByRole('button',{name:'Sign in ↗',exact:true}).click();
 await ppage.getByRole('button',{name:'Sign out'}).waitFor();
 const tab=ppage.getByRole('button',{name:/Notifications/});
 await ppage.getByRole('button',{name:'Notifications (1)'}).waitFor();
 await tab.click();
 await ppage.getByText('New assessment from your coach').waitFor();
 await ppage.getByText('WhatsApp notifications need API access').waitFor();
 assert.equal(await ppage.locator('.live-record .ui-chip.green',{hasText:'new'}).count(),1,'one unread card');
 await ppage.screenshot({path:`artifacts/notifications/player-notifs-${width}.png`,fullPage:true});
 await ppage.getByRole('button',{name:'Mark read',exact:true}).click();
 await ppage.locator('.live-record .ui-chip',{hasText:'read'}).first().waitFor();
 await ppage.getByRole('button',{name:'Notifications',exact:true}).waitFor();
 assert(await ppage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal scroll');
 await ppage.close();
 // admin: email delivery log shows the honest skipped row
 const apage=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});apage.on('pageerror',e=>errors.push(e.message));
 await apage.goto('http://127.0.0.1:5173/partner');
 await apage.getByLabel('Email',{exact:true}).fill('coach-admin@example.test');await apage.getByLabel('Password',{exact:true}).fill('Browser-test-only-password');await apage.getByRole('button',{name:'Sign in ↗',exact:true}).click();
 await apage.getByRole('button',{name:'Notifications',exact:true}).click();
 await apage.getByRole('heading',{name:'Email delivery log'}).waitFor();
 await apage.locator('.live-record .ui-chip.amber',{hasText:'skipped no config'}).waitFor();
 await apage.getByText('Email is not configured on this deployment.').waitFor();
 await apage.screenshot({path:`artifacts/notifications/admin-email-log-${width}.png`,fullPage:true});
 await apage.close();
 assert.deepEqual(errors,[]);
 console.log('PASS notifications visual',width)}finally{server.kill();await new Promise(r=>setTimeout(r,500))}}
}finally{await browser?.close();vite.kill()}
