import {SuperAdminWorkspace} from './SuperAdminWorkspace';
import {KitIcon} from './KitIcon';
import {DesignSystem} from './DesignSystem';
import './design-system.css';
import {AcademyWorkspace} from './AcademyWorkspace';
import {OrganizerSettings} from './OrganizerSettings';
import {OrganizerBuilder} from './OrganizerBuilder';
import {Brand} from './Brand';
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TournamentHome } from './TournamentHome';
import { TournamentsPage } from './TournamentsPage';
import { DashboardPreviews } from './DashboardPreviews';
import { InquiryForm } from './InquiryForm';
import './styles.css';
import './app-theme.css';
import { WorkflowReview } from './WorkflowReview';
import { LiveWorkspace } from './LiveWorkspace';
import { DemoAccess } from './DemoAccess';
gsap.registerPlugin(ScrollTrigger);
const appBase = import.meta.env.BASE_URL;
const appUrl = (path:string) => {
  const relative = path.replace(/^\//,'');
  return appBase + (appBase !== '/' && relative && !relative.startsWith('#') ? '#/' : '') + relative;
};

function Header({kit=false}:{kit?:boolean}) {
  const [open, setOpen] = useState(false);
  return <header className="header" data-kit-header={kit||undefined}><a className="wordmark" href={appUrl('/')} aria-label="Accadon home"><Brand/></a><button className="menu-toggle" aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'} <span><KitIcon name={open?'close':'plus'}/></span></button><nav id="navigation" className={open ? 'open' : ''} aria-label="Main"><a href={appUrl('/tournaments')} onClick={() => setOpen(false)}>Tournaments</a><a href={appUrl('/organizer')} onClick={() => setOpen(false)}>Organize</a><a href={appUrl('/#how-it-works')} onClick={() => setOpen(false)}>How it works</a><a href={appUrl('/#coaching')} onClick={() => setOpen(false)}>Coaching tools</a><a href={appUrl('/#contact')} onClick={() => setOpen(false)}>Contact</a><a className="login-link" onClick={()=>setOpen(false)} href={appUrl('/#/login')}><span className="pill-label">Demo login</span><span className="pill-icon"><KitIcon name="arrow"/></span></a><a className="login-link" onClick={()=>setOpen(false)} href={appUrl('/workflows')}><span className="pill-label">Workflows</span><span className="pill-icon"><KitIcon name="arrow"/></span></a></nav></header>;
}
function Footer() { return <footer><a className="wordmark" href={appUrl('/')}><Brand/></a><p>Your sport. Your academy. Your system.</p><div><a href={appUrl('/tournaments')}>Tournaments</a><a href={appUrl('/inquiry')}>Enquire</a><a href={appUrl('/privacy')}>Privacy</a><a href={appUrl('/#/login')}>Demo login</a><a href={appUrl('/academy')}>Academy demo</a><a href={appUrl('/workflows')}>Workflows</a></div><span className="footer-place">Multi-sport academy software</span></footer>; }
function Landing() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('.reveal').forEach(el => gsap.from(el, { y: 28, opacity: 0, duration: .75, scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
        gsap.from('.software-feature', { y: 60, opacity: 0, rotation: 2, stagger: .13, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.software-feature-strip', start: 'top 86%', once: true } });
        gsap.from('.process-line', { scaleX: 0, transformOrigin: 'left', duration: 1.2, scrollTrigger: { trigger: '.steps', start: 'top 85%', once: true } });
        gsap.from('.system-node', { y: 25, opacity: 0, stagger: .2, duration: .8, scrollTrigger: { trigger: '.system-diagram', start: 'top 85%', once: true } });
      }, root);
      return () => context.revert();
    });
    return () => mm.revert();
  }, []);
  return <div ref={root}>
    <TournamentHome workflowUrl={appUrl('/workflows')} tournamentsUrl={appUrl('/tournaments')}/>
    <section className="section software-experience software-stage" id="software-experience"><div className="software-stage-head"><div><div className="eyebrow">THE ACCADON SOFTWARE EXPERIENCE</div><h2>Run the academy.<br/><em>Not the paperwork.</em></h2></div><p>Less chasing details.<br/>More time on court.</p></div><div className="software-feature-strip">{[{n:'01',icon:'list',title:'Attendance, without the chase.',tag:'BATCHES + SESSIONS',marks:['Foundation / 4:00 PM','Development / 5:30 PM'],state:'Session roster'},{n:'02',icon:'grid',title:'Every family. One connection.',tag:'PARENTS + PLAYERS',marks:['One parent profile','Separate player journeys'],state:'Linked, not mixed'},{n:'03',icon:'target',title:'See the progress. Coach better.',tag:'COURSES + ASSESSMENT',marks:['Foundation → Development','Coach-led reviews'],state:'Progress by sport'},{n:'04',icon:'arrow',title:'Your fees. Your control.',tag:'ACADEMY PAYMENTS',marks:['Your payment gateway','Your academy receives fees'],state:'No shared wallet'}].map(f=><a className="software-feature" href="#product-preview" key={f.n}><div className="software-feature-top"><span>{f.n} / {f.tag}</span><KitIcon name={f.icon}/></div><h3>{f.title}</h3><div className="software-mini-ui">{f.marks.map((m,i)=><div key={m}><i className={i?'':'active'}/><span>{m}</span><KitIcon name="arrow"/></div>)}<span className="software-feature-state">{f.state}</span></div><div className="software-feature-bottom">Explore the workspace <KitIcon name="arrow"/></div></a>)}</div><div className="software-stage-footer"><span>FOUR PARTS. ONE ACADEMY WORKSPACE.</span><a className="button primary" href={appUrl('/workflows')}>Try the role workflows <KitIcon name="arrow"/></a></div><p className="software-stage-note">Interactive design preview. Fictional data. Planned paid coaching workspace; pricing not announced. No live accounts or payments.</p></section>
    <DashboardPreviews/>
    <section className="section system" id="coaching"><div className="system-copy reveal"><div className="eyebrow">YOUR DAILY ACADEMY WORKSPACE</div><h2>More time coaching.<br/><em>Less chasing details.</em></h2><p>A paid workspace for the day-to-day work of your academy, across the sports you teach.</p><ul><li><span><KitIcon name="arrow"/></span><div><h3>Batches, sessions & attendance</h3><p>Allocate players, plan sessions and keep attendance connected.</p></div></li><li><span><KitIcon name="arrow"/></span><div><h3>Players & parents, together</h3><p>Individual profiles and one parent login for linked children.</p></div></li><li><span><KitIcon name="arrow"/></span><div><h3>Courses & coach-led assessment</h3><p>Build courses with levels and lessons. Configure assessment to suit your sport.</p></div></li><li><span><KitIcon name="arrow"/></span><div><h3>Your fees. Your payment gateway.</h3><p>Connect your academy's own gateway. Academy fee payments go to your academy, not a shared platform wallet.</p></div></li></ul></div><div className="system-diagram reveal" aria-label="Concept: academy admin connects coaching, families and academy payments"><div className="diagram-label">YOUR ACADEMY WORKSPACE <span><KitIcon name="arrow"/></span></div><div className="system-node"><span className="node-icon"><KitIcon name="list"/></span><div><small>YOUR ADMIN, IN CONTROL</small><h3>Sports, batches & coaches</h3></div><span>01</span></div><div className="node-connector"><KitIcon name="down"/></div><div className="system-node"><span className="node-icon"><KitIcon name="competition"/></span><div><small>YOUR COACHING STRUCTURE</small><h3>Courses & player progress</h3></div><span>02</span></div><div className="node-connector"><KitIcon name="down"/></div><div className="system-node"><span className="node-icon"><KitIcon name="arrow"/></span><div><small>YOUR ACADEMY RELATIONSHIPS</small><h3>Parents, players & fees</h3></div><span>03</span></div><p className="diagram-note">Planned workflow illustration, not live academy data.</p></div></section>
    <section className="section process" id="how-it-works"><div className="section-heading reveal"><div className="eyebrow">SET UP YOUR ACADEMY</div><h2>Your people. Your process.<br/><em>One academy workspace.</em></h2></div><div className="steps"><div className="process-line"/>{[['01','Set up your academy','Define your academy or sports club and the sports you offer.'],['02','Bring your people together','Organise coaches, player profiles and linked parent accounts.'],['03','Plan your coaching','Connect batches, sessions, attendance and player progress.'],['04','Keep your academy in control','Your admin runs the academy. Your gateway receives your fees.']].map(([n,title,text]) => <article className="step reveal" key={n}><span className="step-number">{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div><p className="small-print">This is the planned start-up journey. Account claiming and upgrades are not available in this build.</p></section>
    <section className="section coaches"><div className="section-heading reveal"><div className="eyebrow">ONE SPORT IS ONLY THE START</div><h2>Built for academies.<br/><em>Not limited to a sport.</em></h2></div><div className="sports-list reveal"><span>Table tennis</span><span>Badminton</span><span>Football</span><span>Cricket</span><span>Multiple sports</span></div><div className="coach-grid"><article className="coach-card reveal"><div className="coach-monogram" aria-hidden="true">ND<span><KitIcon name="arrow"/></span></div><div><h3>From the academy floor</h3><p>Founded by Nishchithh D, a table tennis coach. Built around the work of running an academy, with a multi-sport product vision.</p></div></article><div className="coach-support reveal"><span className="small-orbit" aria-hidden="true"><KitIcon name="target"/></span><h3>Your academy.<br/>Your own workspace.</h3><p>Academy admins manage their own operations.<br/>Platform administration stays separate.</p></div></div></section>
    <section className="section contact" id="contact"><div className="contact-copy reveal"><div className="eyebrow">LET'S TALK ABOUT YOUR ACADEMY</div><h2>Your sport.<br/>Your ambitions.<br/><em>Let's build around them.</em></h2><p>For academy owners, sports clubs, managers and coaches. Tell us what you run and what you want to manage better.</p><span className="location-label"><span className="status-dot"/> Multi-sport. Academy-first.</span><a className="secondary-link" href={appUrl('/inquiry')}>Open the full inquiry form ↗</a><div className="onboarding-note"><p>Tell us about your academy. This form does not create an account, reserve a plan or start a paid subscription.</p></div></div><div className="form-panel reveal"><h3>Bring your academy to Accadon</h3><InquiryForm/></div></section>
  </div>;
}

function SimplePage({ children }: { children: React.ReactNode }) { return <main className="simple-page"><a className="secondary-link" href={appUrl('/')}>← Back to Accadon</a>{children}</main>; }
function App() {
  const [,refresh] = useState(0);
  useEffect(()=>{const onHash=()=>refresh(v=>v+1);window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash)},[]);
  const prefix = appBase.replace(/\/$/,'');
  const path = location.hash.startsWith('#/') ? location.hash.slice(1).split('?')[0] : location.pathname;
  const route = (prefix && path.startsWith(prefix+'/') ? path.slice(prefix.length) : path === prefix ? '/' : path).replace(/\/$/,'') || '/';
  const interest = new URLSearchParams(location.hash.startsWith('#/') ? location.hash.split('?')[1] || '' : location.search).get('interest');
  const validInterest = ['tournaments','coaching','both'].includes(interest || '') ? interest! : 'tournaments';
  let content;
  if (route === '/') content = <main id="main"><Landing/></main>;
  else if (route === '/design-system') content = <DesignSystem/>;
  else if (route === '/academy') content = <AcademyWorkspace/>;
  else if (route === '/organizer/settings') content = <OrganizerSettings/>;
  else if (route === '/organizer') content = <OrganizerBuilder/>;
  else if (route === '/tournaments') content = <TournamentsPage workflowUrl={appUrl('/workflows')}/>;
  else if (route === '/inquiry') content = <SimplePage><div className="eyebrow">LET'S TALK ABOUT YOUR ACADEMY</div><h1>Start with<br/><em>a conversation.</em></h1><p>Tell us about your academy or sports club, the sports you offer and what you need from Accadon.</p><div className="form-panel"><h2>Academy software inquiry</h2><InquiryForm interest={validInterest} full/></div></SimplePage>;
  else if (route === '/privacy') content = <SimplePage><div className="eyebrow">DRAFT NOTICE / OWNER REVIEW REQUIRED</div><h1>Your inquiry<br/><em>details.</em></h1><p>This notice describes the phase-one inquiry form. It needs owner review before accepting real inquiries.</p><h2>What the form collects</h2><p>Your name, mobile number, academy or club name, sport or sports, city, role, software interest, consent and any optional email or message.</p><h2>Why it is collected</h2><p>To save your inquiry for Accadon to review and contact you about the academy software. An inquiry does not create an academy account, enroll a player or process payment. Do not include medical details, identity documents or payment information.</p><h2>Where it goes</h2><p>Inquiry details and a record of contact consent are stored in the configured Postgres database. This form does not send automatic email or WhatsApp messages. The website host handles network requests as part of serving this website.</p><h2>Before public launch</h2><p>The owner must approve this notice, configure a contact for privacy requests and decide retention and deletion practices. Those details are not yet configured. The site must not accept real personal information until that review is complete.</p></SimplePage>;
  else if (route==='/workflows') content = <WorkflowReview/>;
  else if (['/app','/app/login'].includes(route)) content = <LiveWorkspace/>;
  else if (route==='/super-admin') content = <SuperAdminWorkspace/>;
  else if (route==='/live-preview') content = <LiveWorkspace/>;
  else if (['/login','/member','/admin','/coach'].includes(route)) content = <DemoAccess/>;
  else if (['/onboarding'].includes(route)) content = <SimplePage><div className="eyebrow">COMING IN THE NEXT BUILD PHASE</div><h1>{route === '/onboarding' ? 'Onboarding' : 'Member & staff access'}<br/><em>is not open yet.</em></h1><p>{route === '/onboarding' ? 'The secure onboarding and review workflow is not available in this phase. No enrollment details have been collected here.' : 'Secure login and private academy tools are still being built. No demo login or shared access code is enabled.'}</p><a className="button primary" href={appUrl('/inquiry')}>Enquire about Accadon ↗</a></SimplePage>;
  else content = <SimplePage><h1>Page not found.</h1><p>Use the link above to return to Accadon.</p></SimplePage>;
  return <><a href="#main" className="skip-link">Skip to content</a><Header kit={route==='/design-system'}/>{route === '/' ? content : <div>{content}</div>}<Footer/></>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
