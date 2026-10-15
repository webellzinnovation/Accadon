import {createElement} from 'react';
import {renderToStaticMarkup as render} from 'react-dom/server';
import {KitCrosstable} from '../src/KitCrosstable';
import {KitCompetition} from '../src/KitCompetition';
import assert from 'node:assert/strict';
for(const n of [0,1,2,3,4]){
 for(const Component of [KitCrosstable,KitCompetition]){
  const html=render(createElement(Component,{qualifierCount:n}));
  assert.equal((html.match(/kit-cross-place is-qualified/g)||[]).length,Component===KitCompetition?n*2:n);
 }
}
console.log('PASS shared qualifier-count rendering 0 through 4');
