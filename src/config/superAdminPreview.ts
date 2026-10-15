/** Local rehearsal identities, never authentication principals. */
export const previewRoles=['Academy admin','Organizer','Coach','Parent','Player'] as const;
export type PreviewRole=typeof previewRoles[number];
export type PreviewTenant={id:string;name:string;city:string;sports:string[]};
export type PreviewTournament={id:string;tenantId:string;name:string;sport:string;venue:string;status:'Draft'};
export const initialPreviewTenants:PreviewTenant[]=[{id:'sample-academy',name:'Sample Academy',city:'Fictional city',sports:['Table tennis','Badminton']}];
export function validateTenant(name:string,city:string,sports:string[]){return !name.trim()||!city.trim()||!sports.length?'Add an academy name, city and at least one sport.':''}
export function tournamentForTenant(events:PreviewTournament[],id:string){return events.filter(e=>e.tenantId===id)}
export function canEnterRole(id:string,tenants:PreviewTenant[],role:string):role is PreviewRole{return tenants.some(t=>t.id===id)&&previewRoles.includes(role as PreviewRole)}
