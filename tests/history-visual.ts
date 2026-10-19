import {chromium} from 'playwright';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';
const server=spawn('node',['--import','tsx','tests/live-fixture-server.ts'],{env:{...process.env,FIXTURE_HISTORY:'1'},stdio:['ignore','pipe','inherit']});const vite=spawn('node',['node_modules/vite/bin/vite.js','--host','127.0.0.1'],{stdio:'ignore'});let browser;
try{await new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Fixture timeout')),20000);server.stdout.on('data',d=>{if(String(d).includes('READY')){clearTimeout(timer);resolve()}})});browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 for(const[label,width]of[['1440',1440],['390',390]]as const){const p=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors:string[]=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:5173/live-preview');
  await p.getByLabel('Email',{exact:true}).fill('history-parent@example.test');await p.getByLabel('Password',{exact:true}).fill('Browser-test-only-password');await p.getByRole('button',{name:'Sign in ↗'}).click();
  await p.getByRole('heading',{name:/Welcome, /}).waitFor();
  const nav=async(name:string)=>p.getByRole('navigation',{name:'Parent workspace'}).getByRole('button',{name,exact:false}).click();
  await nav('My kids');
  await p.getByRole('group',{name:'Choose child'}).getByRole('button',{name:/Aarav/}).click();
  await p.getByRole('group',{name:'Child sport'}).getByRole('button',{name:'Badminton'}).click();
  await p.locator('dd',{hasText:'2nd of 4 · 2W-1L · 4 pts'}).waitFor();
  await p.locator('dd',{hasText:'Draw not published yet'}).waitFor();
  await p.getByText('Rival 3').first().waitFor();
  await p.getByText('U-13 Badminton').first().waitFor();
  await p.getByText('Rating 4/5').first().waitFor();
  await p.getByText('Fast footwork and steady clears').waitFor();
  await p.screenshot({path:`artifacts/history/parent-history-${label}.png`,fullPage:true});
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+' page overflow');
  assert.equal(errors.length,0);await p.close();
 }
 console.log('PASS: per-child sport history - round robin standing (2nd of 4), match list with opponents and scores, honest no-draw state, batch and assessment history at 1440/390. Synthetic fixture data only.');
}finally{await browser?.close();server.kill();vite.kill()}
