import { useRef, useState } from 'react';
export function InquiryForm({ interest = 'tournaments', full = false }: { interest?: string; full?: boolean }) {
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
      const response = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key.current }, body: JSON.stringify({ name: values.name, phone: values.phone, email: values.email || '', interest: values.interest, city: values.city, academyName: values.academyName, sport: values.sport, role: values.role, message: values.message || '', consent: values.consent === 'on', website: values.website || '' }) });
      const result = await response.json();
      if (!response.ok || result.saved !== true) { setError(result.error || 'We could not confirm your inquiry was saved. Please retry.'); setFields(result.fields || {}); }
      else setSaved(true);
    } catch { setError('Could not reach Accadon. Your details are still here. Check your connection and retry.'); }
    finally { setBusy(false); }
  }
  const fieldError = (name: string) => fields[name] ? <span className="field-error" id={`${name}-error`}>{fields[name][0]}</span> : null;
  if (saved) return <div className="saved" role="status"><span className="success-mark">✓</span><h3>Inquiry received.</h3><p>Your details have been saved for Accadon to review. This does not create an academy account or start a paid subscription.</p><button className="text-link" onClick={() => { setSaved(false); key.current = null; hasSent.current = false; }}>Send another inquiry ↗</button></div>;
  return <form onSubmit={submit} onChange={change} className="inquiry-form" aria-label="Academy software inquiry">
    <div className="form-grid">
      <label>Your name<input required name="name" autoComplete="name" minLength={2} maxLength={100} aria-invalid={!!fields.name} aria-describedby={fields.name ? 'name-error' : undefined}/>{fieldError('name')}</label>
      <label>Mobile number<input required name="phone" type="tel" autoComplete="tel" placeholder="10-digit Indian mobile" maxLength={20} aria-invalid={!!fields.phone} aria-describedby={fields.phone ? 'phone-error' : undefined}/>{fieldError('phone')}</label>
      <label>Academy / club name<input name="academyName" required minLength={2} maxLength={160} aria-invalid={!!fields.academyName}/>{fieldError('academyName')}</label>
      <label>Sport or sports<input name="sport" required minLength={2} maxLength={120} placeholder="e.g. badminton, football, table tennis" aria-invalid={!!fields.sport}/>{fieldError('sport')}</label>
      <label>City<input name="city" required minLength={2} maxLength={120} aria-invalid={!!fields.city}/>{fieldError('city')}</label>
      <label>Your role<input name="role" required minLength={2} maxLength={80} placeholder="Owner, manager, coach…" aria-invalid={!!fields.role}/>{fieldError('role')}</label>
    </div>
    <label>What do you need?<select name="interest" value={program} onChange={e => setProgram(e.target.value)}><option value="tournaments">Free tournament pages</option><option value="coaching">Academy coaching management</option><option value="both">Both</option></select></label>
    {full && <label>Email <span>(optional)</span><input name="email" type="email" autoComplete="email" maxLength={254}/></label>}
    <label>Anything else? <span>(optional)</span><textarea name="message" rows={3} maxLength={2000} placeholder="Tell us what you want to manage."/></label>
    <div className="honey" aria-hidden="true"><label>Leave blank<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    <label className="consent"><input name="consent" type="checkbox" required/><span>I agree that Accadon may use these details to contact me about this inquiry. <a href="/privacy">How we use your details</a></span></label>
    {error && <div className="form-error" role="alert">{error}</div>}
    <button className="button primary submit" type="submit" disabled={busy}>{busy ? 'Saving your inquiry…' : 'Send inquiry'}<span aria-hidden="true">↗</span></button>
    <p className="form-note">An inquiry is not an account signup or paid subscription.</p>
  </form>;
}
