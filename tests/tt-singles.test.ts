import test from 'node:test';import assert from 'node:assert/strict';
import {ttSnapshot,addTTEvent,type TTEvent,type Side,type BestOf} from '../src/config/ttSingles';
const pts=(s:Side,n:number):TTEvent[]=>Array.from({length:n},(_,i)=>({id:i+1,type:'point',side:s}));
// Build a legal rally sequence for final game score a-b (a>b): alternate to b-b, then winner streak.
const game=(a:number,b:number,startId=1):TTEvent[]=>{const w:Side=a>b?0:1;const out:TTEvent[]=[];let id=startId;
 for(let i=0;i<b;i++){out.push({id:id++,type:'point',side:w},{id:id++,type:'point',side:(1-w) as Side})}
 for(let i=b;i<a;i++)out.push({id:id++,type:'point',side:w});
 return out};
test('11-point game, win by two, no cap; 10-10 continues; 12-10 completes',()=>{
 const p={bestOf:3 as BestOf,firstServer:0 as Side};
 let s=ttSnapshot(p,game(11,10));
 assert.deepEqual(s.points,[11,10]);assert.equal(s.completed.length,0);assert.equal(s.winner,null,'11-10 unfinished');
 s=ttSnapshot(p,game(12,10));
 assert.equal(s.completed.length,1);assert.deepEqual(s.completed[0].points,[12,10]);assert.equal(s.completed[0].winner,0);
 const long=ttSnapshot(p,game(22,20));
 assert.equal(long.completed.length,1);assert.deepEqual(long.completed[0].points,[22,20],'20-20 then two straight completes, no cap');
 const tied=ttSnapshot(p,game(21,20));assert.equal(tied.completed.length,0);assert.deepEqual(tied.points,[21,20],'20-20 still unfinished at 21-20');});
test('serve changes every 2 points, alternates every point at 10-10; first server alternates by game',()=>{
 const p={bestOf:3 as BestOf,firstServer:0 as Side};
 const seq=(scores:[number,number]):Side=>{const ev:TTEvent[]=[];let id=1;const w:Side=scores[0]>=scores[1]?0:1;
  for(let i=0;i<Math.min(...scores);i++){ev.push({id:id++,type:'point',side:0},{id:id++,type:'point',side:1})}
  const lead=Math.max(...scores)-Math.min(...scores);for(let i=0;i<lead;i++)ev.push({id:id++,type:'point',side:w});
  return ttSnapshot(p,ev).server};
 assert.equal(seq([0,0]),0);assert.equal(seq([1,0]),0);assert.equal(seq([2,0]),1);assert.equal(seq([3,0]),1);assert.equal(seq([4,0]),0);
 assert.equal(seq([9,9]),1,'point 19 starts a new two-point block for side B');
 assert.equal(seq([10,10]),0,'after the 19-20 block, one-point deuce alternation starts with A');
 assert.equal(seq([11,10]),1);assert.equal(seq([11,11]),0);assert.equal(seq([12,12]),0,'12-12: after A,B,A,B the next serve returns to A');
 const g1=game(11,5);
 const s2=ttSnapshot(p,g1);assert.equal(s2.gameNumber,2);assert.equal(s2.server,1,'first server of game 1 receives first in game 2');});
test('best-of 3/5/7 match completion and post-match events blocked',()=>{
 for(const bestOf of [3,5,7] as BestOf[]){const need=(bestOf+1)/2;const ev=Array.from({length:need},(_,g)=>pts(0,11).map((e,i)=>({...e,id:g*11+i+1}))).flat();
  const s=ttSnapshot({bestOf,firstServer:0},ev);assert.equal(s.winner,0);assert.deepEqual(s.games,[need,0]);assert.equal(s.gameNumber,need,'game number capped at played count');
  const after=addTTEvent({bestOf,firstServer:0},ev,{type:'point',side:1});assert.equal(after.length,ev.length,'no event after match winner');}});
