# Accadon

Custom-code website and academy-management foundation. Phase one contains the public landing page and inquiry intake. It is **not** the finished academy system and must not be presented as one.

## Stack

- Vite + React + TypeScript, GSAP/ScrollTrigger, original inline SVG court art. No remote assets or paid services.
- Express + Node 22, Zod validation, Helmet and request rate limiting.
- Postgres through `pg`, transactional schema migrations. Compatible with a Neon Postgres connection string; no Neon account/database has been provisioned or tested in this branch.
- Tests use PGlite (actual embedded Postgres engine, isolated synthetic fixtures), Supertest and local Chromium through Playwright. The running app never falls back to test storage.

## Run locally

```sh
npm ci
cp .env.example .env
# Set DATABASE_URL to your own development Postgres database.
# Keep actual credentials out of Git and client-side VITE_ variables.
npm run db:migrate
npm run dev
```

Open **http://127.0.0.1:5173**. This exact origin is supported for development. Vite forwards `/api` to Express on 3001. If you prefer `http://localhost:5173`, set `PUBLIC_ORIGIN=http://localhost:5173` in `.env` and restart. With no database URL, you may still review the site; valid inquiry submissions return a clear 503 and keep the form filled. They do not report success or write to localStorage.

The migration is versioned, transactional and serialized using a Postgres advisory lock. It creates only `inquiries` and `crm_activities` plus migration bookkeeping. It seeds no records. Use a database user with only the permissions the app needs at runtime; run migrations under a separate schema-owner identity in production.

## Verify

```sh
npm run typecheck
npm run build
npm test
npm run test:visual
npm audit --omit=dev
```

`test:visual` requires local Google Chrome at `/usr/bin/google-chrome`; change `executablePath` for another platform. It starts/stops its own Vite/API processes. Make sure ports 5173 and 3001 are free. Screenshots are generated in ignored `artifacts/`. API tests use ephemeral synthetic data only, not your database. See `docs/verification.md` for results and limitations.

## Production preparation (not deployed)

```sh
npm ci
npm run db:migrate
npm run build
NODE_ENV=production npm start
```

Set `DATABASE_URL`, `PORT` as needed and `PUBLIC_ORIGIN` to the exact approved HTTPS origin. Server serves the built frontend and API together. Use database TLS per your Postgres provider, verified certificates and a supported Postgres pooler. Do not disable certificate verification. There is no Vercel/Neon setup, paid plan, domain or deployment in this branch. Hosting the Express service is a separate deployment decision; this branch does not claim compatibility with an unconfigured serverless host.

Before real data intake: owner must review the draft `/privacy` notice, supply an operational privacy contact and retention/deletion practices, and configure database access/backups. Keep this branch as development/review until then. For multiple server replicas, replace the process-local rate-limit store with a shared store or hosting-layer limiter. Keep direct Express access restricted behind any trusted proxy, configure trust only for actual proxy hops and verify origin handling/HTTPS end to end. Never use `app.set('trust proxy', true)` without validating the host network. No real family data belongs in test fixtures.

## Implemented

- Dark premium public landing: layered original court/net/paddle/ball, desktop parallax, staggered program cards, connected process path, conceptual coaching loop, coaches and contact.
- Native scroll/anchors, mobile navigation, focus styles, semantic labels and reduced-motion static layout.
- Four program links prefill `/inquiry?interest=…`; compact form on landing and full form on `/inquiry`.
- Real `POST /api/inquiries`: name/mobile/optional email, interest/locality, relevant institution, optional learner/age group/message and explicit contact consent.
- Server normalization/validation, strict input shape, body/field size limits, honeypot, same-origin checks, rate limiting and UUID idempotency keys.
- Inquiry + CRM receipt activity committed in a single transaction. Same-key retries return the original ID; conflicting retry payloads return 409. No automatic email/WhatsApp sends.
- Success only after confirmed persistence; database/network errors preserve form data, never become fake empty/saved states.
- No public list/read endpoint for inquiries. No fabricated counts, fees, players, team photos, testimonials, contact details or credentials. ITTF credential is credited only to an unnamed supporting coach.

## Explicitly unfinished

`/login`, `/admin`, `/coach`, `/member` and `/onboarding` explain that they are not available yet. They do not offer mock credentials, accept enrollment or expose private data. Authentication, invitations/recovery, server-side staff/member permissions, settings, inquiry CRM read/edit screens, onboarding review, players/guardians, scheduling/attendance, courses/assessments, subscriptions/manual payments and the member portal are **not implemented**. No rubric or plans are seeded. No gateway is connected. No credentials are hardcoded.

## Next phase

1. Secure owner provisioning and password/session authentication, recovery/invitation boundaries, staff roles and permission tests. Public signup must never grant staff access.
2. Private application shell, setup checklist/settings and CRM inquiry list/detail/follow-ups. No private record endpoint before authorization is enforced.
3. Onboarding review with idempotent player/guardian linking, actual locations/coaches/batches.
4. Remaining workflows in `docs/implementation-checklist.md`.

`docs/product-spec.txt` is the full agreed product scope preserved as requirements, not instructions to use Arena. This repository uses custom code only.
