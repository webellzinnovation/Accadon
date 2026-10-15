# Organizer settings implementation status

Required scope from supplied Playinga settings screenshots and the user's correction, 15 October 2026. Preserve Accadon's light theme and static workflow-first approach.

## First slice: implemented

`/organizer/settings` and static `#/organizer/settings`, linked from the creation page. Payments configuration with collection on/off, offline method or explicitly disconnected online gateway, INR, optional once-per-registration tournament fee, independent sample division fees, fixed early-bird discounts/deadlines, illustrative separate tax, voluntary donation and extra-charge descriptions. Transparent sample entrant total and local review marker. Review resets when configuration changes.

No persistence, collection, payment status, receipt, gateway, tax recommendation or automatic eligibility check. Categories are fictional standalone settings examples, not persisted or synchronized with the unsaved creation wizard. This boundary is deliberate for the first slice. Review total handles once-only charges without duplication. Financial terms and legal handling require confirmation before live activation.

## Following required slices

- Custom roles and permission matrix with sport/division scope, existing sample people, separate scoring and certification, local review only.
- Contingent/common and division forms, waiver/terms version and registration enforcement policy. No real personal information.
- Optional sponsor editor with explicit empty state, safe sample assets and local placement preview.

The remaining tabs are visibly labeled next build slices, not working editors or optional scope.

## Verification

Build/typecheck; 31 unit/API tests; fee configuration interaction test at 1440, 390 and 320 pixels; organizer regression at the same widths. No API requests in either demo interaction test. Actual form and total pixels inspected on desktop and mobile, with no cropped text or overlapping controls. Existing Vite large-chunk advisory remains.
