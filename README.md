# Accadon

**Positioning update, 2026-10-15:** Accadon is multi-sport academy SaaS for academy owners and clubs, not a Bangalore coaching-service website. Free tournament pages are the entry point; coaching management is a separate paid subscription. Each academy uses its own payment gateway. See `docs/saas-positioning.md`; it supersedes the coaching-service language in the original archived spec.

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

The migration is versioned, transactional and serialized using a Postgres advisory lock. It creates `inquiries` and `crm_activities` plus migration bookkeeping; migration 002 adds sport/role fields and expands interests without discarding earlier records. It seeds no records. Use a database user with only the permissions the app needs at runtime; run migrations under a separate schema-owner identity in production.

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

- Premium light public landing: warm paper/white/sage surfaces, orange/green accents, four original multi-sport scenes, desktop parallax, staggered program cards, connected process path, conceptual coaching loop, coaches and contact.
- Native scroll/anchors, mobile navigation, focus styles, semantic labels and reduced-motion static layout.
- Software-interest links prefill `/inquiry?interest=…`; compact form on landing and full form on `/inquiry`.
- Real `POST /api/inquiries`: name/mobile/optional email, academy/club, sport, city, role, software interest and optional message and explicit contact consent.
- Server normalization/validation, strict input shape, body/field size limits, honeypot, same-origin checks, rate limiting and UUID idempotency keys.
- Inquiry + CRM receipt activity committed in a single transaction. Same-key retries return the original ID; conflicting retry payloads return 409. No automatic email/WhatsApp sends.
- Success only after confirmed persistence; database/network errors preserve form data, never become fake empty/saved states.
- No public list/read endpoint for inquiries. No real-record claims, copied team photos, testimonials, contact details or credentials. Product previews contain explicitly labelled fictional counts, fees and player fixtures for design review. Founder context names Nishchithh as a table tennis coach without making Accadon table-tennis-only.

## Product concept previews

The landing includes 11 tabbed product screen concepts covering events/registrations, draws/scoring, leagues, players/teams, schedules, coaching, assessment, fees, announcements, families and reports. The Playinga public feature benchmark and deliberate exclusions are in `docs/playinga-benchmark.md`. All are clearly labelled and contain fictional sample data, never real academy records. They are explanatory UI previews only, not operational dashboards. The light organizer concepts include an internal sport/event tree, creation wizard, participant states, central data tables, review rail, football timeline/feed/pitch/stat comparisons, badminton scorecard, and team squad cards. Mobile stacks these blocks with labelled record cards. Owner-supplied layout references and public Tourney screenshots informed the layout only; no copied assets, betting content, paid services or deployment.

## Explicitly unfinished

`/login`, `/admin`, `/coach`, `/member` and `/onboarding` explain that they are not available yet. They do not offer mock credentials, accept enrollment or expose private data. Authentication, invitations/recovery, server-side staff/member permissions, settings, inquiry CRM read/edit screens, onboarding review, players/guardians, scheduling/attendance, courses/assessments, subscriptions/manual payments and the member portal are **not implemented**. No rubric or plans are seeded. No gateway is connected. No credentials are hardcoded.

## Next phase

1. Secure owner provisioning and password/session authentication, recovery/invitation boundaries, staff roles and permission tests. Public signup must never grant staff access.
2. Private application shell, setup checklist/settings and CRM inquiry list/detail/follow-ups. No private record endpoint before authorization is enforced.
3. Onboarding review with idempotent player/guardian linking, actual locations/coaches/batches.
4. Remaining workflows in `docs/implementation-checklist.md`.

`docs/product-spec.txt` is the archived coaching-service spec, not the current SaaS positioning. `docs/saas-positioning.md` supersedes it wherever audience, business model, tenant scope or product copy differ. This repository uses custom code only.

### Dense product concept windows
All 11 product-tour screens now show populated, explicitly fictional fixtures with compact navigation, KPI cards, detailed records and screen-specific widgets. Parent view omits staff review activity. The 11 outer tabs are interactive; inner search, filters, exports, publishing and payment controls are illustrative. These are design concepts, not implemented academy-management features. The production API remains limited to inquiry persistence.

## Demo admin and static subpath previews

Member login opens a clearly labelled demo with public pre-filled fictional credentials. One click opens the academy workspace concepts. No real authentication, live account, data write or credential submission occurs. Exit returns to the demo entry screen. Sport and tournament-format selectors and the outer tour tabs work; other inner workflow controls remain illustrative.

For a GitHub Pages-style preview, run `npx vite build --base=/Accadon/`. Vite's BASE_URL is used for routing and links. Subpath builds use `#/login`, `#/inquiry` and `#/privacy` under the configured base, so page refreshes do not require a server-side SPA fallback. A normal root build keeps the existing server routes, with the demo entry also available at `/#/login`.

`npm run test:static` verifies the production subpath build on a file-only server and restores the root build. It does not deploy anything. The static preview has no inquiry API: real persistence still requires the Express server and configured Postgres database.

The match desk now has separate football, badminton doubles, table tennis and cricket concepts. Leagues & standings has six detailed format choices: round robin, seeded elimination, groups + elimination, double elimination, Swiss and league + playoffs. Fixtures, people and results are fictional design data, not an operational tournament engine.

## Live product stage 1

`/app` now contains the first real database-backed product stage, separate from the fictional demo. Auth, superadmin academy/account provisioning, academy/organizer tournament CRUD, independent player self-signup, open-event entry/review/withdrawal and personal registration history are implemented. Production seeds no fake data and has no default password. Global player identity is separate from academy membership; mobile/email verification and parent-child linking are not enabled yet.

Read `docs/live-stage-1.md` before hosting. It lists the exact enabled flows, security boundaries, missing features, free-tier deployment setup and verification limits. `render.yaml` targets a free web service but no account or service has been created. The complete requested app is not finished. Coaching, draw/scoring/results, payments and academy membership consent screens are future stages. `npm run test:live` exercises actual UI/API with an isolated synthetic embedded Postgres database; it does not verify Neon or Render.
