import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Court } from './Court';
import { InquiryForm } from './InquiryForm';
import './styles.css';
gsap.registerPlugin(ScrollTrigger);
const programs = [
  { id: 'communities', number: '01', icon: '▦', title: 'Apartment communities', text: 'Structured coaching, close to home.', detail: 'A regular practice rhythm for the place you call home.' },
  { id: 'schools', number: '02', icon: '◫', title: 'Schools', text: 'Organized table tennis programs for students.', detail: 'Bring a clear coaching plan to the school day.' },
  { id: 'academies', number: '03', icon: '⌁', title: 'Academies', text: 'Planned sessions and individual progress tracking.', detail: 'Give every practice a purpose, and every player a plan.' },
  { id: 'one-to-one', number: '04', icon: '↗', title: 'One-to-one coaching', text: 'Focused practice built around the player.', detail: 'Time and attention for individual coaching needs.' },
];
function Header() {
  const [open, setOpen] = useState(false);
  return <header className="header"><a className="wordmark" href="/" aria-label="Accadon home"><span className="brand-symbol">A<span>•</span></span>accadon</a><button className="menu-toggle" aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'} <span>{open ? '−' : '+'}</span></button><nav id="navigation" className={open ? 'open' : ''} aria-label="Main"><a href="/#programs" onClick={() => setOpen(false)}>Programs</a><a href="/#how-it-works" onClick={() => setOpen(false)}>How it works</a><a href="/#coaches" onClick={() => setOpen(false)}>Coaches</a><a href="/#contact" onClick={() => setOpen(false)}>Contact</a><a className="login-link" href="/login">Member login <span>↗</span></a></nav></header>;
}
function Footer() { return <footer><a className="wordmark" href="/">accadon</a><p>Talent needs structure.</p><div><a href="/#programs">Programs</a><a href="/inquiry">Enquire</a><a href="/privacy">Privacy</a><a href="/login">Member login</a></div><span className="footer-place">Table tennis coaching · Bangalore</span></footer>; }
function Landing() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.from('.hero-copy > *', { y: 32, opacity: 0, stagger: .11, duration: .9, ease: 'power3.out' });
        gsap.from('.court-art', { opacity: 0, y: 28, duration: 1.4, ease: 'power2.out' });
        gsap.to('.court-ball', { x: 90, y: 52, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut', scrollTrigger: { trigger: '.hero', toggleActions: 'play pause resume pause' } });
        ScrollTrigger.matchMedia({ '(min-width: 800px)': () => {
          gsap.to('.court-table', { y: -58, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
          gsap.to('.court-paddle', { y: -110, rotation: -8, transformOrigin: '760px 270px', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
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
    <section className="hero" aria-labelledby="hero-title"><div className="hero-copy"><div className="eyebrow"><span className="status-dot"/> TABLE TENNIS. WITH A PLAN.</div><h1 id="hero-title">Talent needs<br/><em>structure.</em></h1><p className="hero-description">Structured table tennis coaching across Bangalore communities, schools, academies and one-to-one sessions.</p><div className="hero-actions"><a className="button primary" href="/inquiry">Enquire about coaching <span>↗</span></a><a className="secondary-link" href="#programs">Explore our programs <span>↓</span></a></div><div className="hero-bottom"><span className="tiny-line"/> A CLEAR PLAN. EVERY TIME YOU PLAY.</div></div><div className="hero-scene"><span className="scene-label">THE PRACTICE STARTS HERE</span><Court/><div className="scene-caption"><span>01 / THE COURT</span><span>BANGALORE, INDIA</span></div></div><a className="scroll-cue" href="#programs">SCROLL TO EXPLORE <span>↓</span></a></section>
    <div className="manifesto"><span>Less guesswork.</span><span>More purposeful practice.</span><span className="manifesto-ball" aria-hidden="true">●</span></div>
    <section className="section programs" id="programs"><div className="section-heading reveal"><div className="eyebrow">01 / WHO WE SERVE</div><div className="heading-row"><h2>A place for<br/><em>every kind of player.</em></h2><p>Different settings. The same belief: good coaching begins with a clear plan.</p></div></div><div className="program-grid">{programs.map(p => <a key={p.id} className="program-card" href={`/inquiry?interest=${p.id}`}><div className="card-top"><span>{p.number}</span><span className="program-icon" aria-hidden="true">{p.icon}</span></div><h3>{p.title}</h3><p>{p.text}</p><div className="card-bottom"><span>Explore coaching</span><span className="circle-arrow">↗</span></div></a>)}</div><p className="small-print">Tell us your area. We will discuss a suitable program and current availability.</p></section>
    <section className="section process" id="how-it-works"><div className="section-heading reveal"><div className="eyebrow">02 / HOW IT WORKS</div><h2>From first hello<br/>to <em>purposeful practice.</em></h2></div><div className="steps"><div className="process-line"/>{[['01','Enquire','Tell us who you are and what you are looking for.'],['02','Find the right program','Discuss your area, needs and available options.'],['03','Train with a plan','Work through planned, coach-led sessions.'],['04','Track progress','Build a record of attendance and coach-led assessments.']].map(([n,title,text]) => <article className="step reveal" key={n}><span className="step-number">{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="section system"><div className="system-copy reveal"><div className="eyebrow">03 / THE ACCADON APPROACH</div><h2>Good coaching.<br/><em>Backed by structure.</em></h2><p>The work on the table matters. So does the plan behind it.</p><ul><li><span>↗</span><div><h3>Practice with purpose</h3><p>Written session plans give training a clear focus.</p></div></li><li><span>↗</span><div><h3>Keep the record clear</h3><p>Individual profiles and attendance keep practice connected.</p></div></li><li><span>↗</span><div><h3>Progress, led by a coach</h3><p>Coach-led assessment gives the next session direction.</p></div></li></ul></div><div className="system-diagram reveal" aria-label="Concept: a session plan connects to practice, attendance and coach review"><div className="diagram-label">THE COACHING LOOP <span>↗</span></div><div className="system-node"><span className="node-icon">≡</span><div><small>BEFORE THE SESSION</small><h3>A clear plan</h3></div><span>01</span></div><div className="node-connector">↓</div><div className="system-node"><span className="node-icon">⌁</span><div><small>AT THE TABLE</small><h3>Practice & attendance</h3></div><span>02</span></div><div className="node-connector">↓</div><div className="system-node"><span className="node-icon">↗</span><div><small>LOOKING AHEAD</small><h3>Coach review</h3></div><span>03</span></div><p className="diagram-note">Concept illustration, not player data.</p></div></section>
    <section className="section coaches" id="coaches"><div className="section-heading reveal"><div className="eyebrow">04 / THE PEOPLE BEHIND THE PLAN</div><h2>On your side.<br/><em>At the table.</em></h2></div><div className="coach-grid"><article className="coach-card reveal"><div className="coach-monogram" aria-hidden="true">ND<span>↗</span></div><div><h3>Nishchithh D</h3><p>Founder & Table Tennis Coach</p></div></article><div className="coach-support reveal"><span className="small-orbit" aria-hidden="true">◎</span><h3>Supported by an<br/>ITTF Level 2 coach.</h3><p>Structure in the program.<br/>Attention in the practice.</p></div></div></section>
    <section className="section contact" id="contact"><div className="contact-copy reveal"><div className="eyebrow">05 / LET'S TALK TABLE TENNIS</div><h2>Your next session<br/>starts with<br/><em>a conversation.</em></h2><p>For your community, school, academy or yourself. Tell us what you have in mind.</p><span className="location-label"><span className="status-dot"/> Coaching in Bangalore</span><a className="secondary-link" href="/inquiry">Open the full inquiry form ↗</a><div className="onboarding-note"><a href="/onboarding">Already discussed your program? Start onboarding ↗</a><p>Submission does not confirm a place or payment.</p></div></div><div className="form-panel reveal"><h3>Enquire about coaching</h3><InquiryForm/></div></section>
  </div>;
}
function SimplePage({ children }: { children: React.ReactNode }) { return <main className="simple-page"><a className="secondary-link" href="/">← Back to Accadon</a>{children}</main>; }
function App() {
  const route = location.pathname;
  const interest = new URLSearchParams(location.search).get('interest');
  const validInterest = programs.some(p => p.id === interest) ? interest! : 'communities';
  let content;
  if (route === '/') content = <main id="main"><Landing/></main>;
  else if (route === '/inquiry') content = <SimplePage><div className="eyebrow">LET'S FIND YOUR PROGRAM</div><h1>Start with<br/><em>a conversation.</em></h1><p>Tell us about your coaching needs in Bangalore. Availability and the right program will be discussed with you.</p><div className="form-panel"><h2>Coaching inquiry</h2><InquiryForm interest={validInterest} full/></div></SimplePage>;
  else if (route === '/privacy') content = <SimplePage><div className="eyebrow">DRAFT NOTICE / OWNER REVIEW REQUIRED</div><h1>Your inquiry<br/><em>details.</em></h1><p>This notice describes the phase-one inquiry form. It needs owner review before accepting real inquiries.</p><h2>What the form collects</h2><p>Your name, mobile number, coaching interest, locality, consent and any optional details you choose to provide, including your message, email, learner name or age group.</p><h2>Why it is collected</h2><p>To save your inquiry for Accadon to review and contact you about suitable coaching. An inquiry does not enroll a player or process payment. Do not include medical details, identity documents or payment information.</p><h2>Where it goes</h2><p>Inquiry details and a record of contact consent are stored in the configured Postgres database. This form does not send automatic email or WhatsApp messages. The website host handles network requests as part of serving this website.</p><h2>Before public launch</h2><p>The owner must approve this notice, configure a contact for privacy requests and decide retention and deletion practices. Those details are not yet configured. The site must not accept real personal information until that review is complete.</p></SimplePage>;
  else if (['/login','/member','/admin','/coach','/onboarding'].includes(route)) content = <SimplePage><div className="eyebrow">COMING IN THE NEXT BUILD PHASE</div><h1>{route === '/onboarding' ? 'Onboarding' : 'Member & staff access'}<br/><em>is not open yet.</em></h1><p>{route === '/onboarding' ? 'The secure onboarding and review workflow is not available in this phase. No enrollment details have been collected here.' : 'Secure login and private academy tools are still being built. No demo login or shared access code is enabled.'}</p><a className="button primary" href="/inquiry">Enquire about coaching ↗</a></SimplePage>;
  else content = <SimplePage><h1>Page not found.</h1><p>Use the link above to return to Accadon.</p></SimplePage>;
  return <><a href="#main" className="skip-link">Skip to content</a><Header/>{route === '/' ? content : <div id="main">{content}</div>}<Footer/></>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
