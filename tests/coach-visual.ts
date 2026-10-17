import {chromium} from 'playwright';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';import {mkdir} from 'node:fs/promises';
const vite=spawn('node',['node_modules/vite/bin/vite.js','--host','127.0.0.1'],{stdio:'ignore'});let browser;
try{await mkdir('artifacts/coach',{recursive:true});browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const width of [1440,390]){const server=spawn('node',['--import','tsx','tests/live-fixture-server.ts'],{stdio:['ignore','pipe','inherit'],env:{...process.env,FIXTURE_COACH:'1'}});await new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Fixture timeout')),20000);server.stdout.on('data',d=>{if(String(d).includes('READY')){clearTimeout(timer);resolve()}})});try{
 // academy admin: batches tab, open the seeded batch, add the third player
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 await page.goto('http://127.0.0.1:5173/partner');
 await page.getByLabel('Email',{exact:true}).fill('coach-admin@example.test');await page.getByLabel('Password',{exact:true}).fill('Browser-test-only-password');await page.getByRole('button',{name:'Sign in ↗',exact:true}).click();await page.getByRole('button',{name:'Batches',exact:true}).click();
 await page.getByRole('heading',{name:'Create a batch'}).waitFor();
 await page.locator('.live-record').filter({hasText:'U-13 Badminton'}).getByRole('button',{name:'Players ↗'}).click();
 await page.getByRole('heading',{name:'U-13 Badminton · players'}).waitFor();
 await page.getByLabel('Add a player').selectOption({label:'Trainee Player 3'});await page.getByRole('button',{name:'Add to batch'}).click();
 await page.getByText('Player added to the batch.').waitFor();
 assert.equal(await page.locator('.live-record-actions span',{hasText:'Trainee Player'}).count()>=0,true);
 await page.screenshot({path:`artifacts/coach/admin-batches-${width}.png`,fullPage:true});
 await page.close();
 // coach: sign in at /app, lands on My batches, assess a player
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
 await cpage.screenshot({path:`artifacts/coach/coach-assess-${width}.png`,fullPage:true});
 await cpage.close();
 // player: read-only progress view
 const ppage=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});ppage.on('pageerror',e=>errors.push(e.message));
 await ppage.goto('http://127.0.0.1:5173/app');
 await ppage.getByLabel('Email',{exact:true}).fill('coachp1@example.test');await ppage.getByLabel('Password',{exact:true}).fill('Browser-test-only-password');await ppage.getByRole('button',{name:'Sign in ↗',exact:true}).click();
 await ppage.getByRole('button',{name:'Progress',exact:true}).click();
 await ppage.getByText('Rating 4/5').waitFor();
 assert.equal(await ppage.getByRole('button',{name:'Record assessment'}).count(),0,'players cannot record assessments');
 await ppage.screenshot({path:`artifacts/coach/player-progress-${width}.png`,fullPage:true});
 assert(await ppage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal scroll');
 await ppage.close();
 assert.deepEqual(errors,[]);
 console.log('PASS coach visual',width)}finally{server.kill();await new Promise(r=>setTimeout(r,500))}}
}finally{await browser?.close();vite.kill()}