test('deciding game end switch at 5 in best of 3 and best of 7',()=>{
 for(const bestOf of [3,5,7] as BestOf[]){const need=(bestOf+1)/2;const pre=Array.from({length:bestOf-1},(_,g)=>pts(g%2 as Side,11).map((e,i)=>({...e,id:g*11+i+1}))).flat();
  const base={bestOf,firstServer:0 as Side};
  let s=ttSnapshot(base,pre);assert.equal(s.gameNumber,bestOf);assert.equal(s.decidingGame,true);assert.equal(s.endsSwitchedInGame,false);
  s=ttSnapshot(base,[...pre,...pts(0,5).map((e,i)=>({...e,id:pre.length+i+1}))]);assert.equal(s.endsSwitchedInGame,true);
  s=ttSnapshot(base,[...pre,...pts(1,4).map((e,i)=>({...e,id:pre.length+i+1}))]);assert.equal(s.endsSwitchedInGame,false,'only at five');
  s=ttSnapshot(base,[...pre,...pts(1,5).map((e,i)=>({...e,id:pre.length+i+1}))]);assert.equal(s.endsSwitchedInGame,true,'either side reaching five');}});
test('end assignment alternates each game; deciding switch flips at five',()=>{
 const p={bestOf:3 as BestOf,firstServer:0 as Side};
 const pre=pts(0,11).map((e,i)=>({...e,id:i+1}));let s=ttSnapshot(p,pre);assert.equal(s.sideAAtInitialEnd,false,'game 2 opposite end');
 const pre2=[...pre,...pts(1,11).map((e,i)=>({...e,id:pre.length+i+1}))];s=ttSnapshot(p,pre2);assert.equal(s.sideAAtInitialEnd,true,'game 3 back to initial');
 s=ttSnapshot(p,[...pre2,...pts(0,5).map((e,i)=>({...e,id:pre2.length+i+1}))]);assert.equal(s.sideAAtInitialEnd,false,'deciding switch flips side A');});
test('let leaves score, server and game state unchanged',()=>{
 const p={bestOf:5 as BestOf,firstServer:0 as Side};const ev=[{id:1,type:'point' as const,side:0 as Side},{id:2,type:'let' as const},{id:3,type:'point' as const,side:1 as Side}];
 const s=ttSnapshot(p,ev);assert.deepEqual(s.points,[1,1]);assert.equal(s.server,1);assert.equal(s.activeEventIds.length,3);});
test('undo appends with reason, replays prior points, and blocks reasonless undo',()=>{
 const p={bestOf:3 as BestOf,firstServer:0 as Side};
 let ev=game(12,10);
 assert.equal(ttSnapshot(p,ev).completed.length,1);
 const noReason=addTTEvent(p,ev,{type:'undo',reason:'  '});assert.equal(noReason.length,ev.length);
 ev=addTTEvent(p,ev,{type:'undo',reason:'wrong server corrected'});assert.equal(ev.at(-1)?.type,'undo');assert.equal((ev.at(-1) as {target:number}).target,22);
 let s=ttSnapshot(p,ev);assert.equal(s.completed.length,0);assert.deepEqual(s.points,[11,10]);assert.equal(s.activeEventIds.length,21);
 ev=addTTEvent(p,ev,{type:'undo',reason:'second correction'});s=ttSnapshot(p,ev);assert.deepEqual(s.points,[10,10]);
 const evLet=[{id:1,type:'point' as const,side:0 as Side},{id:2,type:'let' as const}];
 const u=addTTEvent(p,evLet,{type:'undo',reason:'rally replayed'});assert.equal(ttSnapshot(p,u).activeEventIds.length,1,'undo can target a let');});
test('invalid profiles rejected',()=>{assert.throws(()=>ttSnapshot({bestOf:4 as BestOf,firstServer:0},[]));assert.throws(()=>ttSnapshot({bestOf:3,firstServer:2 as Side},[]))});
