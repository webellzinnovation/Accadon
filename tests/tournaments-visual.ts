import {chromium} from 'playwright';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,symlink,rm} from 'node:fs/promises';
import assert from 'node:assert/strict';
execFileSync('node',['node_modules/vite/bin/vite.js','build','--base=/Accadon/'],{stdio:'inherit'});
await mkdir('/tmp/accadon-tour-test',{recursive:true});await mkdir('artifacts/tournaments',{recursive:true});await rm('/tmp/accadon-tour-test/Accadon',{force:true,recursive:true});await symlink(process.cwd()+'/dist','/tmp/accadon-tour-test/Accadon');
const server=spawn('python3',['-m','http.server','4194','--bind','127.0.0.1','--directory','/tmp/accadon-tour-test'],{stdio:'ignore'});let browser;
try{
 for(let i=0;i<40;i++){try{await fetch('http://127.0.0.1:4194/Accadon/');break}catch{await new Promise(r=>setTimeout(r,100))}}
 browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 for(const width of [1440,390,320]){
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors:string[]=[];const api:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/api/')||r.method()!=='GET')api.push(r.url())});
 await page.goto('http://127.0.0.1:4194/Accadon/');await page.getByRole('link',{name:'Explore tournaments',exact:false}).first().click();await page.locator('.tour-directory').waitFor();
 assert.equal(await page.locator('.tour-list-card').count(),5);assert(page.url().endsWith('#/tournaments'));assert(await page.locator('.home-concept-note').innerText().then(s=>s.includes('Fictional')));
 await page.screenshot({path:`artifacts/tournaments/current-${width}.png`});
 await page.getByLabel('Search event, academy or city').fill('Chennai');assert.equal(await page.locator('.tour-list-card').count(),1);await page.getByRole('button',{name:'Open match desk'}).click();assert.equal(await page.locator('#tour-detail-title').innerText(),'Shuttle Weekend');
 await page.getByRole('button',{name:'Expand score detail'}).click();assert.equal(await page.locator('.tour-game-row').count(),3);
 await page.getByLabel('Search event, academy or city').fill('zz-no-match');assert(await page.locator('.tour-empty').isVisible());await page.getByRole('button',{name:'Clear filters'}).click();assert.equal(await page.locator('.tour-list-card').count(),5);
 await page.getByRole('group',{name:'Tournament sport',exact:true}).getByRole('button',{name:'Cricket',exact:true}).click();assert.equal(await page.locator('.tour-list-card').count(),1);
 await page.getByRole('group',{name:'Tournament timing'}).getByRole('button',{name:'Upcoming'}).click();assert(await page.locator('.tour-empty').isVisible());await page.getByRole('button',{name:'Clear filters'}).click();assert.equal(await page.locator('.tour-list-card').count(),3);
 await page.getByRole('button',{name:'Preview event',exact:false}).first().click();assert(await page.locator('.tour-upcoming-preview').isVisible());assert(await page.locator('.tour-upcoming-preview').innerText().then(s=>s.includes('No real registration')));
 await page.screenshot({path:`artifacts/tournaments/upcoming-${width}.png`});
 for(let i=0;i<5;i++){
 await page.getByLabel('Select tournament and category').selectOption(String(i));
 for(const tab of ['Overview','Matches','Draws','Players','Results']){await page.getByRole('tab',{name:tab,exact:true}).click();assert(await page.getByRole('tabpanel').isVisible());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}/${i}/${tab}`)}
 await page.getByRole('tab',{name:'Matches',exact:true}).click();assert.equal(await page.locator('.competition-match-grid .competition-match').count(),[9,7,6,7,9][i]);await page.locator('.tour-detail').screenshot({path:`artifacts/tournaments/all-matches-${i}-${width}.png`});
 await page.getByLabel('Match state',{exact:true}).selectOption('Scheduled');assert(await page.locator('.competition-match-grid .competition-match').count()>0);await page.getByLabel('Match state',{exact:true}).selectOption('All states');
 await page.getByRole('tab',{name:'Draws',exact:true}).click();assert.equal(await page.locator('.competition-group').count(),[2,0,1,1,2][i]);
 if(i!==2){await page.getByRole('group',{name:'Knockout round'}).getByRole('button',{name:'Final',exact:true}).click();assert(await page.locator('.competition-round.active-round').innerText().then(t=>t.includes('Winner SF1')||t.includes('League rank 1')))}
 await page.locator('.tour-detail').screenshot({path:`artifacts/tournaments/draws-${i}-${width}.png`});
 await page.getByRole('tab',{name:'Overview',exact:true}).click();await page.getByRole('button',{name:'Expand score detail'}).click();assert(await page.locator('.tour-score-breakdown').isVisible());await page.locator('.tour-detail').screenshot({path:`artifacts/tournaments/detail-${i}-${width}.png`});
 }
 await page.getByRole('tab',{name:'Overview',exact:true}).click();await page.getByRole('tab',{name:'Overview',exact:true}).press('ArrowRight');assert.equal(await page.getByRole('tab',{name:'Matches',exact:true}).getAttribute('aria-selected'),'true');
 assert.equal(await page.locator('.tour-detail-panel').evaluate(e=>getComputedStyle(e).animationName),'none');assert.equal(api.length,0);assert.equal(errors.length,0,errors.join('\n'));
 for(const href of await page.locator('a[href]').evaluateAll(es=>es.map(e=>e.getAttribute('href')!)))assert(!href.startsWith('/')||href.startsWith('/Accadon/'),href);
 await page.reload();await page.locator('.tour-list-card').first().waitFor();assert.equal(await page.locator('.tour-list-card').count(),5);await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});await page.goto('http://127.0.0.1:4194/Accadon/#/tournaments');await page.locator('.tour-page-heading').waitFor();await page.waitForTimeout(1000);assert.equal(await page.locator('.tour-page-heading').evaluate(e=>getComputedStyle(e).opacity),'1');assert.equal(await page.locator('.tour-detail-panel').evaluate(e=>getComputedStyle(e).animationName),'matchday-enter');
 console.log('PASS: tournament current/upcoming/search/empty/sport/detail tabs, 5 sport score expansions at 1440/390/320, keyboard tabs, reduced motion, animation, no errors/overflow/API, direct & home routes on static /Accadon/.');
}finally{await browser?.close();server.kill();execFileSync('node',['node_modules/vite/bin/vite.js','build'],{stdio:'inherit'})}
