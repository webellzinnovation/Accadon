# StadiumTT: a professional tournament feel for Accadon

Design and workflow review, 15 October 2026.

## Recommendation

Adopt Stadium's competition-first hierarchy and information discipline, not its blue skin. Its strongest impression comes from a believable working tournament: real events, entrants, table allocations, group standings, round-by-round draws, score details and result-verification states all belong to one connected place. Accadon should feel like the tournament desk and public scoreboard of an academy, rather than a marketing page with a bracket illustration.

Keep Accadon's approved logo and colors. This is a reference review and proposed direction, not a claim that Accadon's current implementation has been audited or changed.

## Review scope and evidence

Inspected the public homepage, event directory, a current Austin league's overview/draws/matches, entry-management dialog and new-entry form, and a completed Westchester event's round robin and knockout. Inspected actual desktop and 390px-wide layouts. Opened the display-mode chooser. No personal data entered, entry submitted, score reported, payment made or account created.

The October 14 Austin event had published round robin groups, but its second draw was explicitly unpublished. To inspect a real knockout rather than infer one from marketing, this review used Westchester's completed October 2023 U/1000 draw. Historical examples establish interface behavior, not current tournament policies or fees.

### Evidence levels

- **Observed:** rendered public UI and interactions actually inspected.
- **Advertised:** a capability described on Stadium's homepage, not independently exercised end-to-end.
- **Proposed for Accadon:** a design or product recommendation, not a Stadium feature claim.

## What creates the professional impression

| Priority | Pattern | Why it works | Accadon direction |
|---|---|---|---|
| 1 | A public competition hub with task tabs | Draws, matches, people and event facts are connected, not separate decorative sections | One event shell with Overview, Draws, Matches, Players and appropriate Results/Teams views |
| 2 | Operational match cards | Score, table, stage and certification have a consistent place | Build one reusable match-card model across draw, schedule, player and live views |
| 3 | Explicit event and stage hierarchy | A league can contain dated events; an event can have RR and SE stages | Separate competition, category/event, stage, group, round and match identifiers |
| 4 | Dense but layered tables | Names, ratings, clubs, W-L and points fit without repeated paragraphs | Compact table rows with optional expanded metadata and an explanation of standings |
| 5 | A real entry route | Registration is near the event and exposes eligibility, selection and money summary | Show the entry path early; never fake a working payment or registration backend |
| 6 | Product imagery instead of generic sports stock | Desktop standings plus phone scoring make the product tangible | Use truthful Accadon workflow captures and clearly labeled demo data |

## 1. Page structure and navigation

### Observed

The homepage's upper region includes navigation for Events, Players and Clubs, followed by sponsorship/support material and a Live Events section. The marketing pitch and device screenshots follow. That ordering gives the site a sense that competitions already happen here.

The directory separates Tournaments and Leagues, offers Live/Upcoming/Past controls, keyword and location search, a result count, and consistent event cards. Cards establish date, event name and place before asking the visitor to enter anything.

The Austin competition shell uses Overview, Stats, Draws, Matches, Players and Teams tabs. Its Overview divides desktop space between event identity/venue/contact/general information and dated event cards. Each dated card has its own status, time, player count and Draws/Players shortcuts. On the historical Westchester event, categories include rating-banded, age-based and open events with fees, counts and eligibility labels.

### Adopt

- Make a tournament an addressable destination, not a modal detached from academy identity.
- Put name, sport, venue, organizer, date/time with timezone, status and primary action above the detailed content.
- Keep event category selection separate from navigation between Draws/Matches/Players.
- Preserve the chosen category/stage when switching views. Use shareable links that recover the same state.
- Give a live event a different primary action from an upcoming one: follow matches versus enter. A completed event should lead to results.
- Show genuine event counts, deadlines, capacity and eligibility. Use a clear empty state when no data exists.

### Avoid

Stadium's repeated sponsor strip and support banner consume considerable space before the competition content, especially on mobile. Borrow the trust of real organizer identity and real activity, not the amount of advertising. Do not invent partners, user counts or a Live label for a static demonstration.

## 2. Draws, groups and brackets

### Observed

Austin's draw screen has an event-date selector, stage buttons and grouped cards. Each card offers Standings and Matches, table allocations, lettered entrant positions, ratings/club metadata, W-L and points. The standings include a visible scoring explanation: win/loss/default points and a default marker. Westchester additionally shows placement markers and Explanation controls. These are useful clues that the standings are computed under a declared competition model.

