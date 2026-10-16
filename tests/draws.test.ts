import {test} from 'node:test';import assert from 'node:assert/strict';
import {roundRobin,singleElimination,roundRobinStandings} from '../server/draws';
const ids=(n:number)=>Array.from({length:n},(_,i)=>`p${i+1}`);
test('round robin: everyone plays everyone exactly once, byes only on odd counts',()=>{
 for(const n of [2,3,4,5,6,7,8]){const ms=roundRobin(ids(n));
  const real=ms.filter(m=>m.status==='scheduled');
  const pairs=new Set(real.map(m=>[m.player_a,m.player_b].sort().join('|')));
  assert.equal(pairs.size,n*(n-1)/2,`n=${n}: ${pairs.size} unique pairs`);
  assert.equal(ms.filter(m=>m.status==='bye').length,n%2?n:0,`n=${n} byes`);
  const rounds=new Set(real.map(m=>m.round));assert.equal(rounds.size,n%2?n:n-1,`n=${n} rounds`);
  // no player twice in one round
  const byRound=new Map<number,string[]>();for(const m of real){const l=byRound.get(m.round)||[];l.push(m.player_a!,m.player_b!);byRound.set(m.round,l)}
  for(const [r,l] of byRound)assert.equal(new Set(l).size,l.length,`n=${n} round ${r} dupes`)}
});
test('single elimination: full bracket, byes to top seeds, TBD later rounds',()=>{
 const ms=singleElimination(ids(5)); // bracket of 8
 assert.equal(ms.filter(m=>m.round===1).length,4);
 assert.equal(ms.filter(m=>m.status==='bye').length,3);
 assert.equal(ms.filter(m=>m.round===2).length,2);
 assert.equal(ms.filter(m=>m.round===3).length,1,'final');
 assert(ms.filter(m=>m.round>1).every(m=>m.player_a===null&&m.player_b===null));
 const p1=ms.find(m=>m.round===1&&m.player_a==='p1');assert(p1,'top seed plays round 1');
 assert.equal(singleElimination(ids(4)).filter(m=>m.status==='bye').length,0,'power of two: no byes');
});
test('round robin standings: 2/1/0 points, difference tiebreak',()=>{
 const t=roundRobinStandings([
  {player_a:'a',player_b:'b',score_a:3,score_b:1,status:'completed',winner_id:'a'},
  {player_a:'a',player_b:'c',score_a:2,score_b:2,status:'completed',winner_id:null},
  {player_a:'b',player_b:'c',score_a:0,score_b:4,status:'completed',winner_id:'c'},
  {player_a:'b',player_b:null,score_a:null,score_b:null,status:'bye',winner_id:'b'}]);
 assert.deepEqual(t.map(r=>r.player_id),['c','a','b']);
 assert.equal(t[1].drawn,1);assert.equal(t[2].played,2,'bye does not count as played');
});
