# ACCADON Product Spec (consolidated, build-ready)
Version 1, 15 Oct 2026. Merges: Playinga research v2 (public pages + hands-on walkthrough of a free account), the user's own requirements, and what the live app already has.
Source for "already built": live app https://webellzinnovation.github.io/Accadon/#/organizer/settings and #/academy (module lists read 15 Oct). IMPORTANT: every built module is a front-end rehearsal with session-only fictional data (reload resets). No real login, database, payment, messaging, or publication exists yet. So "Built (UI)" below means screen and local logic exist; "New" means nothing exists; "Backend" means the real persistence/integration is still to build for everything.

## 0. Product stance
- Table-tennis-first, multi-sport capable (academies run several sports).
- Business model: tournaments free as the hook (communities first, then schools), coaching side paid subscription, each academy uses its own payment gateway. Organizers can still charge entry fees (free tools do not mean free entry).
- Differentiators vs Playinga: parent/kid accounts, match journal, courses, multi-academy super admin, group head-to-head crosstable, free-tier that includes forms, fees, live scoring, sponsors (Playinga paywalls these at $19/event; free = 2 categories, 32 per category).
- Status keys: B = built (UI/local), P = partial, N = new. Priority: P0 first usable release, P1 next, P2 later.

## 1. Structure
Organizer workspace (12 modules, exist): 01 Basic Settings, 02 Events, 03 Venues, 04 Publish / Share, 05 Participants, 06 Schedule, 07 Standings, 08 Winners, 09 Payments, 10 Roles & permissions, 11 Forms & waivers, 12 Sponsors.
Academy space (7 sections, exist): Overview, Members, News, Information, Website Builder, Members & Plans, Sports Configuration. (Entry link to the tournament workspace exists.)
NEW modules/areas needed (flagged N-mod):
- N-A Live Scoring & Match Centre console (scorer UI, QR scorer, hall display). Match Centre read view exists inside 06; scorer console does not.
- N-B Players & Families (accounts: parent, kid, player profile, stats). 
- N-C Match Journal.
- N-D Courses (course > lesson > chapter).
- N-E Communications (email/WhatsApp/push templates, notifications).
- N-F Super Admin (multi-academy) console.
- N-G Public site pages: tournament microsite, academy site, discovery/search (landing exists, microsite per event new).
- N-H Platform: auth, billing/plans, audit, mobile apps.
- N-I Community feed and gallery (light).
- N-J Reports and exports hub (some exports exist per module).

## 2. Feature inventory
Format: ID | feature | Playinga source | module | status | pri | notes

### 2.1 Accounts, roles, onboarding
A1 | Sign up / sign in (email/phone OTP) | yes | N-H | N | P0 | needed for everything real
A2 | Player profile: name, DOB*, gender*, nationality, language, bio, socials, contact, address, sports, photo | yes (Settings > Information) | N-B | N | P0 | DOB drives age categories
A3 | Parent account with multiple kids; membership = child x academy x sport; parent contact never merges siblings | NO (Accadon-only) | N-B / Academy Members | P (rule exists in Academy Members text) | P0 | one login, kid switcher, one checkout for siblings
A4 | Kid login (restricted, optional, parent-controlled) | no | N-B | N | P1 | consent and safety rules
A5 | Guardian consent capture with timestamp (rehearsal exists) | partial (waivers) | Academy Members, 11 | P | P0 | real record needed for minors
A6 | Roles: Super admin, Academy admin, Coach, Staff, Referee/Scorer, Parent, Player, Public; custom roles; built-in Administrator/Participant/Public with View&Edit | yes | 10 | P (local custom roles) | P0 | add capability matrix per module
A7 | Quick Setup checklist on first login (sports, photo, invite friends, form teams, search tournaments) | yes | N-B | N | P1 |
A8 | Privacy settings, preferences, email templates per user | yes | N-B/N-E | N | P1 |
A9 | Invite by email, WhatsApp, QR | yes (clubs) | Academy Members | P (invite states exist) | P0 |
A10 | Credits balance in header | yes | N-H | N | P2 | skip unless needed