Westchester's U/1000 draw has RR and SE selectors. Its knockout is a true multi-column layout: round of 16, quarterfinals, semifinals and final, with later matches vertically aligned between their feeders. Round buttons provide navigation. Individual cards show stage, certification, table or no-table state, two entrants and game-win totals. BYE and DEFAULT are explicit, not silently replaced with generic opponents. Expanding the final exposes game scores beneath the overall 3-0 result.

On mobile the knockout remains a wide stage layout with later columns extending beyond the initial view. It is not flattened into a tiny complete bracket. This preserves card size but needs navigation and orientation help.

### Adopt

- Render the real advancement graph from the tournament engine. Pool qualification, progressive placement, Swiss rounds and knockout are distinct structures.
- Use visible round headings and feeder edges or equally clear relationships. Do not rely solely on horizontal position to communicate progression.
- Offer a desktop bracket canvas and a mobile round-focused list with a clear route to the full bracket.
- Keep round/category headers available while navigating a long draw. Add a visible horizontal-pan cue if a wide canvas is used.
- Include group identity and physical table allocation together. A player should not need to visit a separate admin screen to discover where the group plays.
- Use compact summary rows; expand for game scores, detailed ratios, result history or player metadata.
- Label unpublished draws and unresolved qualifiers truthfully. Never fabricate the next-round entrant.

### Avoid

Do not copy the large blank spaces of a vertically expanded bracket without a fit-to-view or round-focused alternative. Do not make RR/SE abbreviations the only explanation for a first-time player. Do not copy a reference event's points formula as a universal TT rule: Accadon's earlier Indian-format research remains authoritative for the configured event, including approval gates.

## 3. Live scoring feel and result trust

### Observed

Stadium's Matches view offers filters for Event, Week, Day, Table, Player and Status, plus Show All. Match cards carry state labels including Not Submitted, Submitted (Unverified), and Certified. Text and icons accompany the colors. A share control appears on individual cards. Game totals use a strong left score rail; player names are the main row content and rating/affiliation sits above them.

An Entry Form and a separate Verify Access to Report Scores action are present on the overview. The homepage advertises smartphone self-reporting, live results and organizer certification. The homepage's phone image shows a score-entry workflow, but a scoring session and live update latency were not tested in this review. The public cards demonstrate result states, not point-by-point live coverage.

### Adopt

- Distinguish scheduled, called, in progress, submitted, disputed, certified and completed in the data model. Map only supported states to the UI.
- Show table, scheduled/called time, stage/group, participants and overall score in the same card.
- Make score submission and score certification different permissions and actions.
- Show game-by-game scores on demand; validate the actual configured best-of and scoring profile.
- Display a last-updated time, connection/offline status and stale-state treatment when real updates exist.
- Support deep links to a match and a player-filtered schedule.
- Mark all demo feeds as demo. A pulsing dot does not make a fixture live.

### Avoid

Never display an unplayed match as an ordinary 0-0 result without a scheduled/not-started label. Avoid announcing an unverified score as a final result. Do not claim real-time scoring from a static layout. Do not imply actual backend reliability, integrations or broadcast capability because the reference looks convincing.

## 4. Entry and registration flow

### Observed

Entry Form first opens a small dialog: manage an existing entry through search and date-of-birth verification, or Create a New Entry. The next form is a large desktop panel with three columns: player information, event selection, and review/submit. It explicitly allows continuing as a guest. It includes membership linking, identity/contact fields, home club, event eligibility/closed states, fee/total/balance summary, required-field notices and a disabled submission button until requirements are met.

At 390px, the form becomes a long single-column dialog. It fits the width, but many identity and membership fields come before event selection and review. That increases the distance to the information a new entrant may want first.

### Adopt

- Allow public discovery and schedule/results viewing without forced sign-in.
- Keep Enter and Manage my entry easy to distinguish.
- For mobile, prefer a clear progression: choose eligible categories, enter needed player details, review fees/consent, confirm. Keep progress and total visible.
- Explain eligibility before a disabled option; include cutoff dates, rating snapshot source and category limits.
- Reuse known participant data only under the proper permissions; preserve guardian/child distinctions where required.
- Review all fees, cancellation terms and final selected events before commitment.

### Avoid

Do not copy birthdate-based verification as an assumed sufficient security design. It was observed as a UI pattern, not security-audited. Do not collect addresses, sex, membership IDs or other details simply because the reference does; collect what the specific event needs. Do not pretend the submit route works until entry persistence, fee handling, receipts and organizer visibility are real.

## 5. Typography, color, spacing and density

### Observed

