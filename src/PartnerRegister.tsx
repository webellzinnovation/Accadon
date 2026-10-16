import {useEffect,useState} from 'react';
import {api,formValues} from './LiveWorkspace';
import {Brand} from './Brand';

type Directory={id:string;name:string;city:string}[];

export function PartnerRegister(){
 const [kind,setKind]=useState<'owner'|'organizer'>('owner');
 const [directory,setDirectory]=useState<Directory>([]);
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[done,setDone]=useState('');
 useEffect(()=>{api('/partner/academy-directory').then(d=>setDirectory(d.academies)).catch(()=>{})},[]);
 return <main className="live-login"><section className="live-login-intro"><div className="eyebrow">PARTNER REGISTRATION</div><h1>Bring your academy<br/><em>onto Accadon.</em></h1><p>Academy owners register their academy and set it up step by step. Tournament organizers request to join an existing academy.</p><div className="live-stage-note"><b>How it works</b><p>Owners finish a short onboarding before their academy goes live. Organizers start once their academy's administrator approves the request.</p></div><a href={`${import.meta.env.BASE_URL}#/partner`}>Already registered? Partner sign in ↗</a></section><section className="live-form-card"><Brand className="brand-card-heading"/><span className="ui-chip green">REGISTER</span><h2>{kind==='owner'?'Register your academy':'Join as an organizer'}</h2>{error&&<p className="live-error" role="alert">{error}</p>}{done?<><p className="live-success" role="status">{done}</p><a className="button primary" href={`${import.meta.env.BASE_URL}#/partner`}>Go to partner sign in ↗</a></>:<form onSubmit={e=>{e.preventDefault();const values={...formValues(e),account_type:kind,consent:values_consent(e)};setBusy(true);setError('');api('/partner/register','POST',values).then(r=>setDone(r.next==='onboarding'?'Academy registered. Sign in to finish your academy setup.':'Request sent. Sign in to watch its status.')).catch(err=>setError((err as Error).message)).finally(()=>setBusy(false))}}>
  <label>I am a<select value={kind} onChange={e=>setKind(e.target.value as 'owner'|'organizer')}><option value="owner">Academy owner</option><option value="organizer">Tournament organizer</option></select></label>
  {kind==='owner'&&<><label>Academy name<input name="academy_name" required minLength={2} maxLength={120}/></label><label>City<input name="city" maxLength={120}/></label></>}
  {kind==='organizer'&&<label>Academy you organize for<select name="academy_id" required>{directory.map(a=><option key={a.id} value={a.id}>{a.name}{a.city?` · ${a.city}`:''}</option>)}</select></label>}
  <label>Your name<input name="display_name" required minLength={2} maxLength={100}/></label>
  <label>Email<input name="email" type="email" required autoComplete="username" maxLength={254}/></label>
  <label>Password<input name="password" type="password" required autoComplete="new-password" minLength={12} maxLength={128}/><small>At least 12 characters.</small></label>
  <label className="live-checkbox"><input name="consent" type="checkbox" required/>I agree to create this {kind==='owner'?'academy':'organizer'} account.</label>
  <button className="button primary" disabled={busy}>{busy?'Please wait…':kind==='owner'?'Register academy ↗':'Send join request ↗'}</button>
 </form>}<p className="live-muted">Players and parents sign up on the main workspace page. Demo academies shown in the directory are sample data.</p></section></main>;
}
function values_consent(e:React.FormEvent<HTMLFormElement>){return new FormData(e.currentTarget).get('consent')==='on'}
