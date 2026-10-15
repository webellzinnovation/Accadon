# Playinga organizer reference

Screenshot review, 15 October 2026. Seven screenshots supplied through the user's conversation; no account access or settings changes performed. The public homepage https://playinga.com/ was fetched, but returned only a page title, not usable settings documentation. Findings below are observations of the supplied screenshots, not verified backend behavior or a complete product audit. No pricing, payment-settlement, security or reliability claim is made.

## What the screenshots show

| Area | Visible controls | Useful Accadon concept | What is not proved |
| --- | --- | --- | --- |
| Sponsors | Empty sponsor list, Add Sponsor | Optional organizer module, separate from urgent score content | Placement behavior, upload restrictions, sponsor approval or contracts |
| Payments | Fee collection toggle; offline Cash/Check method; INR; separate tax tracking; tournament-level entry fee toggle; division entry fee; early-bird setting/discount amount; donations/minimum/description; extra-charge toggle | Category-specific fee rules and a transparent total before entry | A working gateway, settlement, refunds, tax correctness, fee calculation order or actual collection |
| Roles | Administrator and Participant rows; sport/division scope; assigned people; Create New Role | Scoped capabilities attached to existing people, not global identity replacement | Server-side authorization, inheritance, audit, expiry or actual permission enforcement |
| Role editor | Tournament settings/branding; invite/accept/shortlist/reject vs finalize/delete participants; schedule generation/editing vs venue/slot management; match password vs publishing date/time/venue/scores | Separate high-impact permissions instead of one broad admin switch | Whether toggles are independent in execution or whether publishing also certifies results |
| Communication | Post/delete/view feeds; chat with participants | Audience-specific communication permissions independent of scoring | Moderation, guardian safeguards, consent, delivery or deletion behavior |
| Advanced forms | Contingent and division forms; category eligibility label; View & Edit Form; waiver/terms rich text; signup-to-register toggle | Tournament/common information plus category-specific fields; versioned consent and explicit registration policy | Actual form schema, validation, signatures, legal sufficiency, guardian authority or guest identity handling |

One entry-fee field visibly contains 250 and one donation field 1,000. These are screenshot settings only, not Playinga prices or proposed Accadon defaults. A visible age/birthdate label is event-specific, not an age-cutoff rule to reuse. A populated text editor does not establish enforceable consent.

## Required scope for Accadon

User correction after the screenshot handoff: "i have give entire system how i needed". Payments, roles, forms/waivers, registration enforcement and sponsors are required organizer scope. The priorities below are sequencing, not optional recommendations.

### First implementation slices

1. **Entry fee model per category.** Keep platform tournament tooling being free separate from an organizer charging an entrant fee. Model tournament fee, selected category fees, optional add-ons, discount eligibility/deadline, tax and final total as distinct lines. Decide multi-category caps, double-charging prevention, withdrawal/refund rules and online/offline reconciliation before any real collection. An offline payment declaration is not a paid receipt. Do not add a donations default or assume a tax treatment.
2. **Explicit role capabilities.** Existing umpire design already limits score entry to accepted match allocations. Extend the proposed capability map to entries, schedule, resource allocation, score entry, score submission, result certification, event settings, finance and communication. Keep edit, publish, certify and delete separate; no shared match-password model. Deny by default and recheck permissions server-side before live use. A custom role name alone grants nothing.
3. **Registration and consent requirements.** Reuse common parent contact and distinct child identity, then category-specific questions. State eligibility rules/cutoff dates independently of category names. Minimize data collection, version waiver/terms text and track guardian agreement for minors. Event-organizer legal review is required; do not copy competitor waiver wording. Guest registration vs account-required entry is a product choice still to confirm, not inherited from a screenshot.

### Following required settings

- Optional sponsor identity/logo/link plus owner preview and a clear placement policy. Do not push scores or match actions below advertising, imply endorsements or publish another party's logo without approval.
- Communication settings with a reviewed audience, guardian boundaries, delivery state and moderation/reporting rules. Scoring access never implies unrestricted chat with children or their parents.
- Custom form builder only after the initial fields and consent requirements are settled. Prefer a short mobile entry flow to a long all-purpose form.

## What to adopt and avoid

Adopt the settings organization, category-level configuration and separation of permissions. Preserve Accadon's locked brand, premium light theme, parent/child model and match-scoped umpire rights.

Avoid copying the dark skin, dense long modal, tiny text, shared match-password concept, bundled edit-and-publish score permission, prefilled waiver language, enabled donation defaults or implied guest-registration behavior. Screenshots show interface choices, not a security architecture to clone.

## Relationship to the current build

Current demo already covers sport-specific venue inventory, independent/shared category structures, complete match lists and draws, and optional allocation-scoped officials. At the initial reference checkpoint no runtime UI was added. The subsequent user correction makes fees, custom roles, forms/waivers, registration enforcement and sponsors required scope. The first fee-configuration demo is now implemented; the others remain queued, not silently dropped. Backend, real payment, messaging and account changes remain paused.

## Evidence map

- Sponsor screenshot: empty list and Add Sponsor.
- Payments screenshot: fee/tax/division/add-on controls.
- Roles list screenshot: role, sport/division scope and assigned people.
- First role-editor screenshot: scope/name/settings/participant permissions.
- Second role-editor screenshot: scheduling/scoring controls.
- Continued editor screenshot: feed/chat permissions.
- Advanced Forms screenshot: contingent/division forms, waiver/terms editors and enforce-signup option.

Screenshots remain reference evidence, not Accadon UI assets. No screenshot or account identity was embedded in the site.
