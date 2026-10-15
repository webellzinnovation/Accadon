# Phase 1 foundation increment

Workflow rehearsal only. This increment is not the full phase or a live release. No merge, deployment, account provisioning, billing, messages or real impersonation.

## Owner workspace
- `#/super-admin`, linked from Demo login. Overview, Academies, Tournaments, View as role and Activity & boundaries.
- Fictional academy creation requires name, city and at least one sport, followed by review/confirmation. Cancel makes no record.
- Academy/tournament IDs are stable in the mounted session. Tournament drafts filter by tenant ID, not academy name.
- View as Academy admin, Organizer, Coach, Parent or Player requires a review naming the role and academy. Owner identity and Return to super admin stay visible while scrolling, including mobile.
- Academy admin opens existing academy modules with the selected academy name. Organizer opens existing organizer modules. Coach/Parent/Player are role-specific empty shells, not full functional dashboards.
- Activity is an ephemeral list, not a durable audit. No authentication principal is created.
- Platform tournament drafts do not hydrate the organizer workspace. Leaving a role resets its local screen. Returning preserves owner academy context. Reload resets the rehearsal.

## Setup workflow and spec mapping
- T2 partial: publication checklist for name, tournament timeline, contact/address, categories/capacity/category timelines and venue. Links open the relevant module. Invalid category timelines block fictional publication. Switch-to-draft/deletion are not added here.
- T3/E2 partial: timeline lock defaults on. Locked category dates reflect tournament dates. Unlocking copies current global dates for independent editing. Relocking uses global dates; unlocking again copies those global dates. The UI explains this replacement behavior. Category rules and prize fields are not added here.
- E4 partial: Under 9/11/13/15/19 and Veterans name/sport templates with exact duplicate guard. Birth cutoffs, Veterans minimum age and rating eligibility stay organizer-defined/unvalidated. No invented eligibility rules. Rating gates are not implemented.
- Category and venue local IDs use counters instead of timestamps. Edits dismiss pending publication confirmation; confirm rechecks readiness.

## Shared visual corrections
- Header action pills have distinct label/icon wrappers with flex centering and no legacy span margin. Demo login and Workflows share the rule. Mobile menu edges fit the viewport; tablet navigation opens a menu before the row runs out of space.
- Tournament board cards use one `LiveEventCard` component and fictional status snapshots. The user's final direction is NO scores or match panels on home cards. Each card shows tournament name, sport-specific vector icon, venue/city, running/up-next status, sample start date, event progress and ongoing categories. Running cards use the requested green edge glow and green live dot. Up-next has no green glow. Green is an explicit live-status exception to the prior single-energy-accent rule; orange remains progress/action energy. Dates and progress are sample design data, not a connected feed. Filters and popup previews remain. Earlier single-match and multi-court scoreboard iterations are superseded.
- Atmosphere uses a pulse, signal meter and fine scanner edge, never fabricated score updates or timestamps. Pause/resume controls stop board animation; reduced-motion removes it. All fictional/no-live-feed labels remain explicit. Orange is energy, never a win/loss signal.

## Verification and boundaries
New unit tests cover tenant/role guards, tenant filtering, date validation and publication prerequisites. Browser tests cover all roles, review/cancel, context isolation, sticky return, reset, timeline locking, template duplicates and publication gating; new flows assert no API requests, runtime errors or document overflow. Header checks cover label/icon/SVG/pill centers and no overlap at 1440/1024/768/390/320. Board checks assert no score/match elements and verify icons, venues, dates, progress, ongoing categories, upcoming state, filtering, preview, pause/resume and reduced motion.

Phase 1 still needs shared identities/state across public/platform/organizer/academy surfaces, full spec-to-code inventory and refinement of parent/child selection/consent. Synthetic API tests do not establish live readiness. Real protected impersonation, tenant enforcement and durable audits stay behind the live gate.

## Shared-session and family increment

This section supersedes the earlier reset/empty-parent limitations where stated. Other limitations remain.

- Owner tournament drafts have an explicit Open organizer action. Academy ID and tournament ID form the organizer session key. Basic settings, category/venue inventory and fee configuration survive module, role and app-route navigation until reload. No localStorage, database or real account is used.
- Name edits in an owner-opened organizer draft flow back to the owner list. Existing public fixtures, participant/result specimens, academy-member fixtures and creator wizard are not connected by this increment. New owner drafts start with no categories; a supplied draft venue has no address and cannot satisfy readiness until completed.
- Review confirmations stay component-local; leaving a screen does not preserve a pending publish confirmation. Category and venue counters stay in the tournament scope and do not reuse deleted IDs during the session.
- Parent role now provides a fixed fictional family with two distinct child IDs and per-child sports. Common parent contact never becomes a player identifier. This is a selection/consent workflow, not child creation, verified guardianship, active membership, a real account or sibling checkout.
- Consent rehearsal records include academy, child, sport, wording version and session timestamp; explicit review/cancel/confirm, reset-on-selection and revoke are provided. Records do not grant membership or authorize communications. The wording is a sample, not an approved legal policy. No child-login policy has been invented.
- `feature-coverage.csv` indexes 152 distinct IDs from the recovered consolidated source inventory. Only the few IDs verified in this increment have updated evidence. Every other row explicitly says not re-audited; historical B/P/N labels are not completion claims. This inventory is a starting point for the remaining audit, not a declaration of feature parity.
- The old coaching-company `product-spec.txt` remains archived and conflicts with the current SaaS positioning. `consolidated-product-spec-v1.md` preserves the relevant feature reference, not authority to activate live services. Later decisions such as putting super admin in Phase 1 override its old build order.

Remaining: full cross-surface identity/state, configurable real family profiles, academy membership consent integration, full current feature audit, role capabilities, backend/auth/persistence/audit and the rest of the phased product. No phase completion claim.

## Linked family application increment

Parent Memberships can now submit a reviewed fictional application using the selected existing child ID, academy ID, sport and exact consent-record ID. Academy admin's Members section shows a separate linked-family queue with review/cancel/accept/reject. Acceptance rechecks the child/sport, supported academy sport and current non-revoked exact versioned consent. Parent sees the same status on return. Consent alone never creates or accepts a membership, and sibling states remain independent.

This does not merge the old label-only member specimens into the linked queue. No real member, role permission, plan, billing, email or account is created. No verified guardian or legal-policy claim. An already accepted rehearsal record is not silently removed if consent is later revoked; it shows the missing/revoked consent warning. Real suspension/withdrawal policy remains undecided. Rejected rows remain history; new application is an explicit new rehearsal, not an automatic retry. Reload clears all linked records.
