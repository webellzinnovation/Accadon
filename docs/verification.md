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

## Multi-sport SaaS repositioning

Landing and inquiry are now for academy owners/clubs, not coaching customers. Form collects academy name, sports, city, role and software needs. Migration 002 preserves old inquiry rows while adding sport/role columns and new interest values; city uses the existing locality column and academy name the existing institution column. The active validation accepts only new SaaS inquiry types.

Build/typechecks and all 10 tests pass. Browser checks repeated at 1440/390/320px; actual desktop/full-page and both phone hero screenshots inspected. The corrected table is explicitly one sport illustrated, not the product boundary. Software is clearly marked in development; tournaments, academy claiming, paid coaching, gateways and account access are not falsely presented as available. Product pricing is not invented.

Latest build: 36 modules, JS 362.62 kB (gzip 122.46 kB), CSS 17.12 kB (gzip 4.56 kB), HTML 0.89 kB (gzip 0.47 kB).

## Multi-sport hero artwork

Replaced the standalone table-tennis hero with four equal original SVG scenes: badminton rackets/shuttlecock, football/pitch, cricket bat/ball/wickets, and the corrected table-tennis table. Matched dark green/orange/cream art direction, staggered panels and scroll layers. All four sport labels are browser-asserted visible at 1440, 390 and 320px. Actual desktop hero, full-page mobile and readable 320px artwork detail inspected: every sport recognizable; no clipping or collision with copy/controls. Reduced-motion view keeps the complete static composition.

Build/typechecks pass; API/geometry 10/10 and browser suite pass. Latest output: 37 modules, JS 368.47 kB / gzip 123.98 kB, CSS 18.90 kB / gzip 4.95 kB. No external assets added.
