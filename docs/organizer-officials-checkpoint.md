# Organizer creation and officials checkpoint

15 October 2026. Static requirement walkthrough only.

## Organizer

Dedicated Organize navigation opens /organizer (static host: #/organizer). Steps:

1. Sport, tournament name, venue, single/multiple days and date range.
2. Category dropdown or custom wording, with each category appended below. Entrant count per category. Defaults illustrate U9 ten players and U19 eight players; labels are not eligibility rules.
3. Independent category structures or a common structure applied across categories without merging them. Groups + knockout supports group count and qualifiers per group; knockout-only and league-only also preview. U9: two groups of five, top two each, 20 group fixtures plus three knockouts. U19: eight-entry QF/SF/final, seven matches. Visible bracket rounds and winner IDs; mobile selects a round. Byes are explicit, never fake scores or bye-vs-bye matches. U9 semifinals cross A1–B2 and B1–A2. Arbitrary placement remains provisional, with organizer approval required.
4. Optional officials now or later, including a future open-volunteer interest path that does not automatically confer permission. Assignment controls explicitly use the pre-existing sample tournament queue, not this local draft. No invitation sent or appointment created.
5. Review summary and local review marker. No publish, persistence, real registration or payment.

## Officials

Officials tab in tournament match desk; Umpire / scorekeeper role in workflow review. Existing parent/player/admin identity retains its main role, with a separate tournament duty. Conductor proposes a person and exact match/resource; official accepts; only accepted assigned scratch score is editable; all other matches read-only. Reasoned exact-last-event correction, incident escalation, submit-lock, return for correction, reviewer-check rehearsal and revocation. Audit shows prior actions. Reviewer rehearsal never certifies or publishes an invalid partial score. Full sport engine, server permissions and authentication remain paused.

Read umpire-role-design.md for the sourced five-sport authority comparison and proposed live access lifecycle. App assignment does not qualify an untrained person to officiate a sanctioned event. Football referee and scorekeeper are distinct; cricket umpires and scorers are distinct; pickleball officiated and non-officiated modes are distinct.

## Verification

Build/typecheck, 27 unit/API tests, officials browser lifecycle test, organizer browser test, 30-step workflow regression, tournament match/draw regression, static-host regression including organizer, public visual and home regression all passed. Tested 1440/390/320. No API calls or page errors in new walkthroughs; no viewport overflow.

Actual pixels inspected: desktop U9 groups/crossover/final; 320px same with readable round selection; organizer review at 390px; official submitted scoring controls/read-only queue/audit at 390px. Initial preview pairing immediately rematched the same pool; corrected to cross-pool and re-inspected. New unit test checks crossovers and avoids bye-vs-bye. Desktop/mobile locked canonical logo remains unchanged.

No push, merge or deployment. Full branch bundle is the delivery; parent handles publishing. Vite's existing >500KB advisory remains (new total approximately 565KB JS before gzip). No paid services.
