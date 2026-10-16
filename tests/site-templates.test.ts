import {test} from 'node:test';import assert from 'node:assert/strict';
import {siteTemplates,siteTemplateIds as uiIds} from '../src/config/websiteTemplates';
import {siteTemplateIds as serverIds} from '../server/siteTemplates';
test('website template catalog: 11 templates across 4 groups, ui and server lists in sync',()=>{
 assert.equal(siteTemplates.length,11);
 const groups:Record<string,number>={};for(const t of siteTemplates)groups[t.group]=(groups[t.group]||0)+1;
 assert.deepEqual(groups,{vibrant:5,soft:2,classic:2,premium:2});
 assert.deepEqual([...uiIds].sort(),[...serverIds].sort());
 for(const t of siteTemplates){const k=Object.keys(t.tokens);for(const req of ['bg','surface','ink','muted','accent','accentInk','line','radius','heading'])assert(k.includes(req),t.id+' missing '+req)}
});
