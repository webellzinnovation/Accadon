# Product implementation phases

Source: Accadon consolidated product spec, version 1, 15 October 2026. Built/UI means a rehearsal, not a working service. Existing local data must remain fictional and honest about reset behavior.

## First: shared visual rollout
Purple base, one neon energy accent per view, quiet frosted reading surfaces, shared centered vectors, one input corner rule, themed internal/viewport scrollbars, semantic green qualification/wins and red losses, and popup-first secondary detail. Preserve the supplied logo artwork. No merge or deployment.

## Phase 1: platform structure and tournament workflow foundation
- Super admin is the owner's role, not a later add-on: overview of academies/tenants/tournaments, with explicit View as Academy admin, Organizer, Coach, Parent or Player. Keep owner identity and Return to super admin visible. View-as is a rehearsal only. Actual impersonation requires authorization, tenant boundaries, audit and a visible exit at the live gate.
- Consolidate tournament/category/venue/player identifiers and local session state. Do not merge children by parent contact; membership is child x academy x sport.
- Complete setup/publish checklist, shared category timeline locks, TT category templates, guardian consent and parent/child selection review.
- Inventory spec IDs against code and tests before calling a feature implemented. Keep outstanding integration and policy decisions visible.

## Phase 2: registration and competition
Multi-category/child registration; doubles partner workflow; forms/review/withdrawal/edit; seeds/ratings; supported formats and schedule editing. Wire the crosstable to the same rehearsal results as standings and show tie-break reasons. Double elimination/team ties require an explicit release-format decision.

## Phase 3: scoring
TT rules engine; best of 3/5/7; live point entry, undo, serve rotation and deciding-game side switch; review/publish/approval states; scorer-link rehearsal. Never claim a public rehearsal link authenticates a scorer.

## Phase 4: public pages, location, money workflows
Tournament/academy public-page previews, discovery, sponsors, reusable venue/location flow, offline payment reconciliation and gateway checkout rehearsal. Real map provider, address services, gateway credentials and any paid usage are separate decisions. No third-party calls with private data by default.

## Phase 5: academy value
Journal, courses, parent/coach dashboards, teams, communication previews, scheduler and TV views. Keep journal metrics and child-login policies unresolved until specified.

## Phase 6: live release, only after approval
Tenant/auth/capability enforcement, durable storage and audit, authenticated impersonation, approved gateways, communication delivery, coaching billing, deployment and operational testing. Existing synthetic local API tests are not evidence of live readiness. No paid services or Firebase billing enabled by this plan.

## Later
Native apps, schools, social/gallery, streaming, booking and deeper analytics. Super admin structure is already in Phase 1; its later analytics do not defer the owner's role.

## Decisions to recover before affected implementation
Map provider and usage budget; formats for first release beyond knockout/groups; journal opponent-number and derived metric definitions; kid-login/guardian policy; entry-fee settlement details. Research what is already decided before asking again.
