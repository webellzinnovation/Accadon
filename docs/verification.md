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

## Dashboard concept windows

Added switchable dashboard concept previews: tournament draw/scoring, coaching batches/attendance, and player courses/assessment. Every window is labelled Concept Preview / Design Preview Only, with fictional Player A/B/C data, no connected account or live records. Sample scoring is explicitly illustrative; assessment rubric remains unconfigured with no fabricated player score. UI chrome/sidebar are illustrative, not non-working buttons masquerading as real tools. Only the outer screen tabs are interactive, including arrow-key/Home/End navigation.

Browser suite checks all three previews and keyboard switching at 1440/390/320px without overflow. Actual desktop previews and phone tournament/assessment/coaching captures inspected; mobile stacks brackets and course panels, hides decorative sidebar and keeps all content within the viewport. Build/typechecks pass; 10 API/geometry tests remain unchanged. Latest output: 38 modules; JS 376.18 kB / gzip 125.71 kB, CSS 26.24 kB / gzip 6.39 kB. These previews add no working dashboard backend.

## Expanded product tour

Replaced the three simple previews with 11 richer screen concepts: event setup/entries, draws/scoring, leagues/standings, players/teams, court scheduling, coaching/attendance, courses/assessment/match journal, fees/subscriptions, notices, family view and reporting/oversight. Each has contextual summary states, multi-column records, state differences and detailed side panels. Draw, calendar and family screens add distinct visual structures. See `playinga-benchmark.md` for observed sources, adopted scope and exclusions.

Screenshots of every concept at 1440/390/320px were captured (33 images). All were inspected in side-by-side proof sheets, with the actual mobile layouts recomposed as labelled records, not clipped tables. No clipping/overlap was observed; every concept retains its fictional-content notice. Browser suite switches through all 11 screens at each width and checks no overflow and keyboard screen navigation.

Build/typechecks pass; no backend changes. API/geometry tests 10/10 remain green. Latest output: 39 modules; JS 386.13 kB / gzip 129.59 kB, CSS 33.04 kB / gzip 7.58 kB. No external assets or chart dependencies. Only one concept panel is mounted at a time.

## Light theme and organizer reference adaptation

Whole-site conversion to warm paper/white/light sage surfaces, green ink, burnt-orange display accents and orange calls to action. Hero illustration grounds, navigation including mobile menu, cards, forms/errors, all 11 preview windows, footer, simple pages, favicon and browser theme color converted. Existing section motion/reduced-motion support retained.

Tournament concepts now have an internal sport/event tree, central event banner/tables, timed match rows and right-hand review/notice rail. Entry screen includes an original four-step creation concept, sport grid and participant cards. Draw screen adds a separate clearly fictional football match detail: 72-minute clock, goal/card timeline, event feed, five-a-side pitch, numbered squad and measured-layout comparison bars with invented values explicitly labelled. Badminton scorecard remains separate. Standings comparison bars use the same fictional points as its table. Players/teams includes a sample squad view.

Phone layout stacks full cards, score hero, timeline, line-up and stats, with a labelled decorative bottom-navigation concept; internal navigation/rails reflow, not squeeze. Existing controls remain only the outer screen selector and real site/form navigation. No private modules became functional.

Final light/reference pass: strict build/typechecks, 10/10 API/geometry tests and all-width browser suite passed. Suite also asserts light page/form/window/footer surfaces and presence of create wizard, football line-up and four comparison bars. Final bundle: JS 402.36 kB / gzip 133.11 kB; CSS 53.07 kB / gzip 10.44 kB, 40 modules. Added original inline SVG only, no image downloads in shipped site. Public Tourney product screenshots inspected for flow evidence; not included in site assets.

## 2026-10-15: dense light workspace revision

Rebuilt all 11 concept screens with compact app navigation, four numeric KPI cards, populated record tables, statuses, metadata, filter/tool chrome and timestamped review cards. Added tournament cards, a detailed creation form concept, coaching session/attendance widgets, course progress and coach review, a four-court planner, a fictional fee ledger and reporting charts. Parent view has its own navigation and deliberately omits the staff review rail.

