# Organizer settings implementation status

Required scope from supplied Playinga settings screenshots and the user's correction, 15 October 2026. Preserve Accadon's light theme and static workflow-first approach.

## First slice: implemented

`/organizer/settings` and static `#/organizer/settings`, linked from the creation page. Payments configuration with collection on/off, offline method or explicitly disconnected online gateway, INR, optional once-per-registration tournament fee, independent sample division fees, fixed early-bird discounts/deadlines, illustrative separate tax, voluntary donation and extra-charge descriptions. Transparent sample entrant total and local review marker. Review resets when configuration changes.

No persistence, collection, payment status, receipt, gateway, tax recommendation or automatic eligibility check. Categories are fictional standalone settings examples, not persisted or synchronized with the unsaved creation wizard. This boundary is deliberate for the first slice. Review total handles once-only charges without duplication. Financial terms and legal handling require confirmation before live activation.

## Second slice: implemented

Custom role name and sport/division scope → independent capability selection → existing fictional people → reviewed local configuration. Role list supports edit and assignment revocation; an action/category probe demonstrates denied-by-default and outside-scope behavior. Score entry still requires accepted exact-match allocation; result certification needs independent review. No real authorization or identity changes. Tested create/edit/assignment/review/probe/revocation/reset at 1440/390/320, with actual mobile review and desktop revoked-state pixels inspected.

## Following required slices

- Contingent/common and division forms, waiver/terms version and registration enforcement policy. No real personal information.
- Optional sponsor editor with explicit empty state, safe sample assets and local placement preview.

The remaining tabs are visibly labeled next build slices, not working editors or optional scope.

## Verification

Build/typecheck; 31 unit/API tests; fee configuration interaction test at 1440, 390 and 320 pixels; organizer regression at the same widths. No API requests in either demo interaction test. Actual form and total pixels inspected on desktop and mobile, with no cropped text or overlapping controls. Existing Vite large-chunk advisory remains.

### Forms & waivers delivered as local rehearsal
Common/contingent and independent sample division fields, text/number/yes-no, required controls, reorder/remove, guardian separation, simulated signup enforcement, optional draft terms/waiver with versioned consent reset, required-field submission gating, fictional completion and reset. Browser memory only; reload clears all. Not integrated into the public sample registration/creation draft, not an identity verifier, not a stored legal consent record. Academy membership/role forms remain a separate module.

### Sponsors delivered as local placement preview
Optional fictional sponsor add, name/group/HTTPS website/demo initials, review before local save, edit, visibility, ordering, removal confirmation/cancel and footer preview/empty state. No real brand images, upload, endorsement, external navigation or public-page mutation. Unsaved panel memory clears on navigation/reload. Academy sponsors remain separate. Organization settings, tournament Basic/Events/Venues/Publish/Finance and richer participant/fixture controls remain required next work; these four panels do not imply completion of the full screenshot system.

### Tournament workspace settings / local first pass
Basic/Events/Venues/Publish-Share tabs share a local session draft, separate from the creation wizard and other fee/role/form/sponsor samples. Includes timeline ordering, contact/location fields, event settings, venue CRUD, preview publication gate/cancel/confirm, championship mode lock after simulated first application, inert share-message preview. Preserves light electric-matchday direction. Deliberately missing rich-text engine, real banners, multi-row structured other/social information editor, full sports catalog, public links/embed and persisted publication revisions. Post-publication edits are marked unpublished and do not update a real snapshot. These are scope gaps, not parity claims. Participant finalization/fixtures remain next.

### Participants / fixtures / WTT-inspired connected draw
- Shared workspace roster by division: fictional labels/contingents, simple CSV paste preview/confirm/cancel, case-insensitive duplicate and capacity checks, pending/accepted/rejected, export. No live identity merging, eligibility or payment inference.
- Accepted-roster review/finalize/cancel locks editing. Explicit reopen clears the division fixtures. Division configuration edits invalidate all fixture/finalization drafts.
- Real local fixture generation for single elimination (byes advance, n-1 matches), round robin, groups plus cross-seeded knockout, custom pairings. Double elimination explicitly blocked pending a verified engine.
- Compatible venue/resource + date/time/duration/turnaround review. Conservative sequential single-resource scheduling only; no cross-division or event timeline conflict certification. Venue and timing edits invalidate schedule review. CSV exports escape spreadsheet formula prefixes.
- Points configuration review for win/loss/draw/no-result, basic standings column preference, filter/card/list/round labels. No computed standings without results, variable victory points/custom metrics not yet implemented.
- WTT reference visual translated to navy/lime: connected left-to-right 8/16/32/64-entry bracket, round headers through final, seeded fictional cards, inline SVG sample-country flags (not broken emoji), per-match demo day/time, winner highlights and Match Centre modal with set and game scores. Completed/Scheduled/Draws and five singles/doubles category toggles. Horizontal scrolling on mobile with explicit score-table hint, Escape/close and focus restore.
- Important: connected draw specimen is separate fictional table-tennis data, not the organizer-generated roster. Real calendar dates, avatars, advancement/results editing, double elimination, bracket-from-roster, full import-file parser, custom metrics, public embedding and persistent linkage remain scope gaps, not claimed complete.
- Tests: fixture properties for every n=2..64, unique round-robin pairs, group cross seeds, unsupported/duplicate rejection; browser import/finalize/reopen/timing invalidation/64-entry tree/category/status/modal at 1440/390/320 without API calls, page errors or document overflow. Pixel checks: 64 draw desktop/mobile, score modal mobile, roster 320. Fixed missing flag glyphs and low-contrast eyebrow after first inspection.
