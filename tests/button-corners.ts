import {readFileSync,readdirSync} from 'node:fs';
// Style gate: NO pill/round buttons anywhere. Any rule whose subject is a button
// (button element, .button class, login-link, menu-toggle, or *-button class) must
// use a modest rounded-rectangle corner (< 16px, never a percent circle).
// Decorative internals (pseudo-elements, descendant spans/dots) and non-button
// chips/cards are out of scope.
let failures=0;
for(const file of readdirSync('src').filter(f=>f.endsWith('.css'))){
 const css=readFileSync('src/'+file,'utf8');
 for(const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)){
  const [,selectors,body]=m;
  const radius=body.match(/border-radius:([^;}]*)/);
  if(!radius)continue;
  for(const sel of selectors.split(',')){
   const parts=sel.trim().split(/[\s>+~]+/);
   const subject=parts[parts.length-1];
   if(subject.includes('::'))continue;
   const bare=subject.replace(/:[\w-]+(\([^)]*\))?/g,'');
   if(!/(^|[.#])[\w-]*button[\w-]*$/i.test(bare)&&!/^button$/i.test(bare)&&!/login-link|menu-toggle/.test(bare))continue;
   for(const v of radius[1].trim().split(/\s+/)){
    const px=v.match(/^([\d.]+)px$/);
    const pct=v.match(/^([\d.]+)%$/);
    if((px&&parseFloat(px[1])>=16)||(pct&&parseFloat(pct[1])>=50)){
     console.error(`FAIL ${file}: pill/round corner on button subject "${sel.trim()}" -> border-radius:${radius[1]}`);
     failures++;
    }
   }
  }
 }
}
if(failures){console.error(failures+' pill/round button corner(s) found');process.exit(1)}
console.log('PASS button-corners: no pill/round buttons in src css');
