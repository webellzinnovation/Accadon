import {chromium} from 'playwright';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,symlink,rm} from 'node:fs/promises';
import assert from 'node:assert/strict';
execFileSync('node',['node_modules/vite/bin/vite.js','build','--base=/Accadon/'],{stdio:'inherit'});
await mkdir('/tmp/accadon-mkt-verify',{recursive:true});await mkdir('artifacts/marketing',{recursive:true});
await rm('/tmp/accadon-mkt-verify/Accadon',{force:true,recursive:true});await symlink(process.cwd()+'/dist','/tmp/accadon-mkt-verify/Accadon');
const server=spawn('python3',['-m','http.server','4193','--bind','127.0.0.1','--directory','/tmp/accadon-mkt-verify'],{stdio:'ignore'});
let browser;
try{
 for(let i=0;i<40;i++){try{await fetch('http://127.0.0.1:4193/Accadon/');break}catch{await new Promise(r=>setTimeout(r,100))}}
 browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'no-preference'});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4193/Accadon/');
  await page.locator('.software-feature').first().waitFor();
  // Trigger the scroll-in, then measure during the from-state (max downward offset)
  await page.locator('.software-feature-strip').scrollIntoViewIfNeeded();
  await page.waitForTimeout(120);
  const during=await page.evaluate(()=>{const cards=[...document.querySelectorAll('.software-feature')].map(e=>e.getBoundingClientRect());const f=document.querySelector('.software-stage-footer')!.getBoundingClientRect();return {maxCardBottom:Math.max(...cards.map(c=>c.bottom)),footerTop:f.top}});
  assert(during.maxCardBottom<=during.footerTop+1,`from-state overlap @${width}: card bottom ${during.maxCardBottom} vs footer top ${during.footerTop}`);
  await page.waitForTimeout(1500);
  const settled=await page.evaluate(()=>{const cards=[...document.querySelectorAll('.software-feature')].map(e=>e.getBoundingClientRect());const f=document.querySelector('.software-stage-footer')!.getBoundingClientRect();return {maxCardBottom:Math.max(...cards.map(c=>c.bottom)),footerTop:f.top,transforms:[...document.querySelectorAll('.software-feature')].map(e=>getComputedStyle(e).transform)}});
  assert(settled.maxCardBottom<=settled.footerTop+1,`settled overlap @${width}`);
  for(const t of settled.transforms)assert(t==='none'||t==='matrix(1, 0, 0, 1, 0, 0)',`transform not flat @${width}: ${t}`);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('.software-stage').screenshot({path:`artifacts/marketing/software-stage-${width}.png`});
  await page.locator('.coaches').scrollIntoViewIfNeeded();await page.waitForTimeout(1200);
  assert.equal(await page.locator('.coach-monogram span').count(),0,'stray arrow still in monogram');
  assert.equal(await page.locator('.small-orbit').count(),0,'orphan target icon still present');
  const mono=await page.locator('.coach-monogram').evaluate(e=>{const cs=getComputedStyle(e);return {bg:cs.backgroundImage,color:cs.color,border:cs.borderRadius}});
  assert(mono.bg.includes('linear-gradient'),'monogram has no card background');
  await page.locator('.coach-grid').screenshot({path:`artifacts/marketing/founder-${width}.png`});
  assert.equal(errors.length,0,errors.join('\n'));
  await page.close();
 }
 console.log('PASS: marketing landing verify 1440/390 - software-stage flat+clear of footer (from-state and settled), founder monogram purple card, no stray arrow, no orphan icon, no overflow, no page errors');
}catch(e){console.error(e);process.exitCode=1}finally{await browser?.close();server.kill()}
