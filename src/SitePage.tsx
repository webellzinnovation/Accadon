import {useEffect,useState} from 'react';
import {siteTemplate,siteSections,defaultSectionContent,type SiteSection} from './config/websiteTemplates';
type SiteData={template_id:string;slug:string;name:string;city:string|null;sports:string[];coaches:string[];tournaments:{name:string;sport:string;starts_on:string|null;venue:string|null}[];sections:Record<string,Record<string,unknown>&{hidden?:boolean}>};
const sportLabel=(id:string)=>id.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase());
export function SitePage({slug}:{slug:string}){
 const [data,setData]=useState<SiteData|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 useEffect(()=>{document.body.style.background=t0?t0.tokens.bg:'';return()=>{document.body.style.background=''}},[data?.template_id]);
 useEffect(()=>{let on=true;(async()=>{try{const r=await fetch(`/api/live/sites/${slug}`);const j=await r.json();if(!r.ok)throw new Error(j.error||'This academy site is not available.');if(on)setData(j.site)}catch(e){if(on)setError((e as Error).message)}finally{if(on)setLoading(false)}})();return()=>{on=false}},[slug]);
 const t0=data?siteTemplate(data.template_id):null;
 if(loading)return <main className="site-page"><p role="status" style={{padding:40}}>Loading academy site…</p></main>;
 if(error||!data)return <main className="site-page"><section className="site-error"><h1>Site not available</h1><p>{error||'This academy site is not published yet.'}</p><a href="/">Back to Accadon</a></section></main>;
 const t=siteTemplate(data.template_id);
 const base=defaultSectionContent(data);
 const sec=(id:SiteSection)=>({...(base[id] as Record<string,unknown>),...(data.sections?.[id]||{})});
 const hidden=(id:SiteSection)=>data.sections?.[id]?.hidden===true;
 const hero=sec('hero'),about=sec('about'),contact=sec('contact');
 const style={['--site-bg' as string]:t.tokens.bg,['--site-surface' as string]:t.tokens.surface,['--site-ink' as string]:t.tokens.ink,['--site-muted' as string]:t.tokens.muted,['--site-accent' as string]:t.tokens.accent,['--site-accent-ink' as string]:t.tokens.accentInk,['--site-line' as string]:t.tokens.line,['--site-radius' as string]:t.tokens.radius,['--site-heading' as string]:t.tokens.heading};
 return <main className={`site-page site-${t.group}`} style={style}>
  <nav className="site-nav" aria-label="Academy site"><b>{data.name}</b><div>{siteSections.filter(s=>!hidden(s.id)&&s.id!=='hero').map(s=><a key={s.id} href={`#site-${s.id}`}>{s.label}</a>)}</div></nav>
  {!hidden('hero')&&<header className="site-hero" id="site-hero"><div className="eyebrow">{data.city||'SPORTS ACADEMY'}</div><h1>{String(hero.title||data.name)}</h1><p>{String(hero.subtitle||'')}</p>{!hidden('contact')&&<a className="site-cta" href="#site-contact">Get in touch ↗</a>}</header>}
  {!hidden('about')&&<section className="site-section" id="site-about"><h2>About</h2><p>{String(about.body||'')||`${data.name} is a multi-sport academy${data.city?` based in ${data.city}`:''}, coaching on Accadon.`}</p></section>}
  {!hidden('sports')&&<section className="site-section" id="site-sports"><h2>Sports</h2>{data.sports.length?<ul className="site-tags">{data.sports.map(s=><li key={s}>{sportLabel(s)}</li>)}</ul>:<p className="site-muted">Sports will be listed here soon.</p>}</section>}
  {!hidden('tournaments')&&<section className="site-section" id="site-tournaments"><h2>Upcoming tournaments</h2>{data.tournaments.length?<div className="site-cards">{data.tournaments.map((ev,i)=><article key={i}><h3>{ev.name}</h3><p>{sportLabel(ev.sport)}</p><small>{ev.starts_on?.slice(0,10)||'Date to be announced'}{ev.venue?` · ${ev.venue}`:''}</small></article>)}</div>:<p className="site-muted">No published tournaments right now. Check back soon.</p>}</section>}
  {!hidden('coaches')&&<section className="site-section" id="site-coaches"><h2>Our team</h2>{data.coaches.length?<ul className="site-tags">{data.coaches.map(c=><li key={c}>{c}</li>)}</ul>:<p className="site-muted">Team profiles will be listed here soon.</p>}</section>}
  {!hidden('contact')&&<section className="site-section" id="site-contact"><h2>Contact</h2><ul className="site-contact">{contact.email?<li>Email: {String(contact.email)}</li>:null}{contact.phone?<li>Phone: {String(contact.phone)}</li>:null}{contact.address?<li>Address: {String(contact.address)}</li>:null}{!contact.email&&!contact.phone&&!contact.address&&<li className="site-muted">Contact details will be listed here soon.</li>}</ul></section>}
  <footer className="site-footer"><span>{data.name} · Powered by <a href="/">Accadon</a></span></footer>
 </main>}
