# Complete match lists and defined draws

Workflow-review checkpoint, 15 October 2026. Supersedes the single-match/empty-draw limits in tournaments-page-review.md.

## Complete categories

- TT: six singles entrants, two pools of three, six pool fixtures, top two per group into cross-pool semifinals and final. Nine total matches.
- Badminton: eight pairs, four quarterfinals, two semifinals and final. Seven total matches. One reported-but-unverified result does not advance its winner.
- Football: four teams, six single-round-robin fixtures, no knockout. Standings include draws.
- Cricket: four teams, six league fixtures plus final. Seven total matches. Two teams tied on points remain explicitly tied; no NRR or unapproved tie-break invented.
- Pickleball: six fixed pairs, two pools of three, semifinals and final. Nine total matches. Explicitly illustrative pool quotas and match-scoring conditions, not Panda mixed-doubles rules.

All are fictional scaled examples using the research's round-robin, knockout and worked crossover patterns. They are not copies of official Indian event draws or enabled production defaults. Source qualifications remain in sport-research/india-tournament-structures.md. Point schemes are local demo choices. Official tie-break adoption remains gated.

## Connected views

Matches lists every fixture, including completed, in progress, submitted/unverified and future matches. State and participant/allocation search filters are available. Scheduled matches show dashes, never fake 0-0 scores. Expandable notes explain state.

Draws shows computed group standings from certified demo results only, all declared advancement rules, and knockout cards with match IDs, winner destinations and unresolved feeder labels. Desktop shows rounds together; mobile uses a round selector, readable cards and textual feeder relationships. No third-place or hidden placement matches. Unverified and in-progress matches never alter standings or fill qualifier slots.

Players now lists all category entrants. Results lists only certified fictional results. Overview retains the detailed featured score.

## Verification

Build/typecheck, 24 unit/API tests (three new graph/standings tests), updated tournament browser test at 1440/390/320, home regression and static-host regression passed. Tests check fixture totals [9,7,6,7,9], unique IDs, exhaustive pool pairings, standings totals, cross-pool participant consistency, unverified qualifier handling, match lists, state filters, group counts and mobile final-round selection. No API requests, page errors or viewport overflow.

Actual pixels inspected: desktop TT standings and bracket, mobile seven-match badminton list, 320px knockout final and 390px cricket tied standings/final. Existing >500KB build advisory remains. No push, merge, deployment or backend expansion.
