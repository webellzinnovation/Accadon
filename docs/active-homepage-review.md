# Active homepage concept

Review checkpoint: 15 October 2026. Static workflow review only.

The homepage is now an academy tournament hub before the product marketing:

- Near-header tournament score ribbon, moving slowly by default. Explicit pause/resume, hover/focus pause, and no animation under reduced motion.
- Selectable hero match centre with all five sports, match stage, table/court/pitch, scores and match-state context.
- Six fictional event cards with sport filters, expandable previews and a route back to the hero match centre.
- Six fictional academy spotlights linking to their sport's example events.
- Existing academy/coaching product concepts and role workflows retained below.

Everything is fictional demo content. There is no feed, score update, registration, generated activity count, or API call in the new homepage. Selecting a match changes presentation only. An unplayed 0-0 example is explicitly 'Up next' and 'Not started'. The canonical supplied logo is unchanged.

The user requested a moving ribbon and scoreboard hero. Stadium is the information-discipline reference, not the source of that hero pattern. Its review is preserved in stadiumtt-design-review.md. The Indian structures reference is preserved in sport-research/india-tournament-structures.md; it has not been converted into enabled tournament algorithms.

## Verification

- npm run build
- npm run test:home: 1440/390/320, static /Accadon/ hosting, filters, six match selectors, expanded event, demo disclosures, no API calls or page errors, no page overflow, pause/resume and reduced motion.
- npm run test:static: existing static navigation, demo login/workspace, parent/academy workflows, inquiry query and privacy routes.
- npm run test:visual: existing public product concepts and form failure retention at 1440/390/320.
- npm test: 21 tests.

Actual pixels inspected for desktop hero/event board/academies and mobile hero at 390 and 320. An initial cramped mobile heading was corrected and the updated screenshots inspected. No push, merge or deployment performed. Backend expansion remains paused.

## Live activation remains separate

Real event identities, owner-approved event data, timestamps/freshness, supported score states, connection/stale/offline treatment, verified academy destinations and empty-state handling are required before replacing the demo. No registration or payment promise is implied by this concept.
