> Superseded for current sequencing: workflow review comes first. Do not deploy until owner satisfaction review. Backend work is retained and paused. Public navigation uses /workflows; the unlinked local real-auth preview is /live-preview. Parent/global sport groundwork added afterward is not approved for launch.

# Live product foundation - stage 1

This is a deployable preview, not a claim of production readiness. Public concept screens remain separate. The live app is `/app`; the fictional demo is `/#/login`.

## Working now

- Password sign-in using Node scrypt with random salt; passwords are never returned.
- Opaque 32-byte random session tokens. Only SHA-256 token hashes are stored in Postgres. HttpOnly, SameSite=Strict cookies; Secure in production; 12-hour expiry.
- Origin checks for every write, JSON-only writes, login/signup rate limits, no-store responses, Helmet security headers, parameterized queries, validation and transaction-backed audit records.
- Owner-only one-time superadmin bootstrap, no default live credentials and no public staff-role signup.
- Superadmin creates academies and academy admin accounts, views all tournaments, and enables/disables non-superadmin accounts.
- Academy admin creates organizer/family accounts only in their academy. Organizer manages only events they own. All permissions are enforced in API queries, not just by hiding buttons.
- Tournament CRUD for name, sport, format, venue, date and status. Draft deletion only, with entry history protected. Publish makes the event open for player registration. No entry fees are collected.
- Independent players self-sign up with email/password and no academy membership. They see published events across academies, submit an entry, see personal registration history and withdraw. Admin/owner organizer accepts or rejects entries. Duplicate registration is rejected.
- Global player profile and academy membership are separate tables. Membership is profile × academy × sport; a player can have multiple academies/sports. Guardian-to-child links use distinct profiles for siblings, never a shared parent email as the child identity. These membership/guardian tables are foundations, not available UI workflows. The player account and entries remain global. Membership does not move or duplicate tournament history.
- Password changes revoke all sessions. Disabled accounts cannot log in and all sessions are deleted. Logout invalidates the database session.
- Honest database-backed empty states. No synthetic records are seeded by migrations, bootstrap or production startup.

## Not enabled

Email verification, password recovery, mobile sign-in/verification, child/guardian profiles, academy invitation/claim/consent screens, academy roster membership UI, result history/standings, match scheduling, draw generation, score approval, coaching, attendance, fees, notices, payment collection, public shareable event details and automatic email are later stages. Email is normalized and unique but **not ownership-verified**; never use it as proof to merge identities or disclose previous player history. There is no automatic profile matching. Player signup consent covers sharing that player's name and entry with organizers they choose; it does not permit academy history disclosure.

Currently staff roles have one academy scope; global independent player membership is modeled separately. The academy family account is a constrained published-event view, not completed parent-child functionality. Do not present all four requested dashboards as finished. Superadmins can provision accounts but no reset-password workflow exists yet. A server owner can recover access through an explicit, reviewed maintenance process; no secret backdoor or fallback is provided.

Lists are capped at 200 records and not paginated in this stage. Login/signup IP rate limits are in-memory and reset when the process restarts. Expired sessions are cleaned on login. No independent penetration test, concurrency/load test, email-delivery test or screen-reader test has been done. Free-tier hosting is for preview, not a production SLA.

## Deployment preparation

`render.yaml` specifies a free web service and provisions no paid/database service. Confirm the current plan and checkout total are $0 before creating it. Supply an existing Neon free database with proper TLS settings in `DATABASE_URL` and the exact HTTPS URL in `PUBLIC_ORIGIN`. No secrets belong in Git, `VITE_*`, screenshots or chat. Supply credentials through a secure secret store or directly in the provider's environment settings.

1. Build: `npm ci && npm run build`.
2. Start: `npm run db:migrate && npm start`, with `NODE_ENV=production`.
3. Set one-time server-only `BOOTSTRAP_EMAIL`, `BOOTSTRAP_NAME`, `BOOTSTRAP_PASSWORD` (minimum 12 characters). Run `npm run admin:bootstrap` once. It refuses if any superadmin exists. Remove those bootstrap variables immediately. Never use the fictional demo values.
4. Sign in at `/app`, change password if required, create the first academy/admin, and verify all stages on the hosted URL before inviting users.
5. Verify actual Neon persistence, Render HTTPS cookies, origin settings, request proxy behavior, migrations on restart and no cross-academy reads. These have not been checked remotely.

The server deliberately does not trust arbitrary proxy headers. Rate limiting may be shared behind Render's proxy until its current trusted proxy configuration is verified. Do not set broad `trust proxy=true`; establish the provider's exact proxy path first. The generated health endpoint indicates configuration, not database reachability. Render may mark the process healthy while database requests fail; UI returns an honest storage error. Do not call that a verified deployment.

References read on 2026-10-15: https://render.com/docs/free and https://render.com/docs/blueprint-spec . Free instance availability/limits can change. Render's free documentation explicitly advises against production applications. Neon project/plan has not been created or verified; final free plan and usage limits must be checked in the owner's account.

## Local verification

- `npm test`: API/geometry tests using embedded Postgres (PGlite) through the same repository/query interface, not live Neon.
- `npm run test:live`: starts an isolated test-only PGlite server, creates synthetic users only there, then uses real browser + HTTP API at 1440/390/320. Covers owner login, academy/admin provisioning, admin tournament save/reload, player signup/entry and participation reload. Synthetic screenshots are verification examples, not live customer records.
- `npm run test:visual`: public concept tour regression.
- `npm run test:static`: public static subpath build regression. Live app intentionally reports missing API on GitHub Pages.

Test fixture server is only launched explicitly by `test:live`. It is not imported by production, part of server build, or used as a runtime database fallback.
