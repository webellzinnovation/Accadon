# Foundation and approved status-card verification

15 October 2026. Runtime tree: `6ea04bc516dd1fb8c9687fec711c978063f5955d`. This record adds documentation only.

- Two complete passes of all 26 browser/component scripts, checked from the `status-1` and `status-2` logs. No failed or error-bearing logs.
- Build/typecheck twice and 40/40 unit/API tests twice. Synthetic Postgres/API tests use isolated test data and do not establish live readiness.
- Original 22 scripts: visual, static-preview, home-visual, tournaments-visual, organizer-visual, workspace-visual, entries-visual, settings-visual, forms-visual, roles-visual, sponsors-visual, academy-visual, results-visual, officials-visual, parent-visual, workflow-visual, live-visual, kit-visual, kit-icons, kit-qualifiers, kit-theme, theme-rollout.
- New scripts: superadmin-visual, setup-readiness-visual, header-alignment, live-board-visual.
- Core responsive checks at 1440/390/320. Header alignment also checked at 1024/768; board status at 768. New rehearsal flows assert no API access, runtime errors or viewport overflow.
- Pixel inspection: final status-board desktop, green-glow status card at 320px, owner overview at 1440px, owner viewing Parent at 320px, owner viewing Academy admin at 390px, academy confirmation at 320px, category date fields at 320px and shared header pills at 1440px. Readable, aligned, no scoreboards on home tournament cards; fictional/demo labels stay visible.
- The no-score green-glow design was approved before this final verification. Previous score-centric card iterations are superseded.

Remaining advisory: Vite reports a roughly 727KB JS chunk (about 221KB gzip), above its 500KB advisory threshold. Code splitting is not part of this increment.

This is a branch handoff only. No merge, deployment, paid service, Firebase billing or live impersonation. See `phase-1-foundation.md` for remaining Phase 1 work and role-preview limits.