The competition UI uses Inter/sans-serif. Inspected computed styles show 13px table cells, 18px group headings, and small 10-11px uppercase controls/metadata. A dark navy/blue shell surrounds pale blue work areas and white cards. Thin rules separate rows. Strong filled buttons indicate selected stages; outlined alternatives remain recognizable. Scores use strong rectangular color blocks rather than a separate decorative badge for every number.

Desktop can show three group cards side by side. Mobile uses stacked cards while preserving the hierarchy of group, table, player and scores. Small tracking-heavy labels give an official score-sheet feel, but tiny muted text is a readability tradeoff.

### Accadon specification (proposed, not measured from Stadium)

- Use Accadon's existing type and brand palette; do not rebrand it blue.
- Use tabular numerals for scores, times and standings columns.
- Desktop match cards: roughly 280-360px wide, stable two-player row geometry. Mobile: full-width cards and minimum 44px interactive targets.
- Aim for 14-16px player names and readable metadata rather than reproducing 10px controls.
- Keep a small spacing scale: 8px internal gaps, 12-16px card padding, 20-24px between major groups. Tune against real long Indian names and club names.
- Use one primary action per context, quiet secondary links and clear selected states.
- Avoid color-only statuses, truncated player names without a way to reveal them, and excessive uppercase paragraph copy.

## 6. Imagery and motion

### Observed

The homepage uses overlapping desktop and phone product captures with a browser/device frame. The event overview uses the organizer's own club artwork. Sponsor logos provide social context. There is no need for a cinematic athlete hero to explain the product: standings and scoring UI do that job.

Sponsor/supporter strip positions changed between captures. No persistent CSS animation was detected in the inspected competition view at the moment checked. This is not a complete motion audit. Loading spinners and a blurred/dimmed modal backdrop were visible. No observed motion is necessary to understand the draw.

### Adopt / avoid

Use real product imagery and event/academy identity. The approved Accadon logo must remain exact, unstretched and unrecolored. If the score changes, a brief restrained highlight can explain what changed. Respect reduced motion. Avoid autoplay visual noise near scores, decorative scroll effects that delay navigation, sponsor marquees above urgent match information and unlabeled fictional product data.

## Specifically valuable for Indian TT tournaments

These are proposed adaptations, grounded in the combination of the observed interface and Accadon's earlier rules/format research:

1. **One meeting point for player, parent, coach and desk.** Public draw and result access; authenticated score/reporting actions only where permitted.
2. **Rating and affiliation as secondary identity.** Show the exact rating system and snapshot, not a bare number that mixes TTFI, world rankings and unrelated ratings.
3. **Category and stage separation.** U11/U13/etc., singles/doubles and team ties are not interchangeable tournament algorithms. A stage selector should not hide that distinction.
4. **Group standings plus explanation.** Explain applied mutual-result ratios and qualification, rather than copying a generic goal-difference or point-difference label.
5. **Table-centric operation.** Table assignments, call status and queue should be central on tournament day.
6. **Team tie drilldown.** A team aggregate needs individual rubber results and order, not just a singles-style two-name card.
7. **Doubles identity.** A pair is an entrant with two people, not one concatenated unsearchable name.
8. **Placement and consolation visibility.** Progressive classification branches must remain visible when an event determines places beyond champion/runner-up.

## Proposed first build slice

### P0: believable public tournament page

- Compact event identity/status header with genuine event metadata.
- Category selector, then Overview / Draws / Matches / Players / Results.
- Seeded demonstration data clearly marked as demo; truthful unpublished/empty/loading/error states.
- One group table and one knockout graph driven by structured data, not hand-positioned mock cards.
- Reusable match cards with table, state, overall score and expandable games.
- Filters for player, table and state; shareable category/match links.
- Mobile category/round navigation that does not require pinch-zoom.

### P1: operational participation

- Real registration and manage-entry workflow, eligibility validation and fee review.
- Role-bound score submission, organizer certification, dispute/correction log.
- Genuine update channel with freshness, reconnect and offline treatment.
- Accessible venue display board. Stadium's public display chooser was inspected, but its full output was not tested; treat this as a proposed feature, not a cloned verified workflow.

### Release checks

At 320px, 390px and desktop: verify long player/club names, unrated entrants, doubles pairs, byes, walkovers/defaults, pending qualifiers, unpublished draws, tied groups, delayed matches and offline updates. Test keyboard navigation, focus, contrast and status text. Confirm category/stage filters survive view switches. Confirm score correction does not silently advance the wrong entrant. Use the prior Indian-format approval gates for incomplete rules rather than inventing defaults.

## Extra lens: an active Accadon homepage

The user wants a live tournament ribbon near the header, a live-scoreboard hero, an active hub and academy promotion. Stadium supports this direction in part, but the distinction matters:

