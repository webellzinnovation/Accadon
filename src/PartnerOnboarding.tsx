import {useEffect,useState,type FormEvent} from 'react';
import {api,formValues} from './LiveWorkspace';
import {Brand} from './Brand';

type Academy={id:string;name:string;city:string;published:boolean;onboarding_step:number;onboarding_data:Record<string,any>};
const STEPS=[['basics','Academy basics'],['sports','Sports & divisions'],['venues','Venues'],['branding','Branding'],['review','Review & publish']];

export function PartnerOnboarding(){
 const [academy,setAcademy]=useState<Academy|null>(null);
 const [step,setStep]=useState(1);
 const [data,setData]=useState<Record<string,any>>({});
 const [sports,setSports]=useState<{id:string;name:string}[]>([]);
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[done,setDone]=useState(false);
 const [authIssue,setAuthIssue]=useState('');
 useEffect(()=>{(async()=>{try{
   const [ob,sc]=await Promise.all([api('/partner/onboarding'),api('/sports')]);
   setAcademy(ob.academy);setData(ob.academy.onboarding_data||{});setStep(Math.min(Math.max(ob.academy.onboarding_step||1,1),5));setSports(sc.sports);
   if(ob.academy.published)setDone(true);
 }catch(e){setAuthIssue((e as Error).message)}})()},[]);
 async function save(next:number,merge:Record<string,any>){setBusy(true);setError('');try{const d={...data,...merge};await api('/partner/onboarding','PUT',{step:next,data:merge});setData(d);setStep(next)}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
 function stepForm(key:string,next:number){return (e:FormEvent<HTMLFormElement>)=>{e.preventDefault();const v=formValues(e);const merge=key==='sports'?{sports:{sports:new FormData(e.currentTarget).getAll('sports')}}:key==='venues'?{venues:{venues:String(v.venues||'').split('\n').map(s=>s.trim()).filter(Boolean)}}:{[key]:v};void save(next,merge)}}
 if(authIssue)return <main className="live-login"><section className="live-form-card"><Brand className="brand-card-heading"/><h2>Academy setup</h2><p className="live-error" role="alert">{authIssue}</p><a className="live-secondary" href={`${import.meta.env.BASE_URL}#/partner`}>Go to partner sign in ↗</a></section></main>;
 if(!academy)return <main className="live-login"><p role="status">Loading your academy setup…</p></main>;
 if(done)return <main className="live-login"><section className="live-form-card"><Brand className="brand-card-heading"/><span className="ui-chip green">LIVE</span><h2>{academy.name} is published</h2><p>Your academy is live on Accadon. Create tournaments, add staff and review entries from your workspace.</p><a className="button primary" href={`${import.meta.env.BASE_URL}#/partner`}>Open your academy workspace ↗</a></section></main>;
 return <main className="live-login live-onboarding"><section className="live-form-card live-wide-form"><Brand className="brand-card-heading"/><span className="ui-chip amber">SETUP · STEP {step} OF 5</span><h2>Set up {academy.name}</h2>
  <ol className="onboarding-steps">{STEPS.map(([key,label],i)=><li key={key} className={i+1===step?'current':i+1<step?'done':''} aria-current={i+1===step?'step':undefined}>{label}</li>)}</ol>
  {error&&<p className="live-error" role="alert">{error}</p>}
  {step===1&&<form onSubmit={stepForm('basics',2)}><label>Academy name<input name="name" defaultValue={data.basics?.name||academy.name} required minLength={2} maxLength={120}/></label><label>City<input name="city" defaultValue={data.basics?.city||academy.city} maxLength={120}/></label><label>About your academy<textarea name="about" rows={4} maxLength={600} defaultValue={data.basics?.about||''}/></label><button className="button primary" disabled={busy}>{busy?'Saving…':'Save & continue ↗'}</button></form>}
  {step===2&&<form onSubmit={stepForm('sports',3)}><p className="live-muted">Choose every sport your academy runs. You can run tournaments in all of them.</p><div className="onboarding-sports">{sports.map(s=><label key={s.id} className="live-checkbox"><input type="checkbox" name="sports" value={s.id} defaultChecked={(data.sports?.sports||[]).includes(s.id)}/>{s.name}</label>)}</div><button className="button primary" disabled={busy}>{busy?'Saving…':'Save & continue ↗'}</button></form>}
  {step===3&&<form onSubmit={stepForm('venues',4)}><label>Your venues<textarea name="venues" rows={4} maxLength={600} defaultValue={(data.venues?.venues||[]).join('\n')} placeholder={'One venue per line, e.g.\nMain arena - Court 1\nCommunity hall'}/></label><button className="button primary" disabled={busy}>{busy?'Saving…':'Save & continue ↗'}</button></form>}
  {step===4&&<form onSubmit={stepForm('branding',5)}><label>Tagline<input name="tagline" maxLength={140} defaultValue={data.branding?.tagline||''} placeholder="What players should know you for"/></label><label>Contact phone or WhatsApp<input name="contact" maxLength={40} defaultValue={data.branding?.contact||''}/></label><button className="button primary" disabled={busy}>{busy?'Saving…':'Save & continue ↗'}</button></form>}
  {step===5&&<><dl className="onboarding-review"><div><dt>Academy</dt><dd>{data.basics?.name||academy.name}{data.basics?.city?` · ${data.basics.city}`:''}</dd></div><div><dt>Sports</dt><dd>{(data.sports?.sports||[]).map((id:string)=>sports.find(s=>s.id===id)?.name||id).join(', ')||'None selected'}</dd></div><div><dt>Venues</dt><dd>{(data.venues?.venues||[]).join(' · ')||'Not added'}</dd></div><div><dt>Tagline</dt><dd>{data.branding?.tagline||'Not set'}</dd></div></dl><div className="live-form-actions"><button className="live-secondary" disabled={busy} onClick={()=>setStep(1)}>← Edit steps</button><button className="button primary" disabled={busy} onClick={()=>{setBusy(true);setError('');api('/partner/onboarding/complete','POST',{}).then(()=>setDone(true)).catch(e=>setError((e as Error).message)).finally(()=>setBusy(false))}}>{busy?'Publishing…':'Publish my academy ↗'}</button></div></>}
  <p className="live-muted">Progress saves at every step - you can leave and resume anytime. Publishing makes your academy visible to players, parents and organizers.</p></section></main>;
}
