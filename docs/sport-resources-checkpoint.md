# Sport-aware venue inventory

15 October 2026. Follow-up to organizer-officials-checkpoint.md.

Creation asks for the selected sport's resources: TT tables/boards, badminton courts, football pitches, cricket grounds, pickleball courts. Counts are retained separately while switching sports. Inventory is capped at 32 in this preview, minimum one.

Declared resource labels appear in group allocations, knockout match cards, league notes and final review. The same venue inventory is shared across categories, not multiplied. Proposed labels rotate within the inventory only. This is a location-allocation concept, not a time/conflict scheduler. Rest, match duration, group concurrency, ground suitability and all cross-category scheduling remain explicit review work.

The optional officials control still uses a clearly disclosed pre-existing fictional public event queue, not the new draft's match IDs. Its note now distinguishes that sample queue from the new draft's resource inventory. Real umpire allocation into the draft follows the final draw/schedule, it is not silently connected here.

Verified build/typecheck, organizer browser workflow at 1440/390/320 covering all five sport labels/counts and bracket allocation labels, and four organizer unit tests including inventory bounds. Actual pixels inspected: 390px event form and table list, 320px U9 resource/group/bracket, desktop U9 match labels. No backend/persistence/push/merge/deployment. Existing Vite >500KB advisory remains.
