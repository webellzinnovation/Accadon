import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SportsScene } from './SportsScene';
import { DashboardPreviews } from './DashboardPreviews';
import { InquiryForm } from './InquiryForm';
import './styles.css';
import { WorkflowReview } from './WorkflowReview';
import { LiveWorkspace } from './LiveWorkspace';
import { DemoAccess } from './DemoAccess';
gsap.registerPlugin(ScrollTrigger);
const appBase = import.meta.env.BASE_URL;
const appUrl = (path:string) => {
  const relative = path.replace(/^\//,'');
  return appBase + (appBase !== '/' && relative && !relative.startsWith('#') ? '#/' : '') + relative;
};
const programs = [
  { id: 'tournaments', number: '01', icon: '⌁', title: 'Your tournament page', text: 'An academy-branded home for your events.' },
  { id: 'tournaments', number: '02', icon: '◫', title: 'Registration & draws', text: 'Bring entries, brackets and event information together.' },
  { id: 'tournaments', number: '03', icon: '↗', title: 'Live match scoring', text: 'Keep the tournament moving, match by match.' },
  { id: 'tournaments', number: '04', icon: '◎', title: 'A way into Accadon', text: 'Every free event page introduces the academy platform.' },
];
function Header() {
  const [open, setOpen] = useState(false);
  return <header className="header"><a className="wordmark" href={appUrl('/')} aria-label="Accadon home"><span className="brand-symbol">A<span>•</span></span>accadon</a><button className="menu-toggle" aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'} <span>{open ? '−' : '+'}</span></button><nav id="navigation" className={open ? 'open' : ''} aria-label="Main"><a href={appUrl('/#tournaments')} onClick={() => setOpen(false)}>Free tournaments</a><a href={appUrl('/#how-it-works')} onClick={() => setOpen(false)}>How it works</a><a href={appUrl('/#coaching')} onClick={() => setOpen(false)}>Coaching tools</a><a href={appUrl('/#contact')} onClick={() => setOpen(false)}>Contact</a><a className="login-link" onClick={()=>setOpen(false)} href={appUrl('/#/login')}>Demo login <span>↗</span></a><a className="login-link" onClick={()=>setOpen(false)} href={appUrl('/workflows')}>Workflows <span>↗</span></a></nav></header>;
}
function Footer() { return <footer><a className="wordmark" href={appUrl('/')}>accadon</a><p>Your sport. Your academy. Your system.</p><div><a href={appUrl('/#tournaments')}>Free tournaments</a><a href={appUrl('/inquiry')}>Enquire</a><a href={appUrl('/privacy')}>Privacy</a><a href={appUrl('/#/login')}>Demo login</a><a href={appUrl('/workflows')}>Workflows</a></div><span className="footer-place">Multi-sport academy software</span></footer>; }
function Landing() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.from('.hero-copy > *', { y: 32, opacity: 0, stagger: .11, duration: .9, ease: 'power3.out' });
        gsap.from('.sports-scene', { opacity: 0, y: 28, duration: 1.4, ease: 'power2.out' });
        gsap.to('.court-ball', { x: 30, y: 15, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut', scrollTrigger: { trigger: '.hero', toggleActions: 'play pause resume pause' } });
        ScrollTrigger.matchMedia({ '(min-width: 800px)': () => {
          gsap.to('.sport-tile:nth-child(odd)', { y: -22, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
          gsap.to('.sport-tile:nth-child(even)', { y: 15, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
          gsap.to('.court-table', { y: -16, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
          gsap.to('.court-paddle', { y: -25, rotation: -8, transformOrigin: '760px 270px', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
          gsap.to('.hero-copy', { y: 45, opacity: .4, scrollTrigger: { trigger: '.hero', start: 'center top', end: 'bottom top', scrub: true } });
        } });
        gsap.utils.toArray<HTMLElement>('.reveal').forEach(el => gsap.from(el, { y: 28, opacity: 0, duration: .75, scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
        gsap.from('.program-card', { y: 40, opacity: 0, stagger: .12, duration: .8, scrollTrigger: { trigger: '.program-grid', start: 'top 88%', once: true } });
        gsap.from('.process-line', { scaleX: 0, transformOrigin: 'left', duration: 1.2, scrollTrigger: { trigger: '.steps', start: 'top 85%', once: true } });
        gsap.from('.system-node', { y: 25, opacity: 0, stagger: .2, duration: .8, scrollTrigger: { trigger: '.system-diagram', start: 'top 85%', once: true } });
      }, root);
      return () => context.revert();
    });
    return () => mm.revert();
  }, []);
  return <div ref={root}>
    <section className="hero" aria-labelledby="hero-title"><div className="hero-copy"><div className="eyebrow"><span className="status-dot"/> SOFTWARE FOR EVERY SPORT</div><h1 id="hero-title">Your academy.<br/><em>In your hands.</em></h1><p className="hero-description">Run your academy on Accadon. Start with free tournament pages. Bring coaching, players and parents together when you are ready.</p><div className="hero-actions"><a className="button primary" href={appUrl('/inquiry?interest=tournaments')}>Explore free tournaments <span>↗</span></a><a className="secondary-link" href="#coaching">See the coaching tools <span>↓</span></a></div><div className="hero-bottom"><span className="tiny-line"/> ONE ACADEMY. MANY SPORTS. ONE SYSTEM.</div></div><div className="hero-scene"><span className="scene-label">BUILT AROUND THE WAY YOU PLAY</span><SportsScene/></div><a className="scroll-cue" href="#tournaments">EXPLORE THE PLATFORM <span>↓</span></a></section>
    <div className="manifesto"><span>Tournaments free forever.</span><span>Coaching management when you're ready.</span><span className="manifesto-ball" aria-hidden="true">●</span></div>
    <div className="build-notice">Platform in development. These are the planned product features. Tournament creation and academy accounts are not open yet.</div>
    <section className="section programs" id="tournaments"><div className="section-heading reveal"><div className="eyebrow">01 / YOUR FREE WAY IN</div><div className="heading-row"><h2>Make the tournament<br/><em>yours.</em></h2><p>Your academy. Your event. A public tournament page that brings your sporting community together.</p></div></div><div className="program-grid">{programs.map((p,i) => <a key={i} className="program-card" href={appUrl('/inquiry?interest=tournaments')}><div className="card-top"><span>{p.number}</span><span className="program-icon" aria-hidden="true">{p.icon}</span></div><h3>{p.title}</h3><p>{p.text}</p><div className="card-bottom"><span>Explore tournaments</span><span className="circle-arrow">↗</span></div></a>)}</div><p className="small-print">Free tournament tools are the entry point. Coaching management is a separate paid subscription. Pricing has not been announced.</p></section>
    <section className="section system" id="coaching"><div className="system-copy reveal"><div className="eyebrow">02 / THE COACHING SIDE</div><h2>More time coaching.<br/><em>Less chasing details.</em></h2><p>A paid workspace for the day-to-day work of your academy, across the sports you teach.</p><ul><li><span>↗</span><div><h3>Batches, sessions & attendance</h3><p>Allocate players, plan sessions and keep attendance connected.</p></div></li><li><span>↗</span><div><h3>Players & parents, together</h3><p>Individual profiles and one parent login for linked children.</p></div></li><li><span>↗</span><div><h3>Courses & coach-led assessment</h3><p>Build courses with levels and lessons. Configure assessment to suit your sport.</p></div></li><li><span>↗</span><div><h3>Your fees. Your payment gateway.</h3><p>Connect your academy's own gateway. Academy fee payments go to your academy, not a shared platform wallet.</p></div></li></ul></div><div className="system-diagram reveal" aria-label="Concept: academy admin connects coaching, families and academy payments"><div className="diagram-label">YOUR ACADEMY WORKSPACE <span>↗</span></div><div className="system-node"><span className="node-icon">≡</span><div><small>YOUR ADMIN, IN CONTROL</small><h3>Sports, batches & coaches</h3></div><span>01</span></div><div className="node-connector">↓</div><div className="system-node"><span className="node-icon">⌁</span><div><small>YOUR COACHING STRUCTURE</small><h3>Courses & player progress</h3></div><span>02</span></div><div className="node-connector">↓</div><div className="system-node"><span className="node-icon">↗</span><div><small>YOUR ACADEMY RELATIONSHIPS</small><h3>Parents, players & fees</h3></div><span>03</span></div><p className="diagram-note">Planned workflow illustration, not live academy data.</p></div></section>
    <DashboardPreviews/>
    <section className="section process" id="how-it-works"><div className="section-heading reveal"><div className="eyebrow">03 / START SIMPLE. GROW FROM THERE.</div><h2>Start with an event.<br/><em>Build your academy system.</em></h2></div><div className="steps"><div className="process-line"/>{[['01','Claim your academy page','Set up your academy or sports club and the sports you offer.'],['02','Run a tournament free','Bring players together on your own public tournament page.'],['03','Upgrade when you are ready','Add coaching management with a paid academy subscription.'],['04','Keep your academy in control','Your admin runs the academy. Your gateway receives your fees.']].map(([n,title,text]) => <article className="step reveal" key={n}><span className="step-number">{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div><p className="small-print">This is the planned start-up journey. Account claiming and upgrades are not available in this build.</p></section>
    <section className="section coaches"><div className="section-heading reveal"><div className="eyebrow">04 / ONE SPORT IS ONLY THE START</div><h2>Built for academies.<br/><em>Not limited to a sport.</em></h2></div><div className="sports-list reveal"><span>Table tennis</span><span>Badminton</span><span>Football</span><span>Cricket</span><span>Multiple sports</span></div><div className="coach-grid"><article className="coach-card reveal"><div className="coach-monogram" aria-hidden="true">ND<span>↗</span></div><div><h3>From the academy floor</h3><p>Founded by Nishchithh D, a table tennis coach. Built around the work of running an academy, with a multi-sport product vision.</p></div></article><div className="coach-support reveal"><span className="small-orbit" aria-hidden="true">◎</span><h3>Your academy.<br/>Your own workspace.</h3><p>Academy admins manage their own operations.<br/>Platform administration stays separate.</p></div></div></section>
    <section className="section contact" id="contact"><div className="contact-copy reveal"><div className="eyebrow">05 / LET'S TALK ABOUT YOUR ACADEMY</div><h2>Your sport.<br/>Your ambitions.<br/><em>Let's build around them.</em></h2><p>For academy owners, sports clubs, managers and coaches. Tell us what you run and what you want to manage better.</p><span className="location-label"><span className="status-dot"/> Multi-sport. Academy-first.</span><a className="secondary-link" href={appUrl('/inquiry')}>Open the full inquiry form ↗</a><div className="onboarding-note"><p>Tell us about your academy. This form does not create an account, reserve a plan or start a paid subscription.</p></div></div><div className="form-panel reveal"><h3>Bring your academy to Accadon</h3><InquiryForm/></div></section>
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
  else if (route === '/inquiry') content = <SimplePage><div className="eyebrow">LET'S TALK ABOUT YOUR ACADEMY</div><h1>Start with<br/><em>a conversation.</em></h1><p>Tell us about your academy or sports club, the sports you offer and what you need from Accadon.</p><div className="form-panel"><h2>Academy software inquiry</h2><InquiryForm interest={validInterest} full/></div></SimplePage>;
  else if (route === '/privacy') content = <SimplePage><div className="eyebrow">DRAFT NOTICE / OWNER REVIEW REQUIRED</div><h1>Your inquiry<br/><em>details.</em></h1><p>This notice describes the phase-one inquiry form. It needs owner review before accepting real inquiries.</p><h2>What the form collects</h2><p>Your name, mobile number, academy or club name, sport or sports, city, role, software interest, consent and any optional email or message.</p><h2>Why it is collected</h2><p>To save your inquiry for Accadon to review and contact you about the academy software. An inquiry does not create an academy account, enroll a player or process payment. Do not include medical details, identity documents or payment information.</p><h2>Where it goes</h2><p>Inquiry details and a record of contact consent are stored in the configured Postgres database. This form does not send automatic email or WhatsApp messages. The website host handles network requests as part of serving this website.</p><h2>Before public launch</h2><p>The owner must approve this notice, configure a contact for privacy requests and decide retention and deletion practices. Those details are not yet configured. The site must not accept real personal information until that review is complete.</p></SimplePage>;
  else if (['/app','/app/login','/workflows'].includes(route)) content = <WorkflowReview/>;
  else if (route==='/live-preview') content = <LiveWorkspace/>;
  else if (['/login','/member','/admin','/coach'].includes(route)) content = <DemoAccess/>;
  else if (['/onboarding'].includes(route)) content = <SimplePage><div className="eyebrow">COMING IN THE NEXT BUILD PHASE</div><h1>{route === '/onboarding' ? 'Onboarding' : 'Member & staff access'}<br/><em>is not open yet.</em></h1><p>{route === '/onboarding' ? 'The secure onboarding and review workflow is not available in this phase. No enrollment details have been collected here.' : 'Secure login and private academy tools are still being built. No demo login or shared access code is enabled.'}</p><a className="button primary" href={appUrl('/inquiry')}>Enquire about Accadon ↗</a></SimplePage>;
  else content = <SimplePage><h1>Page not found.</h1><p>Use the link above to return to Accadon.</p></SimplePage>;
  return <><a href="#main" className="skip-link">Skip to content</a><Header/>{route === '/' ? content : <div>{content}</div>}<Footer/></>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
