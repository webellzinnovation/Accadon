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