### 2.2 Academy / club space (Playinga club + Accadon academy)
C1 | Academy profile: name, branding, info | yes | Academy Information, Website Builder | B | P0 |
C2 | Members list with statuses Lead, Invited, Invite Accepted, Applied, Member, Rejected, Retired; search; select; export | partial | Academy Members | B | P0 |
C3 | Add member/lead/invitation with sport, role (Member/Staff/Coach), plan, consent rehearsal, review gate | yes | Academy Members | B | P0 |
C4 | Preview/send email to selection (dedupe guardians, consent check) | yes | Academy Members + N-E | P (inert preview) | P0 | real delivery N
C5 | Membership plans, default plan, pause intake, disable-plan guard | yes (membership) | Members & Plans | B | P0 | real billing N
C6 | News/announcements with publish preview | yes | News | B | P0 |
C7 | Website builder: templates, branding, custom domain, auto-synced results | yes | Website Builder | P (branding) | P1 | custom domain N
C8 | Sports configuration per academy | yes (1 sport free, 50+ pro) | Sports Configuration | B | P0 | no sport cap on free
C9 | Teams: roster, schedule, team stats, team chat, team microsite, join team | yes | N-B (Teams) | N | P1 | TT team events
C10 | Events calendar | yes | Academy Overview / N | N | P1 |
C11 | Finance: payments, invoices, reports, credits | yes (Pro) | 09 + Academy finances | P (09 config only) | P1 |
C12 | Live streaming studio to YouTube | yes | N-G | N | P2 |
C13 | Reports/insights, growth analytics | yes | N-J | N | P2 |
C14 | Venue booking portal (courts, pricing, hours) as add-on | yes ($10/court/month) | 03 + N | N | P2 | Accadon: TT tables, hall booking later
C16 | MAP: academy registration picks location on a map (search + draggable pin, address auto-filled, lat/long saved) = L2 | Academy Information | N | P0 |
C15 | Academy rights separate from tournament match allocation | Accadon rule | Academy | B (stated) | P0 |

### 2.3 Tournament setup (organizer modules 01-04)
T1 | Create tournament, ONE page: name, rich-text about, start/end/registration-due dates, contact name/number/email, address autocomplete+map, sport, championship toggle | yes | 01 Basic Settings | P | P0 | defaults to copy: start +2 days 12:00 AM, end start+6 days 11:59 PM, reg due start-1 day 11:59 PM; contact defaults from account
T2 | Draft by default; Publish / Switch to Draft; Delete (irreversible, warns) | yes | 04 Publish / Share | B | P0 | add publish checklist (dates, one category, venue, contact)
T3 | Lock timelines to all categories toggle (default on) | yes | 01/02 | N | P0 |
T4 | Other contacts (title, name, detail), chat-with-admin preference | yes | 01 | N | P1 |
T5 | Share link, SEO URL, embeddable widgets (schedule, standings, results, bracket) | yes (widgets paid) | 04 | P (Share) | P0/P1 | widgets free
T6 | Tournament branding: logo, banner, primary/secondary/registration-button colours, socials | yes | 01/Website | P | P1 | uses Accadon design kit themes
T7 | Home dashboard: stepper Registration > Schedule Generated > Scoring > Results Published; stats; posts, cards, folders/files | yes | N-G / 01 | N | P1 |
T8 | Championship (contingent) tournaments, multi-sport | yes | 02 Events | N | P2 | inter-academy trophy
T9 | Tournament templates (open, league, inter-academy, junior ranking) | no | 01 | N | P1 | Accadon add
T10 | Onboarding offer: schedule a free call | yes | N-H | N | P2 |

