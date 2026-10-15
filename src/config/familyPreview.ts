export const sampleChildren=[{id:'sample-child-a',name:'Sample Child A',sports:['Table tennis','Cricket']},{id:'sample-child-b',name:'Sample Child B',sports:['Badminton','Pickleball']}];
export type ConsentRehearsal={id:string;tenantId:string;parentId:string;childId:string;sport:string;version:number;recordedAt:string;revokedAt?:string};
export function familyScopeValid(childId:string,sport:string){return sampleChildren.some(c=>c.id===childId&&c.sports.includes(sport))}
export function activeConsent(records:ConsentRehearsal[],tenantId:string,childId:string,sport:string,version:number){return records.find(r=>r.tenantId===tenantId&&r.childId===childId&&r.sport===sport&&r.version===version&&!r.revokedAt)}
