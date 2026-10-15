import {createContext,useContext,useState,type ReactNode,type Dispatch,type SetStateAction} from 'react';
export type OrganizerContext={tenantId:string;tournamentId:string;name:string;sport:string;venue:string};
const Session=createContext<{values:Record<string,unknown>;set:Dispatch<SetStateAction<Record<string,unknown>>>}|null>(null);
const Scope=createContext('standalone');
export function RehearsalSession({children}:{children:ReactNode}){const[values,set]=useState<Record<string,unknown>>({});return <Session.Provider value={{values,set}}>{children}</Session.Provider>}
export function RehearsalScope({id,children}:{id:string;children:ReactNode}){return <Scope.Provider value={id}>{children}</Scope.Provider>}
/** Memory only: survives navigation, never reload. Not authentication or durable storage. */
export function useRehearsalField<T>(field:string,initial:T|(()=>T)):[T,Dispatch<SetStateAction<T>>]{
 const session=useContext(Session),scope=useContext(Scope);
 const[fallback,setFallback]=useState(initial);const key=scope+'/'+field;
 if(!session)return[fallback,setFallback];
 const value=(Object.hasOwn(session.values,key)?session.values[key]:fallback) as T;
 const setValue:Dispatch<SetStateAction<T>>=next=>session.set(previous=>{const current=(Object.hasOwn(previous,key)?previous[key]:fallback) as T;return{...previous,[key]:typeof next==='function'?(next as (v:T)=>T)(current):next}});
 return[value,setValue];
}
export function organizerScope(c:Pick<OrganizerContext,'tenantId'|'tournamentId'>){return JSON.stringify(['organizer',c.tenantId,c.tournamentId])}
