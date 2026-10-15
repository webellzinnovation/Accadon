import type {BoardFixture} from '../LiveEventCard';
export type TournamentSnapshot={categories:number;completed:number;total:number;phase:string;ongoing:string[];upcoming:string[]};
const snapshots:Record<string,TournamentSnapshot>={
 'City Circuit Open':{categories:4,completed:38,total:52,phase:'Knockout rounds',ongoing:['U17 singles','U15 singles'],upcoming:['U13 singles']},
 'Shuttle Weekend':{categories:3,completed:21,total:36,phase:'Quarter-finals',ongoing:["Women's doubles","Men's singles"],upcoming:['Mixed doubles']},
 'Academy Youth League':{categories:2,completed:14,total:22,phase:'Group stage',ongoing:['U15'],upcoming:['U17']},
 'Weekend T20 Cup':{categories:1,completed:8,total:15,phase:'League stage',ongoing:['Senior'],upcoming:[]},
 'Courtside Doubles':{categories:3,completed:18,total:26,phase:'Semi-finals',ongoing:['Mixed doubles','Open doubles'],upcoming:[]},
 'Junior Rising Stars':{categories:3,completed:0,total:36,phase:'Registration complete',ongoing:[],upcoming:['U13 singles','U15 singles']},
};
/** Explicit fictional status snapshots, not a feed or a complete competition graph. */
export function tournamentSnapshot(f:BoardFixture):TournamentSnapshot{return snapshots[f.event]??{categories:1,completed:0,total:1,phase:'Not started',ongoing:[],upcoming:[]}}
