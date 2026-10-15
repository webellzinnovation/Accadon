# Product implementation checklist

## This branch
- [x] Typed React/Vite and Express scaffold; build and run scripts
- [x] Full public landing sections and original court artwork
- [x] Desktop scroll motion and static reduced-motion layout
- [x] Mobile nav and program-prefilled inquiry links
- [x] Compact/full inquiry form and honest missing-storage errors
- [x] Postgres inquiry + CRM activity migration/transaction
- [x] Validation, consent version, honeypot, rate limiting and idempotency
- [x] Isolated tests, build checks and desktop/mobile visual checks
- [x] Draft inquiry privacy notice, clearly flagged for owner review
- [ ] Actual Neon database and production deployment (not authorized in this run)

## Private foundation
- [ ] Owner-only protected bootstrap, credentials, secure sessions and recovery
- [ ] Staff invitation/permission model and direct-API role/ID-tampering tests
- [ ] Separate public/private settings, setup checklist, approved content lifecycle
- [ ] CRM list/detail/stages/search/follow-ups/assignment and audit history

## Academy operations
- [ ] Onboarding submission, review, duplicate checks and retry-safe linking
- [ ] Players, guardians, verified child links and parent-as-player
- [ ] Coaches/locations/batches and assignment-scoped access
- [ ] Sessions/plans, allocations/capacity/time conflict handling and recurrence
- [ ] Attendance, pending/saved/error states and correction audit history
- [ ] Courses/levels/lessons and progress as separate navigation
- [ ] Configurable versioned rubrics; empty until actual scoring format supplied
- [ ] Coach drafts/publishing and member-only published assessments
- [ ] Plans/subscriptions/manual charges/payments and reversal history
- [ ] Explicit consumption rules with idempotent deductions/reversals; off by default
- [ ] Gateway boundary disabled until configured; no fake settlement
- [ ] Secure invited member account claims, child switching and own-data views
- [ ] Full permissions/workflow/accessibility/performance validation

Owner inputs still needed: public contacts, supporting coach name/approved images, actual locations/batches, fees/plans, scoring format, usage rules and privacy/retention approval. No settings editor exists in this branch yet, so these are deliberately not invented or exposed as fake placeholders.
