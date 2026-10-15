# UI kit review checkpoint

Isolated route `#/design-system`. App-wide restyle and feature work paused for design review. Current shipped pages unchanged; all kit selectors scoped under `.kit`/`kit-*`. Canonical Accadon logo unchanged.

Rendered: mesh gradient + pastel/semantic palette, humanist system type scale, stat/sparkline/content/avatar-list/navy-banner/form cards, pill buttons and icon chips, pill status/category and underline tabs, inputs/selects/textarea/checkbox/radio/native date/time pickers/disabled/error, group points table, horizontally connected bracket plus match-score preview, dashboard/module-workspace/public-page structure specimens, glass/blur/fallback, spacing/radius/elevation tokens. All numbers/people/outcomes fictional. No API effects.

Typography uses local Trebuchet MS/Arial fallback, not an installed custom font asset. Native date/time picker format follows browser. Competition table/bracket scroll within cards on mobile. Kit actions only change demo state or show inert notices.

Verified interactive tabs/category/form gate/toast/bracket preview and no API/errors/document overflow at 1440/390/320. Pixel-inspected desktop bento, mobile controls/competition. Fixed inherited global button shadow and oversize native radios after first inspection.

Purple-major follow-up: dominant purple mesh, lavender/plum card family, purple metrics/sparklines/icon chips and primary/selected states. Navy retained for banner anchor; semantic statuses still distinct. Scoped kit-only; workflow and component inventory unchanged. Retested at 1440/390/320 and pixel-inspected desktop cards/mobile forms.

Review corrections: kit-only custom purple dropdown menus (keyboard arrows/Home/End/Enter/Escape and outside dismissal), themed modal calendar with purple selection/month navigation/today/clear/cancel, and centered Match Centre modal with backdrop/focus restoration/Escape instead of inline expansion. Added reference-style translucent lavender pill banner with icon/title/subline/right action and matching framed pill-tab tracks. Native time control retained. App pages untouched. Tests at 1440/390/320 cover dropdown selection, date selection, modal centering, close/Escape, no API/errors/overflow. Pixel-inspected dropdown, calendar, centered mobile score modal and desktop pill banner.

Form/type review: lavender-gradient rounded text/textarea/time/date/dropdown surfaces, purple focus rings, rose-purple validation state, muted disabled state and selected radio pills. Legacy global native-control overrides explicitly contained at the kit boundary. Body 15-16px/500, field values 15px/500, labels 14px/650, button/tab 13-14px/650; supporting text raised across cards, table, bracket and calendar. Native time popup remains browser-owned. Pixel-inspected desktop/mobile form focus/error/disabled states and radio; interaction tests at 1440/390/320 also assert computed field radius/type/color. All selectors kit-scoped.
