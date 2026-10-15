# Verification - phase-one branch

Run date: 2026-10-15. These are local checks, not production verification.

- `npm run build`: passed. Includes strict no-emit TypeScript checks for frontend and backend, Vite production build and backend TypeScript emit.
- Vite output: 35 modules; CSS 16.20 kB (gzip 4.38 kB); JS 361.44 kB (gzip 122.23 kB); HTML 0.88 kB (gzip 0.47 kB).
- `npm test`: 8/8 passed. Postgres schema, empty initial records, normalized persisted inquiry and CRM activity, retry deduplication/payload conflict, missing/failing storage, server validation/consent/honeypot/lengths, no public inquiry listing, cross-origin denial, malformed requests and rate limiting.
- Storage tests use PGlite, a real embedded Postgres engine through a test adapter. They do not verify a live Neon database, network TLS or a deployed provider's transaction behavior. No production database exists in this branch.
- `npm run test:visual`: passed at 1440px, 390px and 320px. Checked no page overflow, reduced motion, mobile menu, prefilling, failed-save field retention and animated scroll with zero browser page errors.
- Actual screenshot inspection: full desktop/mobile layouts and animated desktop hero. Court/net/paddle are recognizable; no overlapping hero copy, missing sections, broken contact placeholders or horizontal clipping. Static reduced-motion view retains all content. Mobile form stacks vertically.
- `npm audit --omit=dev`: zero reported vulnerabilities at check time.

## Limits

No live inquiry was sent to the academy and no real personal data was collected. Browser failure-path tests intentionally run with database disconnected. Successful saves are verified at the API/repository layer against embedded Postgres, not an end-to-end live deployment. Email/WhatsApp delivery, authentication/permissions and all future app modules are not implemented. No dedicated lint configuration or lint run is claimed. Screen-reader testing and production TLS/proxy checks remain to do.

## Table-proportion correction

The original drawing placed the net along the visibly longer side and made the table read short. Rebuilt the table from explicit 274 cm length, 152.5 cm width, 76 cm height and 15.25 cm net height using equal-scale isometric axes. Net now crosses the short width halfway along the length; doubles line runs lengthways. Geometry regression tests verify the 274:152.5 projected ratio and net midpoint. Removed the artwork caption where it collided with the scene footer after lengthening the table.

Source for dimensions and net orientation: https://ttleagues-api.azurewebsites.net/download/peterborough/ITTF%20Statutes%202024%20-%202.%20The%20Laws%20of%20Table%20Tennis.pdf

Build/typechecks pass; 10/10 API and geometry tests pass; browser checks pass at 1440, 390 and 320px. Desktop and mobile hero pixels inspected again after correction.
