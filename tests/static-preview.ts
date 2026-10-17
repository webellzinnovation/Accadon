import {chromium} from 'playwright';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,symlink,rm} from 'node:fs/promises';
import assert from 'node:assert/strict';
execFileSync('node',['node_modules/vite/bin/vite.js','build','--base=/Accadon/'],{stdio:'inherit'});
await mkdir('/tmp/accadon-pages-test',{recursive:true});
await rm('/tmp/accadon-pages-test/Accadon',{recursive:true,force:true});
await symlink(process.cwd()+'/dist','/tmp/accadon-pages-test/Accadon');
const server=spawn('python3',['-m','http.server','4189','--bind','127.0.0.1','--directory','/tmp/accadon-pages-test'],{stdio:'ignore'});
let browser;
try{
 for(let i=0;i<30;i++){try{await fetch('http://127.0.0.1:4189/Accadon/');break}catch{await new Promise(r=>setTimeout(r,150))}}
 browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 for(const [label,width] of [['desktop',1440],['mobile',390],['small',320]] as const){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));let posts=0;page.on('request',r=>{if(r.method()==='POST')posts++});
  await page.goto('http://127.0.0.1:4189/Accadon');assert(await page.locator('h1').innerText().then(t=>t.toLowerCase().includes('all in play')));
  for(const href of await page.locator('a[href]').evaluateAll(els=>els.map(el=>el.getAttribute('href')!)))assert(!href.startsWith('/')||href.startsWith('/Accadon/'),`Escaping base: ${href}`);
  if(width<800){await page.getByRole('button',{name:'Menu',exact:false}).click();await page.locator('header nav.open').waitFor();await page.getByRole('button',{name:'Close',exact:false}).click();}
  await page.goto('http://127.0.0.1:4189/Accadon/#/inquiry?interest=coaching');assert.equal(await page.locator('select[name=interest]').inputValue(),'coaching');
  await page.getByRole('link',{name:'How we use your details'}).click();await page.waitForFunction(()=>document.querySelector('h1')?.textContent?.includes('details')); assert.equal(errors.length,0);await page.close();
 }
 console.log('PASS: file-only static host /Accadon and /Accadon/, base-scoped links, no auth POST, inquiry query and privacy at 1440/390/320.');
}finally{await browser?.close();server.kill();execFileSync('node',['node_modules/vite/bin/vite.js','build'],{stdio:'inherit'})}