### 2.4 Events / categories (module 02)
E1 | Category: name, participant type (Singles/Doubles/Team, locked after creation), gender, born before/after date, schedule format, hide, team-play toggle | yes | 02 Events | B (5 categories in sample) | P0 |
E2 | Per-category: rules, prize info, own timeline unless locked | yes | 02 | P | P0 |
E3 | Max participants, min/max players per team, age cutoff by calendar year | yes | 02 | P | P0 |
E4 | TT age band templates U9/U11/U13/U15/U19, Veterans, rating-gated categories | no | 02 | N | P0 | Accadon add
E5 | Registration settings: self-applications only vs on behalf; open/close registration per category | yes | 02/05 | P | P0 |
E6 | Participant scoring enable + approval modes: admin approval, publish directly, admin/opponent approval | yes | 02 + N-A | N | P0 | add coach option P1
E7 | Capture statistics on/off | yes | 02 | N | P1 |
E8 | Guest registration without sign-up (no profile stats) | yes | 02 | N | P1 |
E9 | Registration notes, terms of service, waivers (rich text + checkbox) | yes | 11 Forms & waivers | B (rehearsal) | P0 |
E10 | Copy settings across categories | partial | 02 | N | P1 |

### 2.5 Registration and participants (module 05, 11)
R1 | Player self-registration: Register Now, pick category (multi), partner for doubles, team for team events, review, pay | yes (3-step progress) | 05 + public | P | P0 | steps 2-3 of Playinga not directly seen; build as: category, details/form, review+pay
R2 | Doubles partner from friends or invite by name+email | yes | 05 | N | P0 |
R3 | Parent registers child(ren), sibling bundle | no | 05 + N-B | N | P0 |
R4 | Registration form builder (custom fields per category, document upload, file downloads) | yes (Pro) | 11 | P | P0 | free in Accadon
R5 | Withdraw / edit application | yes | 05 | N | P0 |
R6 | Pipeline: Draft, Open, Accepted, Rejected; accept/reject; finalize/lock roster | yes | 05 | B | P0 |
R7 | Admin add participants (pick user or name+email) | yes | 05 | B | P0 |
R8 | Bulk Update Status, Copy/Move participants, CSV import, table/card view, display options, export | yes / partial | 05 | B (CSV import, roster) | P0 |
R9 | Waitlist with auto-promote on withdrawal | no | 05 | N | P1 |
R10 | Seed number / rating per participant | yes (seeds) | 05/06 | P | P0 |
R11 | Check-in on match day (Pro) | yes | 05 + N-A | N | P1 |
R12 | Organizer-to-participant chat | yes (Pro) | N-E | N | P2 |
R13 | Send emails with templates and placeholders; schedule-change notices | yes | N-E | N | P1 |

### 2.6 Payments (module 09)
Y1 | Collection toggle, method (Offline / Online gateway), currency INR, offline types cash/cheque/bank/other; declarations need reconciliation | yes | 09 | B (config preview) | P0 |
Y2 | Tournament-level entry fee plus division fees, extra charges, donations/add-ons | yes | 09 | B | P0 |
Y3 | Early-bird (fixed amount per division, capped) and late fee | yes | 09 | B (early-bird) | P0 | add deadline automation P1
Y4 | Tax tracked separately (GST) | yes | 09 | B (config) | P1 |
Y5 | Online gateway Razorpay (and Stripe) per academy, auto-settlement to bank | yes | 09 | N | P0 | bank details private
Y6 | Convenience fee: absorb / pass on / 50-50 split | yes | 09 | N | P1 |
Y7 | Offline payments tracking and reconciliation view | yes | 09 | P | P0 |
Y8 | Refunds, cancellations, withdrawal policy | NOT visible at Playinga | 09 | N | P1 | Accadon add
Y9 | Finances tab: payments received, invoices, reports | yes | 09 / N-J | N | P1 |
Y10 | Plans: free tournaments, paid coaching subscription, platform billing | Playinga per-tournament $19 | N-H | N | P1 | Accadon: free tournaments, subscription for coaching

### 2.7 Venues (module 03)
V1 | (see 2.16 for map) Venue with courts (TT tables); search my/find venues; selected venues; create venue; counters; at least one venue required | yes | 03 | B | P0 |
V4 | MAP: adding a new venue uses the map picker; venue saved with coordinates in the academy's reusable venue library = L3, L5 | 03 Venues | N | P0 (library P1) |
V2 | Table numbering, table availability per session | no | 03 | P | P0 |
V3 | Venue directory/discovery | yes | N-G | N | P1 |