All names, amounts, dates, scores and activity are explicitly fictional design fixtures. This supersedes earlier empty-state/no-chart design notes above. No live accounts, academy records, bookings, payment service or message service are connected. Only the outer 11-screen selector is interactive; the inner app controls are labelled decorative. Backend remains inquiry-only, with no seeded demo records.

Verification: strict client/server typechecks and production build pass; 10/10 API and geometry tests pass. Visual suite passes at 1440px, 390px and 320px across all tabs, including KPI and record-cell overflow checks, keyboard tab navigation, mobile navigation, reduced motion, inquiry prefilling and failed-save input retention. Parent concept is checked for no staff review rail. Latest bundle: JS 414.54 kB / gzip 136.78 kB; CSS 75.97 kB / gzip 14.59 kB. All 33 full concept windows captured; desktop and phone top sections plus phone lower table/wizard/rail sections inspected as pixels. No merge, deployment or paid service used.

## Sport-specific scoring, tournament formats and demo admin entry

Latest iteration, 2026-10-15. This section supersedes earlier descriptions of login availability and tour interactivity.

- Four match concepts: football goal/clock/pitch/stats; badminton doubles with best-of-three 21-point games, deuce/cap and four-player court; table tennis best-of-five with 11-point games, 10-all deuce and service state; cricket T20 chase, run rates, batting/bowling figures and field diagram. All data is fictional.
- Six selectable format concepts: four-team round robin with mirrored result matrix; eight-seed single elimination and third place; four groups of four feeding eight-team knockout; four-player double elimination with conditional reset; eight-player Swiss with round history, no repeat pairings and verified Buchholz values; league plus top-four playoffs. Rules, rankings and advancement are shown, not executed by a draw engine.
- Demo admin screen has public fictional pre-filled values. Enter opens the existing academy workspace concepts; Exit returns to the screen. Nothing is sent, checked or persisted. There is no real authentication or account access.
- Base path derives from Vite BASE_URL. At non-root bases, internal page links use base-prefixed hash routes so static GitHub Pages does not need SPA fallback. Root/server route aliases remain available. Header/footer and inquiry privacy links stay within the base.
- `npm run test:static` builds with `/Accadon/`, serves the actual production files through a Python file-only HTTP server, tests `/Accadon` redirect and `/Accadon/`, base-scoped links, Member login, prefilled demo credentials, entry/exit, workspace tabs, no auth POST, inquiry query prefilling and privacy at 1440/390/320. It restores the ordinary root build afterward.
- Strict build/typecheck passed. API/geometry tests: 10/10. Visual browser suite passed at 1440/390/320, including four sport concepts and all six format switches, internal overflow checks and no page errors. Full login and responsive lower knockout/cricket screenshots inspected directly. A phone final-stage spacing issue found in pixel inspection was corrected and recaptured.
- Inquiry storage is still not available on a static host. The existing API needs a configured server/database, never fake client success. Demo admin does not change that limitation.

Scoring references checked:
- BWF Laws: https://system.bwfbadminton.com/documents/folder_1_81/Statutes/CHAPTER-4---RULES-OF-THE-GAME/SECTION%204.1-%20Laws%20of%20Badminton.pdf
- ITTF Laws 2.11/2.12/2.13: https://ttleagues-api.azurewebsites.net/download/peterborough/ITTF%20Statutes%202024%20-%202.%20The%20Laws%20of%20Table%20Tennis.pdf (downloaded and text checked for 11-point games, two-point lead, odd-game matches and deuce service).
- MCC overs: https://www.lords.org/mcc/the-laws/the-over

No paid service provisioned, no Firebase billing, no push/merge/deployment performed in this workspace.

## Live foundation checkpoint

