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
