import {fixtures} from '../TournamentHome';
export type MatchState='Scheduled'|'In progress'|'Submitted / unverified'|'Certified';
export type DemoMatch={id:string;stage:string;group?:string;a:string;b:string;score?:[string,string];state:MatchState;allocation:string;context:string;feeds?:string;winner?:string};
export type DemoGroup={name:string;entrants:string[]};
export type DemoDraw={format:string;note:string;groups:DemoGroup[];matches:DemoMatch[];featured:string;points:number;qualification:string;sources:string[]};
const match=(id:string,stage:string,a:string,b:string,score:[string,string]|undefined,state:MatchState,allocation:string,context:string,group?:string,winner?:string,feeds?:string):DemoMatch=>({id,stage,a,b,score,state,allocation,context,group,winner,feeds});
function pools(sport:number,names:string[],points=2):DemoDraw{
 const f=fixtures[sport];const tt=sport===0;const groups=[{name:'Group A',entrants:[names[0],names[2],names[3]]},{name:'Group B',entrants:[names[4],names[1],names[5]]}];const matches:DemoMatch[]=[];
 groups.forEach((g,gi)=>{[[0,1],[0,2],[1,2]].forEach(([a,b],i)=>{const id=`${gi?'B':'A'}${i+1}`;matches.push(match(id,'Group round robin',g.entrants[a],g.entrants[b],tt?['3',i===1?'1':'0']:['11',i===1?'7':'5'],'Certified',`${tt?'Table':'Court'} 0${gi+1}`,tt?'Completed · Games won':'Completed · Points',g.name,g.entrants[a],undefined))})});
 matches.push(match('SF1','Semi-finals',names[0],names[1],[f.scores[0],f.scores[1]],'In progress',f.place,f.detail,undefined,undefined,'Winner → F'));
 matches.push(match('SF2','Semi-finals',names[2],names[4],undefined,'Scheduled',`${tt?'Table':'Court'} 02`,'Next available allocation · Not started',undefined,undefined,'Winner → F'));
 matches.push(match('F','Final','Winner SF1','Winner SF2',undefined,'Scheduled',`${tt?'Table':'Court'} 01`,'After both semi-finals · Not started'));
 return {format:'2 pools of 3 → top two → semi-finals → final',note:'Illustrative event configuration, not an official Indian draw. Single round robin within each pool. Crossovers: A1–B2 and A2–B1 are explicitly chosen for this demo; production draw placement requires organizer approval.',groups,matches,featured:'SF1',points,qualification:'Top two per pool. Demo crossover A1–B2 → SF1; A2–B1 → SF2. No third-place match. No tied positions in this snapshot. Tied standings must stop for an approved sport-specific tie-break.',sources:[]};
}
const tt=pools(0,['Aarav K.','Vihaan S.','Rohan P.','Ishan D.','Arjun N.','Kabir T.']);
// Cross-pool semifinals use the completed group positions.
const badminton:DemoDraw={format:'8 pairs → quarter-finals → semi-finals → final',note:'Illustrative eight-entry single knockout from the research worked example, not an actual Chennai event draw. Seed placement is an example only. Best-of-three 21-point match profile remains pending adoption.',groups:[],points:0,featured:'QF1',qualification:'Seed layout 1–8, 4–5, 2–7, 3–6. W QF1/W QF2 → SF1; W QF3/W QF4 → SF2; winners → F. No byes or bronze match.',sources:[],matches:[
 match('QF1','Quarter-finals','Maya / Tara','Diya / Riya',['18','16'],'In progress','Court 02','Games 1–0 · Game 2',undefined,undefined,'Winner → SF1'),
 match('QF2','Quarter-finals','Anu / Nila','Leela / Sana',['2','0'],'Certified','Court 01','Completed · Games won',undefined,'Anu / Nila','Winner → SF1'),
 match('QF3','Quarter-finals','Priya / Zoya','Meera / Jiya',['2','1'],'Submitted / unverified','Court 03','Reported games · Advancement held',undefined,undefined,'Winner after certification → SF2'),
 match('QF4','Quarter-finals','Asha / Kriti','Neha / Pooja',undefined,'Scheduled','Court 04','Not started',undefined,undefined,'Winner → SF2'),
 match('SF1','Semi-finals','Winner QF1','Anu / Nila',undefined,'Scheduled','Court 01','After feeder matches',undefined,undefined,'Winner → F'),
 match('SF2','Semi-finals','Winner QF3','Winner QF4',undefined,'Scheduled','Court 02','QF3 unverified; qualifier unresolved',undefined,undefined,'Winner → F'),
 match('F','Final','Winner SF1','Winner SF2',undefined,'Scheduled','Court 01','After both semi-finals'),
]};
const footballNames=['Eastfield FC','Westpark FC','Southgate FC','Riverbank FC'];
const football:DemoDraw={format:'4-team single round-robin league',note:'Illustrative four-team league, not IWL inventory or regulations. Every team meets each other once: six fixtures. No knockout stage in this demo.',groups:[{name:'League / Group B',entrants:footballNames}],points:3,featured:'L5',qualification:'Win 3, draw 1, loss 0 in this demo. Highest points wins the league. No tied positions in the snapshot; official AIFF head-to-head tie-break adoption remains gated. No elimination stage.',sources:[],matches:[
 match('L1','League stage',footballNames[0],footballNames[2],['3','0'],'Certified','Pitch 01','Full time','League / Group B',footballNames[0]),
 match('L2','League stage',footballNames[1],footballNames[3],['2','0'],'Certified','Pitch 02','Full time','League / Group B',footballNames[1]),
 match('L3','League stage',footballNames[0],footballNames[3],['2','0'],'Certified','Pitch 01','Full time','League / Group B',footballNames[0]),
 match('L4','League stage',footballNames[2],footballNames[1],['1','1'],'Certified','Pitch 02','Full time · Draw','League / Group B'),
 match('L5','League stage',footballNames[0],footballNames[1],['2','1'],'In progress','Pitch 01','64′ · Second half','League / Group B'),
 match('L6','League stage',footballNames[2],footballNames[3],undefined,'Scheduled','Pitch 02','Not started','League / Group B'),
]};
const cricketNames=['Boundary XI','Willow XI','Cedar XI','Harbour XI'];
const cricket:DemoDraw={format:'4-team single round robin → top two final',note:'Illustrative local T20 league-plus-knockout. Not a BCCI or IPL template. Six league fixtures plus one final. No IPL second-chance qualifier edges.',groups:[{name:'League',entrants:cricketNames}],points:2,featured:'L5',qualification:'Demo win 2 / loss 0. Top two after all league matches → F. Tied league positions remain unresolved; points for those outcomes and NRR eligibility must be approved before activation. No NRR invented.',sources:[],matches:[
 match('L1','League stage',cricketNames[0],cricketNames[2],['160/5','140/8'],'Certified','Ground A','Boundary won by 20 runs','League',cricketNames[0]),
 match('L2','League stage',cricketNames[1],cricketNames[3],['150/6','135/9'],'Certified','Ground B','Willow won by 15 runs','League',cricketNames[1]),
 match('L3','League stage',cricketNames[0],cricketNames[3],['171/4','120/9'],'Certified','Ground A','Boundary won by 51 runs','League',cricketNames[0]),
 match('L4','League stage',cricketNames[2],cricketNames[1],['144/6','140/9'],'Certified','Ground B','Cedar won by 4 runs','League',cricketNames[2]),
 match('L5','League stage',cricketNames[0],cricketNames[1],['142/4','156/7'],'In progress','Ground A','Target 157 · Need 15 from 12 · 18.0 overs','League'),
 match('L6','League stage',cricketNames[2],cricketNames[3],undefined,'Scheduled','Ground B','Not started','League'),
 match('F','Final','League rank 1','League rank 2',undefined,'Scheduled','Ground A','Only after league completed and standings approved'),
]};
const pickle=pools(4,['Neel / Sara','Dev / Isha','Aman / Nia','Kiran / Anya','Jay / Anika','Om / Mia'],1);
pickle.matches.find(m=>m.id==='SF1')!.stage='Semi-finals';pickle.note+=' Single-game 11-point results are illustrative. Serve/scoring profile and tie-break adoption are activation gates.';
export const tournamentDraws=[tt,badminton,football,cricket,pickle];
export function groupRows(draw:DemoDraw,group:DemoGroup){return group.entrants.map((name,seed)=>{const played=draw.matches.filter(m=>m.group===group.name&&m.state==='Certified'&&(m.a===name||m.b===name));const wins=played.filter(m=>m.winner===name).length;const draws=played.filter(m=>m.score?.[0]===m.score?.[1]).length;return {name,seed,played:played.length,wins,draws,losses:played.length-wins-draws,points:wins*draw.points+draws}}).sort((a,b)=>b.points-a.points||a.seed-b.seed)}
