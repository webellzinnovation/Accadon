import { useRef, useState } from 'react';
export function InquiryForm({ interest = 'communities', full = false }: { interest?: string; full?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState<Record<string, string[]>>({});
  const [program, setProgram] = useState(interest);
  const key = useRef<string | null>(null);
  const hasSent = useRef(false);
  function change() { if (hasSent.current) { key.current = null; hasSent.current = false; } }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError(''); setFields({});
    const values = Object.fromEntries(new FormData(event.currentTarget));
    key.current ??= crypto.randomUUID(); hasSent.current = true;
    try {
      const response = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key.current }, body: JSON.stringify({ name: values.name, phone: values.phone, email: values.email || '', interest: values.interest, locality: values.locality, institution: values.institution || '', learnerName: values.learnerName || '', ageGroup: values.ageGroup || '', message: values.message || '', consent: values.consent === 'on', website: values.website || '' }) });
      const result = await response.json();
      if (!response.ok || result.saved !== true) { setError(result.error || 'We could not confirm your inquiry was saved. Please retry.'); setFields(result.fields || {}); }
      else setSaved(true);
    } catch { setError('Could not reach Accadon. Your details are still here. Check your connection and retry.'); }
    finally { setBusy(false); }
  }
  const fieldError = (name: string) => fields[name] ? <span className="field-error" id={`${name}-error`}>{fields[name][0]}</span> : null;
  if (saved) return <div className="saved" role="status"><span className="success-mark">✓</span><h3>Inquiry received.</h3><p>Your details have been saved for Accadon to review. This does not confirm a coaching place or payment.</p><button className="text-link" onClick={() => { setSaved(false); key.current = null; hasSent.current = false; }}>Send another inquiry ↗</button></div>;
  return <form onSubmit={submit} onChange={change} className="inquiry-form" aria-label="Coaching inquiry">
    <div className="form-grid">
      <label>Your name<input required name="name" autoComplete="name" minLength={2} maxLength={100} aria-invalid={!!fields.name} aria-describedby={fields.name ? 'name-error' : undefined}/>{fieldError('name')}</label>
      <label>Mobile number<input required name="phone" type="tel" autoComplete="tel" placeholder="10-digit Indian mobile" maxLength={20} aria-invalid={!!fields.phone} aria-describedby={fields.phone ? 'phone-error' : undefined}/>{fieldError('phone')}</label>
      <label>Interested in<select name="interest" value={program} onChange={e => setProgram(e.target.value)}><option value="communities">Apartment communities</option><option value="schools">Schools</option><option value="academies">Academies</option><option value="one-to-one">One-to-one coaching</option></select></label>
      <label>Area in Bangalore<input name="locality" required minLength={2} maxLength={120} placeholder="Your locality" aria-invalid={!!fields.locality} aria-describedby={fields.locality ? 'locality-error' : undefined}/>{fieldError('locality')}</label>
    </div>
    {program !== 'one-to-one' && <label>Community, school or academy name<input name="institution" required maxLength={160} aria-invalid={!!fields.institution} aria-describedby={fields.institution ? 'institution-error' : undefined}/>{fieldError('institution')}</label>}
    {full && <><div className="form-grid"><label>Learner name <span>(optional)</span><input name="learnerName" maxLength={100}/></label><label>Age group <span>(optional)</span><select name="ageGroup"><option value="">Prefer not to say</option><option value="under-12">Under 12</option><option value="12-17">12-17</option><option value="adult">Adult</option></select></label></div><label>Email <span>(optional)</span><input name="email" type="email" autoComplete="email" maxLength={254}/></label></>}
    <label>What are you looking for? <span>(optional)</span><textarea name="message" rows={3} maxLength={2000} placeholder="Tell us a little about your coaching needs."/></label>
    <div className="honey" aria-hidden="true"><label>Leave blank<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    <label className="consent"><input name="consent" type="checkbox" required/><span>I agree that Accadon may use these details to contact me about this inquiry. <a href="/privacy">How we use your details</a></span></label>
    {error && <div className="form-error" role="alert">{error}</div>}
    <button className="button primary submit" type="submit" disabled={busy}>{busy ? 'Saving your inquiry…' : 'Send inquiry'}<span aria-hidden="true">↗</span></button>
    <p className="form-note">An inquiry starts a conversation. It does not reserve a place.</p>
  </form>;
}