### 2.8 Formats, draws, schedule (module 06)
S1 | Formats: single elimination (to 128, byes, seeds), double elimination, round robin (multi-round, cap matches), groups + playoffs (qualifiers per group, pre-set bracket slots), custom fixtures, team ties | yes | 06 | P (connected draw R64-Final, groups) | P0 | verify which formats built vs planned; DE and team ties likely N
S2 | Stages (+ Stage) multi-stage | yes | 06 | P | P0 |
S3 | Third-place match | yes | 06 | N | P1 |
S4 | Seeding, manual placement, randomization, byes, display options | yes | 06 | P | P0 | rating-based seeding and same-academy separation (add)
S5 | Reset schedule | yes | 06 | N | P1 |
S6 | Views: table, calendar, bracket; saved views (All, My, Today); filters by date, participant, venue, court; group by; sort | yes | 06 | P (bracket, lists) | P0 |
S7 | Visual scheduler drag-drop, multi-day multi-venue, conflict check (rest time) | yes | 06 | N | P1 |
S8 | Auto-assign tables and time slots | yes (slots) | 06 | N | P1 |
S9 | Edit match: date/time, venue, players | yes | 06 | N | P0 |
S10 | Next-round prefill / KO propagation | yes | 06 | B (gates verified) | P0 |
S11 | Called-to-table queue, hall display | no | N-A | N | P1 | Accadon add
S12 | Exports: schedule PDF/CSV, scoresheets PDF | yes | 06 | N | P1 |
S13 | Free public bracket generator (no sign-up) | yes (acquisition) | N-G | N | P2 |
S14 | Match card: round pill, date/time, players with seeds/flags, game scores, winner marks | yes | 06 Match Centre | B (WTT-style) | P0 |

### 2.9 Scoring (N-A, plus Match Centre in 06)
G1 | Match Centre view: big score, venue/table, player rows, per-game boxes | yes | 06 | B | P0 |
G2 | Live scorer: +/- per side, timer, switch sides, undo last point, reset, proceed to publish | yes | N-A | N | P0 |
G3 | Basic scoring: choose best of 3/5/7, enter per-game points, save, edit, publish with confirm | yes | N-A / 06 results desk | P (results desk records results with review gates) | P0 |
G4 | TT rules engine: 11 points win by 2, serve rotation, deciding-game side switch at 5, timeouts, walkover/retired | engine yes, TT detail no | N-A | N | P0 |
G5 | Scorer QR/link (volunteer scores without account) | yes | N-A | N | P0 |
G6 | Participant scoring approvals | yes | N-A | N | P0 |
G7 | Undo score after results declared | yes | 06/N-A | P | P0 |
G8 | Match notes, match documents, gallery per match | yes | N-A | N | P1 |
G9 | Point-by-point log feeding journal and stats | no | N-A/N-C | N | P1 |
G10 | Standalone practice/friendly matches with same scoring | yes | N-A/N-B | N | P1 |
G11 | Match challenge between players | yes | N-B | N | P2 |
G12 | Publish to feeds (player, opponent, friends) | yes | N-I | N | P2 |
G13 | Results page with embed | yes | 08 | B | P0 |

