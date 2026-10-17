import {chromium} from 'playwright';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';import {mkdir} from 'node:fs/promises';
const server=spawn('node',['--import','tsx','tests/live-fixture-server.ts'],{stdio:['ignore','pipe','inherit'],env:{...process.env,FIXTURE_DRAWS:'1'}});const vite=spawn('node',['node_modules/vite/bin/vite.js','--host','127.0.0.1'],{stdio:'ignore'});let browser;
try{await new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Fixture timeout')),20000);server.stdout.on('data',d=>{if(String(d).includes('READY')){clearTimeout(timer);resolve()}})});await mkdir('artifacts/draws',{recursive:true});browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const width of [1440,390]){const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 // organizer: generate a round robin draw, score a match, check standings
 await page.goto('http://127.0.0.1:5173/partner');
 await page.getByLabel('Email',{exact:true}).fill('draws-admin@example.test');await page.getByLabel('Password',{exact:true}).fill('Browser-test-only-password');await page.getByRole('button',{name:'Sign in ↗',exact:true}).click();
 await page.getByRole('button',{name:'Tournaments',exact:true}).waitFor();
 await page.locator('.live-record').filter({hasText:'Winter Round Robin'}).getByRole('button',{name:'Draw & scoring ↗'}).click();
 await page.getByRole('heading',{name:'No draw yet'}).waitFor();
 await page.getByRole('button',{name:'Generate draw ↗'}).click();
 await page.getByRole('heading',{name:'Round 1',exact:true}).waitFor();
 assert.equal(await page.locator('.draw-match').count(),6,'4 players round robin = 6 matches');
 assert.equal(await page.getByRole('heading',{name:/Round \d/}).count(),3);
 const first=page.locator('.draw-match').first();
 await first.getByRole('spinbutton').first().fill('3');await first.getByRole('spinbutton').nth(1).fill('1');
 await first.getByRole('button',{name:'Save',exact:true}).click();
 await page.getByText('Result saved.').waitFor();
 await page.getByRole('heading',{name:'Standings'}).waitFor();
 assert(await page.locator('.draw-standings td').first().isVisible());
 await page.screenshot({path:`artifacts/draws/round-robin-${width}.png`,fullPage:true});
 // knockout: byes pre-advanced, honest final naming
 await page.getByRole('button',{name:'← Back to tournaments'}).click();
 await page.locator('.live-record').filter({hasText:'Winter Knockout'}).getByRole('button',{name:'Draw & scoring ↗'}).click();
 await page.getByRole('button',{name:'Generate draw ↗'}).click();
 await page.getByRole('heading',{name:'Final',exact:true}).waitFor();
 await page.screenshot({path:`artifacts/draws/knockout-${width}.png`,fullPage:true});
 // player view: read-only, no generate, no score inputs
 const ppage=await(await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'})).newPage();
 await ppage.goto('http://127.0.0.1:5173/app');
 await ppage.getByLabel('Email',{exact:true}).fill('draws-p1@example.test');await ppage.getByLabel('Password',{exact:true}).fill('Browser-test-only-password');await ppage.getByRole('button',{name:'Sign in ↗',exact:true}).click();
 await ppage.locator('.live-record').filter({hasText:'Winter Round Robin'}).getByRole('button',{name:'Draw & results ↗'}).click();
 await ppage.getByRole('heading',{name:'Standings'}).waitFor();
 assert.equal(await ppage.getByRole('button',{name:/Generate draw/}).count(),0);
 assert.equal(await ppage.locator('.draw-score').count(),0,'no score inputs for players');
 assert.equal(await ppage.locator('.draw-match.done').count(),1,'the scored match visible');
 await ppage.screenshot({path:`artifacts/draws/player-view-${width}.png`,fullPage:true});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal scroll');
 assert.deepEqual(errors,[]);
 await page.close();console.log('PASS draw visual',width)}
}finally{await browser?.close();vite.kill();server.kill()}
