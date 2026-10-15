import {test} from 'node:test';
import assert from 'node:assert/strict';
import {tournamentDraws,groupRows} from '../src/config/tournamentDemo';
test('complete demo graphs have unique ids, all pool pairings and consistent standings',()=>{
 assert.deepEqual(tournamentDraws.map(d=>d.matches.length),[9,7,6,7,9]);
 for(const d of tournamentDraws){assert.equal(new Set(d.matches.map(m=>m.id)).size,d.matches.length);
 for(const g of d.groups){const ms=d.matches.filter(m=>m.group===g.name);assert.equal(ms.length,g.entrants.length*(g.entrants.length-1)/2);assert.equal(new Set(ms.map(m=>[m.a,m.b].sort().join('|'))).size,ms.length);for(const m of ms){assert(g.entrants.includes(m.a));assert(g.entrants.includes(m.b))}const rows=groupRows(d,g);const completed=ms.filter(m=>m.state==='Certified');assert.equal(rows.reduce((n,r)=>n+r.played,0),completed.length*2);assert.equal(rows.reduce((n,r)=>n+r.wins,0),completed.filter(m=>m.winner).length)}
 for(const m of d.matches){if(m.state==='Scheduled')assert.equal(m.score,undefined);if(m.winner){assert.equal(m.state,'Certified');assert([m.a,m.b].includes(m.winner))}}
 }
});
test('standings and unresolved qualifiers do not consume in-progress or unverified scores',()=>{const f=tournamentDraws[2];assert.deepEqual(groupRows(f,f.groups[0]).map(r=>r.points),[6,4,1,0]);assert.equal(tournamentDraws[1].matches.find(m=>m.id==='SF2')!.a,'Winner QF3');const c=tournamentDraws[3];assert.deepEqual(groupRows(c,c.groups[0]).map(r=>r.points),[4,2,2,0]);assert.equal(c.matches.at(-1)!.a,'League rank 1');});
test('cross-pool semifinal entrants match certified demo group ranks',()=>{for(const i of [0,4]){const d=tournamentDraws[i],a=groupRows(d,d.groups[0]),b=groupRows(d,d.groups[1]);assert.deepEqual(d.matches.find(m=>m.id==='SF1')!.a,a[0].name);assert.deepEqual(d.matches.find(m=>m.id==='SF1')!.b,b[1].name);assert.equal(d.matches.find(m=>m.id==='SF2')!.a,a[1].name);assert.equal(d.matches.find(m=>m.id==='SF2')!.b,b[0].name)}});
