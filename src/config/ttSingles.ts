/** Singles-only ITTF 2026 standard profile, sections 2.11-2.13. No expedite/doubles. */
export type Side=0|1;export type BestOf=3|5|7;
export type TTEvent={id:number;type:'point';side:Side}|{id:number;type:'let'}|{id:number;type:'undo';target:number;reason:string};
export type TTProfile={bestOf:BestOf;firstServer:Side};
export type TTGame={points:[number,number];winner:Side};
export type TTSnapshot={points:[number,number];games:[number,number];completed:TTGame[];gameNumber:number;server:Side;winner:Side|null;decidingGame:boolean;endsSwitchedInGame:boolean;sideAAtInitialEnd:boolean;activeEventIds:number[];nextId:number};
export function ttSnapshot(profile:TTProfile,events:TTEvent[]):TTSnapshot{
 if(![3,5,7].includes(profile.bestOf)||![0,1].includes(profile.firstServer))throw new Error('Invalid TT singles profile.');
 const removed=new Set(events.filter((e):e is Extract<TTEvent,{type:'undo'}>=>e.type==='undo').map(e=>e.target));
 let points:[number,number]=[0,0],games:[number,number]=[0,0],completed:TTGame[]=[],winner:Side|null=null;const active=events.filter(e=>e.type!=='undo'&&!removed.has(e.id));
 for(const event of active){if(winner!==null)break;if(event.type!=='point')continue;points[event.side]++;if(points[event.side]>=11&&points[event.side]-points[(1-event.side) as Side]>=2){const win=event.side;completed.push({points:[...points],winner:win});games[win]++;if(games[win]===(profile.bestOf+1)/2)winner=win;else points=[0,0]}}
 const gameNumber=winner!==null?completed.length:completed.length+1,decidingGame=gameNumber===profile.bestOf,endsSwitchedInGame=decidingGame&&Math.max(...points)>=5;
 const first=(profile.firstServer+(gameNumber-1))%2 as Side,total=points[0]+points[1];const changes=points[0]>=10&&points[1]>=10?10+(total-20):Math.floor(total/2),server=((first+changes)%2) as Side;
 return{points,games,completed,gameNumber,server,winner,decidingGame,endsSwitchedInGame,sideAAtInitialEnd:(gameNumber-1+(endsSwitchedInGame?1:0))%2===0,activeEventIds:active.map(e=>e.id),nextId:Math.max(0,...events.map(e=>e.id))+1};
}
export function addTTEvent(profile:TTProfile,events:TTEvent[],action:{type:'point';side:Side}|{type:'let'}|{type:'undo';reason:string}):TTEvent[]{const s=ttSnapshot(profile,events);if(action.type==='undo'){const target=s.activeEventIds.at(-1);if(!action.reason.trim()||target===undefined)return events;return[...events,{id:s.nextId,type:'undo',target,reason:action.reason.trim()}]}if(s.winner!==null)return events;return[...events,{...action,id:s.nextId}]}