- **Observed on Stadium:** a Live Events section before the main marketing pitch, with an actual league card and a Browse All route. Its header-adjacent repeated strips contain sponsor logos and supporter names, not live match scores. This is an activity/trust treatment, not a scoreboard ribbon.
- **Not observed on Stadium's inspected homepage:** a live-scoreboard hero with updating match scores. Its hero/product proof uses static desktop/mobile screenshots. Do not cite Stadium as proof of a live-updating hero pattern.
- **Observed inside competitions:** reusable score cards, table labels, result states and expandable game scores provide a strong visual vocabulary for a scoreboard hero. Moving a small selection into Accadon's homepage is a proposed adaptation, not something Stadium was observed doing.
- **Flooks/Tourneymaker:** not re-inspected in this review. No new live-homepage claim is made about either reference.

### Recommended active-homepage composition for Accadon

1. **Near-header live ribbon:** one compact row with sport, tournament name, real state and a Follow link. If multiple real events exist, allow deliberate previous/next navigation or horizontal scrolling. Do not run an endless fast ticker or fake crowd counts. With no live event, show Next tournament and its actual date instead.
2. **Scoreboard hero:** brand message and a clear academy/organizer CTA beside two or three genuine match cards. Include stage, table, names, game-win score, state and freshness. A static build must say Demo scoreboard and must not pulse as though receiving live data. If the backend supplies only certified final results, label it Recent results rather than Live scores.
3. **Academy promotion:** an organizer/academy identity block beside or immediately after the scoreboard, with a real logo, location, upcoming event and View academy action. Do not interleave promotional cards into the draw or obscure the score. Sponsored placements must be identified.
4. **A useful busy hub:** below the hero, group activity into Live now, Upcoming entries and Recent results. Use counts only from real data. Add player/academy search and quick access to My matches where identity is available. Density should come from useful connected facts, not repeated banners or decorative widgets.
5. **Mobile:** show the current event and one complete match card before the academy promotion. Keep the primary Follow/Enter action visible. Avoid Stadium's large sponsor/support footprint above the actionable event content.

### What makes it feel alive without becoming noisy

Use current timestamps, real table calls, honest entry-open status and a small visible stream of meaningful changes. A restrained highlight on a changed score is enough. Preserve keyboard focus while updates arrive; pause auto-rotation on interaction; respect reduced motion; show disconnected/stale data plainly. Keep an explicit separation between point-by-point scores, game scores, submitted results and certified results. These are implementation acceptance criteria, not verified Stadium update behavior.

## Source ledger

All sources below are first-party pages. This is a named-site interface analysis, so broader review-site or community claims were not used.

1. Homepage and product screenshots: https://stadiumtt.com/ . Observed layout and product imagery; advertised scoring, registrations and integrations. Inspected 15 October 2026.
2. Event directory: https://stadiumtt.com/events . Observed event states, search and cards; Upcoming and Past views inspected.
3. Austin league overview: https://stadiumtt.com/tournament/19834ffc-49f1-4b3f-bb20-eee642e9c376 . Current multi-date league shell, entry routes and event details.
4. Austin October 14 draw: https://stadiumtt.com/tournament/19834ffc-49f1-4b3f-bb20-eee642e9c376/19834ffc-49f1-4b3f-bb20-eee642e9c376%7Coctober-14-2026#draws . Observed groups/table assignments/standings and unpublished second draw. The same competition's Matches tab supplied the status/filter evidence.
5. Westchester completed event: https://stadiumtt.com/tournament/0f1284dd-510f-422f-b8b9-268d037589bc . Historical event/category/eligibility UI. An Invalid Date label appeared on one historical category; data quality remains part of professional presentation.
6. Westchester U/1000 knockout, exact inspected final state: https://stadiumtt.com/tournament/0f1284dd-510f-422f-b8b9-268d037589bc/0f1284dd-510f-422f-b8b9-268d037589bc%7Cu1000?drawId=0f1284dd-510f-422f-b8b9-268d037589bc|0f1284dd-510f-422f-b8b9-268d037589bc|u1000|se#draws . Observed RR/SE split, aligned knockout columns, byes/defaults, table labels and expanded final game scores.
7. Display chooser: https://stadiumtt.com/display . Observed tournament/league selector, Show Past and Enter Display Mode controls only; display output not validated.

## Limits

No organizer admin access, backend audit, payment completion, completed registration, score submission or timed update test. No claim about load capacity, security, current pricing, service reliability or exhaustive supported draw formats. The feature marketing should not be converted into verified Accadon capabilities. Screenshots are reference evidence, not assets to reproduce as Accadon product screens.