### 2.10 Standings, tie-breaks, winners (modules 07, 08)
D1 | Standings table (Pos, player, TM, PL, W, L, P) | yes | 07 | B | P0 |
D2 | Points by win type (win 2, loss 0, tie 1, no result 1), variable victory points | yes | 07 | B | P0 |
D3 | Extra custom metric columns (e.g., Spirit points), bonus/malus with note | yes | 07 | B (extra metric) | P1 |
D4 | Tie-break builder drag-drop, parameters: matches lost, tied, set points scored/conceded, sub-points, set points difference, head to head; defaults Match Points > Sets Won > Sets Lost > Matches Won > Matches Played; apply to all categories | yes | 07 | N (current: "no automatic tie-break certification") | P0 | TT defaults: match points, H2H among tied, game diff, point diff; show reason per row
D5 | Table config, reorder columns, manual position reorder | yes | 07 | N | P1 |
D6 | Group head-to-head crosstable: matrix with rating/seed rows, blocked diagonal, W/L chips, per-game scores, W-L and Place, popup from Group standings, sticky player column, mobile scroll | NO (Accadon-only) | 07 + kit | B (kit design-system page) | P0 | wire to real data; this is the headline edge
D7 | Statistics: counters, charts, download PNG/SVG/CSV, player stats table | yes | 07/N-J | N | P1 |
D8 | Winners/podium with manual reason | yes | 08 | B | P0 |
D9 | Export standings PDF/CSV | yes | 07 | B (CSV) | P0 |
D10 | Certificates and result sheets auto-generated | no | 08 | N | P1 | Accadon add
D11 | Rating points / ranking system from results | no | N-B | N | P1 | seeding input

### 2.11 Sponsors, branding, public pages (module 12, N-G)
B1 | Sponsors: add with logo+link, categories, placement | yes (Pro) | 12 | B (local placement) | P0 | free in Accadon; tiers P1
B2 | Tournament microsite: banner, colours, cards/carousel, folders/files, posts, SEO, ad-free, mobile friendly | yes | N-G | N | P0 |
B3 | Slideshow and TV scoreboard (Playinga: Coming Soon) | partial | N-A | N | P1 |
B4 | Gallery with auto albums per match, tagging | yes | N-I | N | P2 |
B7 | MAP: public tournament and academy pages show an embedded map with pin, address, directions link; schedule shows venue per match = L6 | N-G | N | P0 |
B5 | Search tournaments by name | yes | N-G | N | P0 |
B6 | Dark/light theme switch | yes | kit | P | P2 |

### 2.12 Social and community
O1 | Activity feed: posts, comments, polls, media | yes | N-I | N | P2 | keep academy-scoped
O2 | Friends, add/manage, find people at your level | yes | N-B | N | P2 | defer; kids safety
O3 | Notifications bell and chat | yes | N-E | N | P1 |
O4 | Next-match widget with countdown on home | yes | N-B | N | P0 |
O5 | Player stats profile: aggregated by sport, analyzer, achievements | yes | N-B | N | P1 |
O6 | Communities first, then schools: community org type (open clubs) and school org type with house/class grouping, school-vs-school events | Accadon | Academy Information + N-F | N | P1 |

### 2.13 Accadon-only modules
J1 Match Journal (N-C): player/parent logs tournaments (name, date, optional venue) and matches (optional opponent, round/league dropdown, best-of, both scores); pre-match plan; post-match review (strengths, weaknesses); coach can view and add; stats: experience (matches/sets), win ratio, points, derived "probability ratio" and "fighting ratio". P1. Open question: the "select the opponent number based for the next player" phrase is still unclear; ask the user.
J2 Auto-fill journal from tournament results when a player plays in Accadon events. P1.
K1 Courses (N-D): course > lesson > chapter, created by coach or admin; progress per student, visible to parent. P1.

K2 Parent dashboards (all kids), player dashboard, coach dashboard (students, journal notes, courses), admin dashboard. P0 for parent/admin, P1 others.
M1 Super Admin (N-F): create/control many academies, plans, platform settings, free tier then gateway, analytics. P1.
M2 Sports page with 3D models (low/high quality) and pricing: scope unclear, ask the user. P2.
M3 Features quotation for academies (placeholder prices drafted 10-13; parent login added). Sales artifact, not product.

### 2.14 Communications (N-E)
N1 Email templates with placeholders, bulk email, own SMTP optional | yes | P1
N2 WhatsApp notifications to parents (India-first) | no | P1
N3 Push notifications, in-app bell | yes | P1
N4 Schedule-change and result notices to affected players only | yes | P1
N5 Consent and dedupe rules before any real send (already stated in app) | Accadon | P0

