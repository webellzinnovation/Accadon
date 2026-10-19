import {chromium} from 'playwright';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';import {mkdir} from 'node:fs/promises';
const vite=spawn('node',['node_modules/vite/bin/vite.js','--host','127.0.0.1'],{stdio:'ignore'});let browser;
try{await mkdir('artifacts/payments',{recursive:true});browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const width of [1440,390]){const server=spawn('node',['--import','tsx','tests/live-fixture-server.ts'],{stdio:['ignore','pipe','inherit'],env:{...process.env,FIXTURE_PAYMENTS:'1'}});await new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Fixture timeout')),20000);server.stdout.on('data',d=>{if(String(d).includes('READY')){clearTimeout(timer);resolve()}})});try{
 const errors:string[]=[];
 // player: paid receipt row, created row with pay button, honest skipped row
 const ppage=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});ppage.on('pageerror',e=>errors.push(e.message));
 await ppage.goto('http://127.0.0.1:5173/app');
 await ppage.getByLabel('Email',{exact:true}).fill('pay-player@example.test');await ppage.getByLabel('Password',{exact:true}).fill('Browser-test-only-password');await ppage.getByRole('button',{name:'Sign in ↗',exact:true}).click();
 await ppage.getByRole('button',{name:'Sign out'}).waitFor();
 await ppage.getByRole('button',{name:'Payments',exact:true}).click();
 await ppage.getByText('Diwali Open').waitFor();
 await ppage.locator('.live-record .ui-chip.green',{hasText:'paid'}).waitFor();
 await ppage.locator('.live-record .ui-chip.amber',{hasText:'skipped no config'}).waitFor();
 await ppage.getByText('has not connected its payment gateway').waitFor();
 await ppage.getByRole('button',{name:'Pay test fee ↗'}).waitFor();
 await ppage.screenshot({path:`artifacts/payments/player-payments-${width}.png`,fullPage:true});
 await ppage.getByRole('button',{name:'View receipt ↗'}).click();
 await ppage.getByRole('heading',{name:'Receipt RCPT-DEMOPAID01'}).waitFor();
 await ppage.getByText('Test mode - no live money moved').waitFor();
 await ppage.screenshot({path:`artifacts/payments/player-receipt-${width}.png`,fullPage:true});
 assert(await ppage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal scroll');
 await ppage.close();
 // admin: gateway card with masked secret + academy payment list
 const apage=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});apage.on('pageerror',e=>errors.push(e.message));
 await apage.goto('http://127.0.0.1:5173/partner');
 await apage.getByLabel('Email',{exact:true}).fill('pay-admin@example.test');await apage.getByLabel('Password',{exact:true}).fill('Browser-test-only-password');await apage.getByRole('button',{name:'Sign in ↗',exact:true}).click();
 await apage.getByRole('button',{name:'Payments',exact:true}).click();
 await apage.getByRole('heading',{name:'Payment gateway (test mode)'}).waitFor();
 await apage.getByText('rzp_test_DEMO1234').waitFor();
 await apage.getByText('secret saved and never shown').waitFor();
 await apage.locator('.live-record .ui-chip.green',{hasText:'paid'}).waitFor();
 // admin of the academy does not see the other academy's skipped payment
 assert.equal(await apage.getByText('Charity Cup').count(),0,'cross-academy payment hidden');
 await apage.screenshot({path:`artifacts/payments/admin-payments-${width}.png`,fullPage:true});
 await apage.close();
 assert.deepEqual(errors,[]);
 console.log('PASS payments visual',width)}finally{server.kill();await new Promise(r=>setTimeout(r,500))}}
}finally{await browser?.close();vite.kill()}
