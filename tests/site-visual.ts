import {chromium} from 'playwright';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';import {mkdir} from 'node:fs/promises';
const server=spawn('node',['--import','tsx','tests/live-fixture-server.ts'],{stdio:['ignore','pipe','inherit'],env:{...process.env,FIXTURE_WEBSITE:'1'}});const vite=spawn('node',['node_modules/vite/bin/vite.js','--host','127.0.0.1'],{stdio:'ignore'});let browser;
try{await new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Fixture timeout')),20000);server.stdout.on('data',d=>{if(String(d).includes('READY')){clearTimeout(timer);resolve()}})});await mkdir('artifacts/sites',{recursive:true});browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const width of [1440,390]){const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 // Public academy site renders the seeded real data
 await page.goto('http://127.0.0.1:5173/sites/demo-racquets');
 await page.getByRole('heading',{name:'Demo City Racquets',exact:true}).waitFor();
 assert(await page.getByText('Table tennis and badminton coaching in Bengaluru').isVisible());
 assert(await page.getByRole('heading',{name:'City Open 2026'}).isVisible(),'published tournament listed');
 assert(await page.getByText('Table Tennis',{exact:true}).first().isVisible());
 assert(await page.getByText('hello@racquets.test').isVisible());
 assert(await page.getByText('Demo Admin').isVisible(),'team name from real data');
 // no-pill rule holds on the site CTA too
 const radius=await page.getByRole('link',{name:'Get in touch ↗'}).evaluate(el=>parseFloat(getComputedStyle(el).borderRadius));
 assert(radius<16,`CTA radius ${radius} must stay rectangular`);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal scroll');
 await page.screenshot({path:`artifacts/sites/site-public-${width}.png`,fullPage:true});
 // unknown slug: honest failure, no fake page
 await page.goto('http://127.0.0.1:5173/sites/no-such-academy');
 await page.getByRole('heading',{name:'Site not available'}).waitFor();
 // partner website tab: template picker, address, sections, publish
 await page.goto('http://127.0.0.1:5173/partner');
 await page.getByLabel('Email',{exact:true}).fill('admin@racquets.test');await page.getByLabel('Password',{exact:true}).fill('Browser-test-only-password');await page.getByRole('button',{name:'Sign in ↗',exact:true}).click();
 await page.getByRole('button',{name:'Website',exact:true}).click();
 await page.getByRole('heading',{name:'Choose a template'}).waitFor();
 assert(await page.getByRole('button',{name:/Pulse/}).isVisible());
 assert(await page.getByRole('button',{name:/Gold leaf/}).isVisible());
 assert(await page.getByRole('button',{name:'Unpublish',exact:true}).isVisible(),'seeded site is published');
 assert(await page.getByRole('link',{name:'View live site ↗'}).isVisible());
 await page.screenshot({path:`artifacts/sites/partner-website-tab-${width}.png`,fullPage:true});
 assert.deepEqual(errors,[]);
 await page.close();console.log('PASS site visual',width)}
}finally{await browser?.close();vite.kill();server.kill()}
