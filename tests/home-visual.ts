import {chromium} from 'playwright';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,symlink,rm} from 'node:fs/promises';
import assert from 'node:assert/strict';
execFileSync('node',['node_modules/vite/bin/vite.js','build','--base=/Accadon/'],{stdio:'inherit'});
await mkdir('/tmp/accadon-home-test',{recursive:true});await mkdir('artifacts/home',{recursive:true});
await rm('/tmp/accadon-home-test/Accadon',{force:true,recursive:true});await symlink(process.cwd()+'/dist','/tmp/accadon-home-test/Accadon');
const server=spawn('python3',['-m','http.server','4193','--bind','127.0.0.1','--directory','/tmp/accadon-home-test'],{stdio:'ignore'});
let browser;
try{
 for(let i=0;i<40;i++){try{await fetch('http://127.0.0.1:4193/Accadon/');break}catch{await new Promise(r=>setTimeout(r,100))}}
 browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 for(const width of [1440,390,320]){
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors:string[]=[];const api:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/api/')||r.method()!=='GET')api.push(r.url())});
 await page.goto('http://127.0.0.1:4193/Accadon/');await page.locator('.home-event-card').last().waitFor();
 assert.equal(await page.locator('.home-event-card').count(),5);assert.equal(await page.locator('.academy-network-grid a').count(),6);
 assert(await page.locator('.home-concept-note').innerText().then(t=>t.includes('Fictional')));
 assert.equal(await page.locator('.ribbon-track').evaluate(e=>getComputedStyle(e).animationName),'none');
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:`artifacts/home/home-${width}.png`,fullPage:false});
 await page.locator('.event-hub').screenshot({path:`artifacts/home/events-${width}.png`});
 await page.locator('.academy-network').screenshot({path:`artifacts/home/academies-${width}.png`});
 for(const event of ['City Circuit Open','Shuttle Weekend','Academy Youth League','Weekend T20 Cup','Courtside Doubles','Junior Rising Stars']){await page.getByRole('button',{name:`Feature ${event}`}).click();assert.equal(await page.locator('.score-event h2').innerText(),event)}
 await page.getByRole('button',{name:'Feature Weekend T20 Cup'}).click();assert.equal(await page.locator('.score-event h2').innerText(),'Weekend T20 Cup');
 await page.getByRole('group',{name:'Filter tournament examples'}).getByRole('button',{name:'Badminton',exact:true}).click();assert.equal(await page.locator('.home-event-card').count(),1);
 await page.getByRole('button',{name:'Tournament preview',exact:false}).click();assert(await page.locator('.event-preview').isVisible());
 await page.getByRole('button',{name:'Show in match centre'}).click();assert.equal(await page.locator('.score-event h2').innerText(),'Shuttle Weekend');
 await page.locator('.arena-hero').screenshot({path:`artifacts/home/selected-${width}.png`});
 await page.getByRole('button',{name:'Pause tournament ribbon'}).click();assert(await page.locator('.ribbon-track').evaluate(e=>e.classList.contains('is-paused')));
 await page.getByRole('button',{name:'Resume tournament ribbon'}).click();
 const anchors=await page.locator('a[href]').evaluateAll(es=>es.map(e=>e.getAttribute('href')!));for(const href of anchors)assert(!href.startsWith('/')||href.startsWith('/Accadon/'),href);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(errors.length,0,errors.join('\n'));assert.equal(api.length,0);
 await page.getByRole('link',{name:'See the workflows'}).click();await page.getByLabel('View as').waitFor();await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});await page.goto('http://127.0.0.1:4193/Accadon/');
 assert.equal(await page.locator('.ribbon-track').evaluate(e=>getComputedStyle(e).animationName),'score-ribbon');
 const before=await page.locator('.ribbon-track').evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(120);const after=await page.locator('.ribbon-track').evaluate(e=>getComputedStyle(e).transform);assert.notEqual(before,after);
 await page.getByRole('button',{name:'Pause tournament ribbon'}).click();assert.equal(await page.locator('.ribbon-track').evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
 console.log('PASS: active-home concept 1440/390/320, sport filters, all score selectors, preview, academy links, demo disclosure, motion/pause/reduced motion, no overflow, no API, base routes.');
}finally{await browser?.close();server.kill();execFileSync('node',['node_modules/vite/bin/vite.js','build'],{stdio:'inherit'})}
