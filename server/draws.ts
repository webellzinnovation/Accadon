// Draw generation: pure functions over entry player ids, unit-tested directly.
export type MatchSpec={round:number;position:number;player_a:string|null;player_b:string|null;status:'scheduled'|'bye';winner_id:string|null};
// Round robin via the circle method. Odd player counts get a bye slot each round.
export function roundRobin(players:string[]):MatchSpec[]{
 if(players.length<2)throw new Error('need at least 2 players');
 const list:(string|null)[]=[...players];if(list.length%2)list.push(null);
 const n=list.length,rounds=n-1,half=n/2,out:MatchSpec[]=[];
 const ring=[...list];
 for(let r=0;r<rounds;r++){
  for(let i=0;i<half;i++){
   const a=ring[i],b=ring[n-1-i];
   if(a!==null&&b!==null)out.push({round:r+1,position:i+1,player_a:a,player_b:b,status:'scheduled',winner_id:null});
   else if(a!==null||b!==null)out.push({round:r+1,position:i+1,player_a:a||b,player_b:null,status:'bye',winner_id:a||b});}
  // rotate all but the first element
  ring.splice(1,0,ring.pop()!);}
 return out}
// Single elimination: standard seeded bracket (seed 1 vs seed N), byes to top seeds.
// Later rounds are emitted as empty TBD slots so the full bracket is visible.
export function singleElimination(players:string[]):MatchSpec[]{
 if(players.length<2)throw new Error('need at least 2 players');
 let size=2;while(size<players.length)size*=2;
 const rounds=Math.log2(size),out:MatchSpec[]=[];
 // Standard seed order: position of seed s in a bracket of `size`.
 const order:number[]=[1,2];while(order.length<size){const next:number[]=[];const span=order.length*2+1;for(const s of order){next.push(s,span-s)}order.length=0;order.push(...next)}
 for(let i=0;i<size/2;i++){
  const seedA=order[2*i],seedB=order[2*i+1];
  const a=players[seedA-1]||null,b=players[seedB-1]||null;
  if(a&&b)out.push({round:1,position:i+1,player_a:a,player_b:b,status:'scheduled',winner_id:null});
  else out.push({round:1,position:i+1,player_a:a||b,player_b:null,status:'bye',winner_id:a||b});}
 for(let r=2;r<=rounds;r++)for(let p=1;p<=size/2**r;p++)out.push({round:r,position:p,player_a:null,player_b:null,status:'scheduled',winner_id:null});
 return out}
export const supportedDrawFormats=['round_robin','single_elimination'] as const;
// Round robin standings: win 2 pts, draw 1, loss 0; tie broken by point difference.
export function roundRobinStandings(matches:{player_a:string|null;player_b:string|null;score_a:number|null;score_b:number|null;status:string;winner_id:string|null}[]){
 const table=new Map<string,{player_id:string;played:number;won:number;drawn:number;lost:number;points:number;score_for:number;score_against:number}>();
 const row=(id:string)=>{if(!table.has(id))table.set(id,{player_id:id,played:0,won:0,drawn:0,lost:0,points:0,score_for:0,score_against:0});return table.get(id)!};
 for(const m of matches){
  if(m.status==='bye'){if(m.winner_id)row(m.winner_id);continue}
  if(m.status!=='completed'||m.score_a===null||m.score_b===null){if(m.player_a)row(m.player_a);if(m.player_b)row(m.player_b);continue}
  const a=row(m.player_a!),b=row(m.player_b!);
  a.played++;b.played++;a.score_for+=m.score_a;a.score_against+=m.score_b;b.score_for+=m.score_b;b.score_against+=m.score_a;
  if(m.score_a===m.score_b){a.drawn++;b.drawn++;a.points++;b.points++}
  else if(m.score_a>m.score_b){a.won++;a.points+=2;b.lost++}
  else{b.won++;b.points+=2;a.lost++}}
 return [...table.values()].sort((x,y)=>y.points-x.points||(y.score_for-y.score_against)-(x.score_for-x.score_against)||x.player_id.localeCompare(y.player_id))}