Added real auth, scoped academy/account administration, tournament CRUD, independent player signup, event entries/review/withdrawal, personal participation and global profile/membership/guardian schema. See docs/live-stage-1.md for exact scope and deployment caveats. Local strict build passed; API/geometry tests 17/17; browser/API/embedded-Postgres workflow at 1440/390/320 passed; public visual and static-base regression passed. Inspected real screenshot pixels for live login, parent-independent player participation, academy-admin tournament and owner account management. These are synthetic records in an isolated test-only Postgres engine, not production data. No Neon/Render service provisioned or verified. No paid service or deployment performed.

## Pages-first workflow review

Latest requirement: workflow pages only, real login/backend expansion paused until confirmation. Added a static role walkthrough at `/workflows` (BASE_URL-aware hash link for Pages) and `/app` alias. It needs no auth or server. Parent journey is first; five roles and 27 steps total. Child and sport switching, sample parent discovery, kid selection, academy sport selection, six format choices and Next/Previous controls work in browser state only. Each view labels its fictional review data. No actual record, send or payment is made.

`npm run test:workflows` passed at 1440/390/320: every role/step, no page/internal overflow, child/sport separation, sample parent search, detailed product-screen switch, no API/auth requests and no page errors. Production `/Accadon/` file-only host test now also visits parent child page and academy sport selection and passes. Inspected actual pixels of desktop parent sport history, mobile per-child academy memberships, 320px academy kid/sport preview and desktop organizer format selection. Pre-pause parent CRUD browser/API tests passed separately; these are not evidence that live CRUD runs on GitHub Pages.

Parent/global sport groundwork completed before the pages-only steering is preserved: common parent profile, separate kids/sports, per-profile entries, membership requests and a five-sport database catalog with scoring disabled pending research. API/geometry 18/18 and parent/live browser suites passed locally with synthetic embedded Postgres. No Neon/Render provisioning, external record creation or deployment occurred. Public route and header now prioritize workflow review rather than real login. Remaining detailed operations and all real launch readiness still need owner confirmation.

## Research-backed sport-definition review

Added a typed, versioned five-sport catalog and a static Sport definitions view inside the workflow review. Retained the five full research briefs in docs/sport-research, with original source URLs, limits and official-vs-proposed distinctions. The organizer scoring summary now reads the catalog. Profiles remain configuration, not runnable scoring engines; scoringEnabled is false for every sport.

Profiles: ITTF 2026; badminton current 3x21 and approved 3x15 effective 4 January 2027; IFAB 2026/27 with separate AIFF youth example; MCC October 2026 local-limited-overs template and ICC T20I example; USAP 2026 traditional and provisional rally pickleball. Adoption is explicit, not auto-switched by calendar. TT ratios and BWF differences stay separate, football shoot-outs never add to match goals, cricket has delivery-level fields and no guessed DLS, pickleball provisional rally has one doubles server and no old game-point freeze.

Strict build passed; three catalog invariant tests passed. Workflow browser suite now also visits all nine profile variants at 1440/390/320 and checks scoring gating, no internal/page overflow, no API/auth requests and zero page errors. Static subpath regression passed. Inspected actual desktop future-badminton, 320px provisional-pickleball and mobile cricket definition pixels. Research brief conclusions are represented with citations but not independently re-adjudicated as federation approval. No scorer, database migration, deployment or operational claim was added in this pass.

## Locked brand artwork applied everywhere

Replaced the header's CSS/text A and footer's text-only branding with the exact supplied transparent SVG through one Brand/BrandMark component. Demo/login cards, workflow role panel, academy workspace bar and retained live/parent sidebars use the same artwork. Favicon and stored master are byte-for-byte copies of the supplied cream master; transparent mark is byte-for-byte supplied SVG. No path redraw, fill change, stretching or filter.

Strict build, production static-base regression and public visual suite passed. Browser checks confirmed loaded image bytes and square rendered boxes at 1440/390/320 for home/header/footer/demo/workflows/workspace. Direct pixel inspection of mobile demo/header/footer and desktop workspace bar shows the consistent orange A/green dot, no distortion or clipping. This is implementation of the owner's selected artwork, not a trademark clearance claim.
