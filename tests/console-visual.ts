import {chromium} from 'playwright';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';import {mkdir} from 'node:fs/promises';
const server=spawn('node',['--import','tsx','tests/live-fixture-server.ts'],{stdio:['ignore','pipe','inherit']});const vite=spawn('node',['node_modules/vite/bin/vite.js','--host','127.0.0.1'],{stdio:'ignore'});let browser;
try{await new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Fixture timeout')),20000);server.stdout.on('data',d=>{if(String(d).includes('READY')){clearTimeout(timer);resolve()}})});await mkdir('artifacts/console',{recursive:true});browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const width of [1440,390]){const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 await page.goto('http://127.0.0.1:5173/superadmin');
 await page.getByLabel('Email',{exact:true}).fill('synthetic-admin@example.test');await page.getByLabel('Password',{exact:true}).fill('Browser-test-only-password');await page.getByRole('button',{name:'Sign in ↗',exact:true}).click();
 const nav=page.getByRole('navigation',{name:'Superadmin console'});await nav.waitFor();
 // console nav contains ONLY superadmin pages
 assert.deepEqual(await nav.getByRole('button').allTextContents(),['Overview','Academies','Plans & subscriptions','Tournaments','Users & roles','My account'].map((s,i,a)=>s));
 await page.screenshot({path:`artifacts/console/overview-${width}.png`,fullPage:true});
 // no academy-workspace artifacts: no entry review, no tournament create form
 await nav.getByRole('button',{name:'Tournaments'}).click();
 assert(await page.getByRole('heading',{name:'Tournaments (read-only)'}).isVisible());
 assert.equal(await page.getByRole('button',{name:/create tournament/i}).count(),0);
 assert.equal(await page.getByRole('button',{name:/^(Accept|Reject)/}).count(),0);
 await page.screenshot({path:`artifacts/console/tournaments-${width}.png`,fullPage:true});
 // academies: create one, open detail, subscription card + assign form visible
 await nav.getByRole('button',{name:'Academies'}).click();
 await page.getByLabel('Academy name').fill('Console Test Academy');await page.getByLabel('City').fill('Testville');await page.getByRole('button',{name:'Create academy'}).click();
 await page.getByRole('button',{name:'Open academy ↗'}).first().click();
 await page.getByRole('heading',{name:'Console Test Academy'}).waitFor();
 assert(await page.getByRole('button',{name:'View as academy admin ↗'}).isVisible());
 assert(await page.getByRole('heading',{name:'Subscription',exact:true}).isVisible());
 await page.screenshot({path:`artifacts/console/academy-detail-${width}.png`,fullPage:true});
 // plans: seeded free/pro/premium visible
 await nav.getByRole('button',{name:'Plans & subscriptions'}).click();
 for(const name of ['Free · ₹0/mo','Pro · ₹999/mo','Premium · ₹2499/mo'])assert(await page.getByRole('heading',{name,exact:true}).isVisible());
 await page.screenshot({path:`artifacts/console/plans-${width}.png`,fullPage:true});
 // users & roles: seeded superadmin listed, filters present
 await nav.getByRole('button',{name:'Users & roles'}).click();
 assert(await page.locator('.live-main').getByText('synthetic-admin@example.test').first().isVisible());
 await page.screenshot({path:`artifacts/console/users-${width}.png`,fullPage:true});
 assert.deepEqual(errors,[]);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.close();console.log('PASS console visual',width)}
}finally{await browser?.close();vite.kill();server.kill()}
