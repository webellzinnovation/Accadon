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
    assert(await page.locator('h1').innerText().then(s=>s.toLowerCase().includes('all in play')));
    assert.equal(await page.locator('.home-event-card').count(),5);
    assert(await page.locator('.score-stage').isVisible());
    // All page/app surfaces remain light, including responsive navigation and form.
    for(const selector of ['body','.product-preview','.form-panel','footer']) {
      const bg = await page.locator(selector).first().evaluate(el=>getComputedStyle(el).backgroundColor);
      if(bg !== 'rgba(0, 0, 0, 0)') assert(bg.match(/\d+/g)!.slice(0,3).map(Number).every(v=>v>175),`${selector} is not light: ${bg}`);
    }
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${label} has overflow`);
    for (const tab of ['Create & register','Draws & scoring','Batches & attendance','Parent & player view','Fees & subscriptions','Reports & oversight']) {
      await page.getByRole('button',{name:new RegExp('Open the window'),exact:false}).filter({hasText:tab}).click();
      assert(await page.getByRole('dialog').isVisible());
      assert.equal(await page.locator('.showcase-window').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(35, 17, 57)','showcase window is not dark');
      assert.equal(await page.locator('.dense-metrics>div').count(),4);
      assert.equal(await page.locator('.dense-review-rail>article').count(),tab==='Parent & player view'?0:3);
      if(tab==='Parent & player view'){assert.equal(await page.locator('.dense-nav').getByText('Review centre').count(),0);assert.equal(await page.locator('.dense-review-rail').count(),0);}
      for(const metric of await page.locator('.dense-metrics>div').all()) {
        assert.equal(await metric.evaluate(el=>getComputedStyle(el).display),'block');
        assert(await metric.evaluate(el=>el.scrollWidth<=el.clientWidth+1));
      }
      for(const cell of await page.locator('.concept-record>div').all()) assert(await cell.evaluate(el=>el.scrollWidth<=el.clientWidth+1));
      if(tab==='Draws & scoring') {
        assert(await page.locator('.football-detail').isVisible());
        assert(await page.locator('.lineup-pitch').isVisible());
        assert.equal(await page.locator('.stat-comparison').count(),4);
        for(const sport of ['Badminton','Table tennis','Cricket']) {
          await page.getByRole('group',{name:'Match sport',exact:true}).getByRole('button',{name:new RegExp(sport)}).click();
          assert(await page.locator('.sport-match-detail').isVisible());
          for(const el of await page.locator('.sport-match-detail *').all()) assert(await el.evaluate(e=>e.scrollWidth<=e.clientWidth+1),`${sport} internal overflow`);
          assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        }
        await page.getByRole('group',{name:'Match sport',exact:true}).getByRole('button',{name:/Football/}).click();
      }
      if(tab==='Create & register') assert(await page.locator('.create-wizard').isVisible());
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.showcase-overlay').count(),0);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    }
    await page.getByRole('button',{name:/Open the window/}).filter({hasText:'Create & register'}).click();
    assert(await page.getByRole('dialog').isVisible());
    if(label!=='small') await page.screenshot({path:`artifacts/${label}.png`,fullPage:true});
    await page.keyboard.press('Escape');assert.equal(await page.locator('.showcase-overlay').count(),0);
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
    assert(/not connected|could not reach accadon/i.test(await page.getByRole('alert').innerText()),await page.getByRole('alert').innerText());
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
