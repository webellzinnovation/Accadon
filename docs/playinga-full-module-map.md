# Full screenshot-driven module map

15 October 2026. Scope is all supplied features and their workflows, not settings shells. Current implementation is incremental and demo-only. This map separates observed screens from still-unseen workflow details.

## Personal player workspace (five supplied profile screens)

- Header: avatar, display identity, age/city, sports and challenge entry point. Use fictional data; do not import the pictured person's details into a public demo.
- Tabs: Home, Statistics, Friends, Teams, Matches, Tournaments, Gallery, Clubs, Payments, Settings.
- Home: posts, New Post, quick create club/tournament/match/team, quick-setup sports/photo/friend checklist.
- Friends: empty state and Add Friends.
- Matches: upcoming/past and Match Challenge.
- Tournaments: upcoming/past, filters, organizer/date/location cards and View; ownership/draft badge distinct from participation.
- Clubs: list/counts, admin identity badge, View Club and create/filter.
- Internal friend invitation, challenge negotiation, team creation, profile edit, privacy and payment workflows are required but not shown by this batch. Do not infer their exact schema from an entry button.
- Guardian-controlled child identity remains distinct from an adult social account. Public age/location, discoverability, messaging and friend requests need privacy and minor safeguards before live use.

## Academy public website and operational workspace (five club screens)

- Branded club navigation: Home, News, Members, Teams, Schedule, Tournaments, Settings, More, Features. Public tournament/team sections and club contact/address footer. Public vs admin-only audience must be explicit.
- Members: search, field filters, All/Contacts/Leads/Administrator/Staff; statuses Members/Applied/Invite Accepted/Invited/Rejected/Retired/Leads; role/plan/contact columns, member details, selection, Add Members, Send Emails, Export and pagination.
- Required workflow path: add/invite/application → review/accept/reject → active role/plan → retire; keep invitation acceptance distinct from membership approval. Sending and exports need audience/field review; screenshots do not authorize real messages or disclose member details.
- News: Add News, card/list content, categories News/Announcement/Uncategorized and tags. Draft/edit/preview/publish lifecycle needs explicit audience, not automatic publication.
- Information: club name/short name, contact email/number, language, club URL; organization and billing addresses separately, maps/location selection; GST treatment and number. Do not copy pictured addresses or tax values as defaults or treat their accuracy as verified.
- Website Builder: Branding & Theming, Page Builder, Navigation, Sponsors, White-Label & Custom Domain, Categories & Tags. Observed branding fields: desktop/tablet/mobile logos, favicon, club-name and tagline display toggles, theme primary/secondary colors. Branding settings must not alter Accadon's locked platform logo.
- Builder subtab names establish scope; unseen internal page editor/domain/publish flows await further screenshots. Custom domains need owner verification before live activation.

## Academy settings

See `academy-settings-scope.md` for all ten settings modules and Communication SMTP/history/credit controls. Billing, credits, academy dues and tournament fees remain distinct.

## Tournament workspace

See `playinga-organizer-reference.md` and `organizer-settings-progress.md`. Creation/draw/resources/officials precede fee and role settings. Forms/waivers and sponsors are the next required functional demo slices.

## Implementation rule

For each module deliver a usable local start → configure/act → review → state change → correction/revoke/reset workflow, with honest empty states, mobile verification and no false live effects. A visible tab alone is not feature completion. Remaining screenshots refine details without discarding existing Accadon family, membership, sport or allocation rules. Real authentication/backend/collection/sending stays paused pending requirement review.

## Additional settings detail: batches 4–5

- Academy Forms & Controls: membership/staff/team membership form templates, view/edit/new; system fields (gender, DOB, nationality, address, phone and guardian fields), custom fields, photo, guardian application mode; configurable terms and waivers. Team-wide consistent registration-form toggle. Template IDs in screenshots are competitor records, not Accadon identifiers.
- Members & Plans: create/edit membership plan, active/default states and pause new membership registration. Enforce one active default in Accadon; pausing new applications must not retire existing members. Fee cadence, renewal and paid-plan editor details are not shown.
- Academy roles: Administrator/Coach/Staff list, new/edit; role-to-form binding. Permission groups cover organization information/branding/pages/navigation/sponsors/roles/sports/fields/templates; finance credits/payments; members view/manage/plans/assignment; teams create/manage/view/apply/add people; matches schedule/manage/view/apply/add; tournaments create/manage/view/apply/add; statistics; chat/news CRUD; venues/courts CRUD and bookings. Academy rights remain separate from event match allocations and financial authority.
- Sports Configuration: selected academy sports, add dropdown, remove and save. Removal with existing memberships/events needs dependency handling, never silent data loss.
- Plans & Payments: academy's own platform subscription with dates/status/upgrade and invoices. Lower implementation priority than core workflows. Not the academy's member plans, event fees or credit ledger; no competitor prices, 9999 dates or entitlements become Accadon promises.

## Tournament detail: batches 6a–7b

Required screenshot-driven workflow coverage (sample screenshot people/contact details are not seed data):
- Create: name, rich about, start/end/registration deadline, contact, address, multi-sport selector. Per-category name/gender/born-after/participant type/team-play switch/add/remove. Championship contingent mode with published-and-applications lock. Wider sport catalog shown; existing five sports are not full catalog parity.
- Workspace header branding/organizer/message; Home, Participants, Schedule, Standings, Winners, Statistics, Gallery, Settings and Finance. Home information cards, add card, posts. Draft/publish state.
- Participants: add/import, division filter, club/contingent grouping, applied-by/date/status/unpaid, details, actions, exports and email composer preview. Finalize gate before saved fixture. No real sends or paid statuses.
- Schedule setup: single/double knockout, groups/playoffs, round robin, custom fixture; participant count; venue/courts; standings and participant-score configuration. Sample-vs-finalized schedule distinction.
- Points settings: variable convincing/normal/marginal victory points, win/loss, custom points, draw/no-result; table column toggles for matches/played/wins/losses/ties/no-result/sets/points/sub-points/recent form/difference; extra metric name/short-name. Save/cancel and resulting standings should demonstrate the workflow. No federation compliance implied.
- Match view: timezone, date/time/resource, per-set scores/winner, actions; card/list, player filter/grouping; configurations, schedule export/embed.
- Standings/winners: empty and completed states, winner podium/banner, division ranking and manual reorder with review, contingent medal counts, CSV export/embed previews; winner/runner/third by division/sport/format. No arbitrary third place when format does not establish it.
- Basic Settings: information/about; created/start/end/deadline date+time; contact; structured address; extra title/name/detail rows; website and social URLs; banner add/remove; color controls; tournament type, admin-chat toggle, review/save. Preserve canonical Accadon logo despite event branding controls.
- Events: sport team-play; division name/format/capacity/gender/participant-type/birth cutoff/hide; statistics, player-score submissions, public participant visibility with finalization gate; championship mode/title sequence and irreversible-state rehearsal. Competitor paid-feature note is not an Accadon price/entitlement.
- Remaining settings sidebar: venues, payments, sponsors, roles, forms and publish/share. Existing local fee/role/form panels are partial slices, not all system completion.

Source batch inventory totals 42 unique screens per parent; two original screens are not available. Unseen editors, menus and exact business rules remain explicitly unverified, not inferred competitor behavior.