### 2.15 Platform
H1 Auth, multi-tenant data model, audit log | N | P0
H2 Responsive web (already tested 390 and 320) | B | P0
H3 Android + iOS apps (iOS via cloud Mac builders; scorer-first mode) | Playinga has both | N | P1
H4 Plans/billing for coaching subscription | N | P1
H5 Support: help center, ticket, chat | yes | N | P2
H6 Design system: purple-major kit, themed scrollbars, popup modals | B | done (reapply to all pages after approval)



### 2.16 Location and map (added 15 Oct on user request)
What Playinga does (seen live): address fields use "Type & Choose From Dropdown" autocomplete with a map-picker icon button next to the field (create tournament, tournament Information, Venue search "Location", player/club addresses). The saved tournament stores structured address (line 1, city, state, country, pin) plus coordinates; the public page shows the address as a link opening Google Maps directions to the stored lat/long. Venue modal: search by name and location, create new venue, courts counted per venue. Not seen: drop-a-pin on an inline map, nearby-venue search, per-venue public page. The map picker popup itself was not opened.
Accadon version:
L1 | Map picker component: search box with address autocomplete, inline map, draggable pin, "use my current location", reverse-geocoded address fills line 1/city/state/country/pin (editable), stores lat/long | N | P0 | one shared component
L2 | Academy registration: location step with map picker (required), saved on academy profile | Academy Information | N | P0 |
L3 | Tournament venue: "Create new venue" form uses map picker; venue saves name, address, lat/long, tables count, notes, entrance/parking hint | 03 Venues | N | P0 |
L4 | Tournament address (01 Basic Settings) uses map picker; defaults to chosen venue location when venue is added | 01 + 03 | N | P0 |
L5 | Saved venue locations: academy "My venues" library reused across tournaments; community venue directory searchable | 03 | N | P1 |
L6 | Public display: tournament and academy pages show embedded map with pin, address, "Get directions" link (Google Maps/Apple Maps deep link), venue name per match in schedule | N-G | N | P0 |
L7 | Find tournaments/academies near me (distance sort, city filter) | N-G | N | P1 | communities-first discovery
L8 | Multi-venue tournaments: each match shows venue and table; map lists all venues | 03/06 | N | P1 |
L9 | Privacy: academy/home-based venues can hide exact pin (show area only) until a player is accepted | 03 | N | P1 | child-safety
L10 | Provider choice: Google Maps Places or open alternative (Mapbox / OpenStreetMap with Nominatim); needs API key and usage billing; pick before build | N-H | N | P0 decision |

## 3. Build order
Release 1 (usable tournament for a community): H1 auth, L1-L4/L6 map picker and public map, T1-T3 setup, E1-E5, R1-R8, V1, S1/S4/S6/S9/S10, G2-G7 live scoring + QR, D1/D2/D4/D6/D8/D9 standings with tie-break builder and crosstable, Y1-Y5/Y7 incl. Razorpay, B1/B2, A3/A5/A6 parent accounts and roles, N5.
Release 2 (academy value): journal, courses, parent/coach dashboards, teams, comms (WhatsApp), refunds, scheduler drag-drop, TV scoreboard, super admin, mobile apps.
Release 3: schools mode, social feed, gallery, venue booking, streaming, analytics.

## 4. Open questions for the user
1. "Opponent number" phrase in journal spec. 2. Sports/3D models/pricing page scope. 3. Whether tournament entry fees go through the academy's own gateway only. 4. Kid logins: age limit and parent approval rules. 5. Which formats beyond knockout/groups must ship in Release 1 (double elimination, team ties).

## 5. Known gaps in research
Playinga registration steps 2-3 and payment screen, Roles matrix detail, Points Config fields, Schedule Format option list, Visual Scheduler UI, native apps, and email templates were not directly seen (need a second account or a $19 Pro event). Built-status for formats beyond the knockout draw and groups was inferred from module descriptions, not tested; builder should confirm.
Playinga sources: playinga.com/en/tournament-management-software/, /pricing/, /solution/clubs/, /features/players/, /free-sports-scheduler/, help.playinga.com articles; hands-on walkthrough 15 Oct 2026. Accadon status: live app pages above.
