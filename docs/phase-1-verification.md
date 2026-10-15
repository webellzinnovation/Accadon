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

## Approved compact home live strip

15 October 2026. Supersedes only the home board layout above, not the separate tournament listing.

- Preview approved on desktop and mobile before this handoff. Five fictional running tournaments stay in one horizontal row, with three full cards and a next-card edge on desktop, one card and a next-card edge on small mobile. Upcoming events are excluded from this live strip.
- Smaller cards retain sport icon, tournament name, venue/city, live/demo state, sample start date, progress, ongoing categories and the green outside glow. No match scores appear in these cards. Demo/no-live-feed labels remain visible.
- Scroll snapping, previous/next controls, keyboard-focusable rail and the All tournaments link preserve access to the full listing. Sport filters scroll on one line on mobile.
- Two complete regression passes: all 26 browser/component scripts listed above, build/typecheck twice and 40/40 unit/API tests twice. Updated home assertions from six events to five running events. Board tests additionally check single-row layout, rail overflow, next-arrow scrolling and offscreen-card focus at 1440/768/390/320. Existing tests cover filters, popup/focus return, pause/reduced motion, no viewport overflow, no API access and no runtime errors.
- Final actual-pixel inspection of board-1440.png (1440x758) and board-320.png (320x807): coherent spacing, visible next-card peek, readable compact content and green glow, no scoreboards or clipped first-card content. Desktop cards are about 365px high; the small-mobile card is about 386px high.
- Existing Vite size advisory remains. Live authentication, real-time tournament data and the remaining Phase 1 work remain outside this increment.

Branch handoff only. No main merge or deployment performed by this task.

## Shared-session and family increment verification

15 October 2026. Functional branch excludes the unapproved software landing-page redesign.

- Two complete passes of all 28 browser/component scripts: the prior 26 plus shared-session-visual and family-preview-visual. Build/typecheck twice; 42/42 unit/API tests twice.
- Shared-session checks cover two independent owner drafts, name synchronization, Basic/Events/Payments navigation, exit/return, route unmount/return, reload reset, and no API/runtime/page-overflow at 1440/390/320.
- Family checks cover disabled consent before selection, child/sport reset, review/cancel/confirm, independent sport scopes and revoke at 1440/390/320. Unit checks additionally cover unknown child, wrong sport, other academy, another child and wording-version mismatch.
- Pixel-inspected: owner-opened organizer desktop, family scope selector/context at 390px, consent review dialog at 320px, and timestamped consent result at 320px. Scope text, child/sport identity and confirm/cancel fit; the mobile owner-return banner remains visible. Captures are local fictional data only.
- Existing 727KB Vite advisory remains. No real authentication, legal consent, membership activation, communication, payment, publishing, merge or deployment.
