import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { inquirySchema } from './validation.js';
import { IdempotencyConflict, type InquiryRepository } from './db.js';
export function createApp(repository?: InquiryRepository) {
  const app = express();
  app.disable('x-powered-by');
  // Deliberately not trusting arbitrary forwarding headers. Configure a trusted proxy at deployment.
  app.use(helmet({ contentSecurityPolicy: { directives: { 'script-src': ["'self'"], 'style-src': ["'self'", "'unsafe-inline'"], 'img-src': ["'self'", 'data:'], 'connect-src': ["'self'"], 'upgrade-insecure-requests': process.env.NODE_ENV === 'production' ? [] : null } } }));
  app.use(express.json({ limit: '16kb' }));
  app.get('/api/health', (_req, res) => res.json({ service: 'accadon', inquiryStorageConfigured: Boolean(repository) }));
  app.use('/api/inquiries', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Too many attempts. Please try again in 15 minutes.' } }));
  app.post('/api/inquiries', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    // This endpoint is same-origin; never enable permissive CORS.
    const origin = req.get('origin');
    const allowedOrigin = process.env.PUBLIC_ORIGIN || (process.env.NODE_ENV !== 'production' ? 'http://127.0.0.1:5173' : undefined);
    if (origin && origin !== `${req.protocol}://${req.get('host')}` && origin !== allowedOrigin) { res.status(403).json({ error: 'Please submit from the Accadon website.' }); return; }
    const key = z.uuid().safeParse(req.get('Idempotency-Key'));
    if (!key.success) { res.status(400).json({ error: 'Invalid submission identifier. Refresh and try again.' }); return; }
    const parsed = inquirySchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ error: 'Please check the highlighted fields.', fields: z.flattenError(parsed.error).fieldErrors }); return; }
    if (parsed.data.website) { res.status(422).json({ error: 'Submission could not be accepted.' }); return; }
    if (!repository) { res.status(503).json({ error: 'Inquiries are not connected yet. Your details have not been saved. Please try again later.' }); return; }
    try {
      const saved = await repository.save(parsed.data, key.data);
      res.status(saved.duplicate ? 200 : 201).json({ id: saved.id, saved: true });
    } catch (error) {
      if (error instanceof IdempotencyConflict) { res.status(409).json({ error: 'This submission changed after a retry. Refresh before sending a new inquiry.' }); return; }
      console.error('Inquiry storage failed', { type: error instanceof Error ? error.name : 'unknown' });
      res.status(503).json({ error: 'We could not confirm your inquiry was saved. Your details are still here. Please retry.' });
    }
  });
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = typeof err === 'object' && err && 'status' in err ? Number(err.status) : 500;
    res.status(status === 413 ? 413 : 400).json({ error: status === 413 ? 'Submission is too large.' : 'Invalid request.' });
  });
  return app;
}
