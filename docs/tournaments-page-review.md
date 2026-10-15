# Dedicated Tournaments page

Static workflow-review checkpoint, 15 October 2026.

## Scope

- Header/footer Tournaments link and homepage Explore tournaments action open the dedicated page. Root /tournaments and static /Accadon/#/tournaments routes are supported.
- Current and Upcoming views, sport filters, search by event/academy/city, result counts and clearable empty states.
- Five current fictional tournament snapshots and three upcoming fictional event previews. Dates and weekday labels calculated before use. No real entries, venue bookings, fees or eligibility implied.
- Public match desk: Overview, Matches, Draws, Players, Results. Selected tournament/category persists across tabs. Keyboard arrow navigation is supported.
- Sport-specific score expansion: TT game columns, badminton game columns, football clock, cricket target/chase, pickleball missing scoring/serve inputs. Scores are fixed fictional examples, unsubmitted and uncertified.
- Draws intentionally says unpublished rather than inventing a complete advancement graph. Results intentionally says no certified results. Participants are the sample match participants, not a claimed complete entry list.
- Staggered entrances, card lift, and detail-panel transition use the existing animation setup. Reduced motion disables animation and lift; no extra paid service or animation library.

## Verification

- Build and typecheck passed.
- Tournament browser test passed at 1440/390/320 on file-only static /Accadon/ hosting: navigation, Current/Upcoming, search, filters, empty state, event preview, all five sports and all five detail tabs, score expansion, keyboard tabs, reduced motion, normal animation, no overflow/page errors/API calls.
- Existing home, static-host and public visual regression suites passed.
- Pixel inspection: desktop directory and cricket detail; 390px directory/upcoming preview/badminton detail; 320px TT detail. Added game-column labels after first review, reran and inspected updated captures.

## Limits

This remains a clearly labeled demo with no live update feed, registration or official results. Full structured draws, complete entry lists, score certification and real event publishing are separate work. Backend expansion remains paused. No push, merge or deployment performed. Existing Vite >500KB advisory remains.
