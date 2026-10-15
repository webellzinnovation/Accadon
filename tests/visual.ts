import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const vite = spawn('node', ['node_modules/vite/bin/vite.js','--host','127.0.0.1'], {stdio:'ignore'});
const api = spawn('node', ['dist-server/index.js'], {stdio:'ignore',env:{...process.env,DATABASE_URL:''}});
await mkdir('artifacts',{recursive:true});
let browser;
try {
  for(let i=0;i<50;i++){try{await fetch('http://127.0.0.1:5173');break;}catch{await new Promise(r=>setTimeout(r,200));}}
  browser = await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
  const errors:string[]=[];
  for(const [label,width,height] of [['desktop',1440,1000],['mobile',390,844],['small',320,740]] as const){
    const page = await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:5173');await page.waitForTimeout(200);
    assert(await page.locator('h1').innerText().then(s=>s.includes('Your academy')));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${label} has overflow`);
    if(label!=='small') await page.screenshot({path:`artifacts/${label}.png`,fullPage:true});
    if(label==='mobile') {
      await page.getByRole('button',{name:'Menu'}).click();
      await page.getByRole('navigation').getByRole('link',{name:'Coaching tools',exact:true}).click();
      assert.equal(await page.getByRole('button',{name:'Menu'}).getAttribute('aria-expanded'),'false');
    }
    await page.goto('http://127.0.0.1:5173/inquiry?interest=coaching');
    assert.equal(await page.locator('select[name=interest]').inputValue(),'coaching');
    await page.locator('input[name=name]').fill('Visual Test');
    await page.locator('input[name=phone]').fill('9876543210');
    await page.locator('input[name=city]').fill('Test city');
    await page.locator('input[name=academyName]').fill('Test academy');
    await page.locator('input[name=sport]').fill('Badminton');
    await page.locator('input[name=role]').fill('Owner');
    await page.locator('input[name=consent]').check();
    await page.getByRole('button',{name:'Send inquiry'}).click();
    await page.getByRole('alert').waitFor();
    assert((await page.getByRole('alert').innerText()).includes('not connected'),await page.getByRole('alert').innerText());
    assert.equal(await page.locator('input[name=name]').inputValue(),'Visual Test');
    await page.close();
  }
  const animated=await browser.newPage({viewport:{width:1440,height:1000}});
  animated.on('pageerror',e=>errors.push(e.message));
  await animated.goto('http://127.0.0.1:5173');await animated.waitForTimeout(1700);
  await animated.screenshot({path:'artifacts/desktop-motion.png'});
  for(let y=0;y<6000;y+=600){await animated.evaluate(v=>scrollTo(0,v),y);await animated.waitForTimeout(90);}
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS: 1440px / 390px / 320px, no overflow, reduced motion, mobile nav, program prefilling, failed-save input retention, animation scroll with no page errors.');
} finally {await browser?.close();vite.kill();api.kill();}
