# TODO — C3 reskin

Roadmap and rules: see [CLAUDE.md](CLAUDE.md). Tick items here; add a line under "Log" when a phase ships.

## Phase 0 — Baseline

- [x] `newIDE/app` `npm install` completes (`node_modules/.package-lock.json` exists)
- [x] `npm start` → editor opens at http://localhost:3000
- [x] `newIDE/electron-app` `npm install && npm run start` → desktop window opens (unset `ELECTRON_RUN_AS_NODE` when launched from VS Code)
- [x] Note first impressions vs `docs/c3-reference/*.png` — home page is a marketing/courses storefront (Learn/Create/Play/Shop/Teach, Ask AI, Sign up); purple theme, rounded cards; nothing like C3's flat grey start page. Phase 1 must gut the home page as much as re-theme.

## Phase 1 — Skin

Theme
- [x] `src/UI/Theme/ConstructLikeDarkTheme/` from the measured palette; default theme; `flat` option in `CreateTheme.js` (2 px radius, no shadows, no ripple)
- [ ] Font: Segoe UI / system sans ~13 px instead of Fira Sans (global `GdevelopModernFontFamily`)
- [ ] Panel headers uppercase; review MUI overrides (buttons, dialogs, tabs) against `02-new-project-dialog.png`

Language & terminology
- [x] `pt_BR` is the default language (no browser autodetect); English stays selectable
- [x] Runtime terminology rewrite in `src/Utils/i18n/C3Terminology.js` (patches `i18n._`, shields interpolated values): Scene→Layout/Cena→Layout, Object group→Family/Família, Object variable→Instance variable, External events→Event sheets/Folhas de eventos, Project manager→Project bar/Barra do projeto
- [ ] Review pt-BR agreement glitches in real use; add rules/exceptions to `C3Terminology.js` (tests in `C3Terminology.spec.js`)
- [ ] Decide Object→"Tipo de objeto"? Events tab label → "Folha de eventos"?

Hide
- [x] JS code events (`EnumerateEventsMetadata.js`)
- [x] Non-HTML5 exporters: Share dialog opens on HTML5, no platform chooser (`ShareDialog/index.js`, `PublishHome.js`)
- [x] Home page: only Create tab; AI prompt and credits wallet removed (`HomePageMenu.js`, `CreateSection/index.js`)
- [x] Ask AI / announcements / paid products: classroom `hide*` flags forced on (9 sites, grep `// c3:`)
- [x] "Baixe o app" header button removed; "Compartilhar" → "Exportar" (whole-string rule); default names Layout 1 / Folha de eventos 1 / Camada 0 via `C3Terminology.js`
- [ ] Remaining storefront: login/signup header buttons (kept: cloud saves need login), "Remix" quick-customization row

## Phase 2 — Shell (see `docs/c3-reference/ui-survey.md`)
- [ ] Start page per survey: NEW / OPEN / BROWSE EXAMPLES buttons, RECENT PROJECTS list, LEARN/PARTICIPATE/EXPLORE cards, RECOMMENDED EXAMPLES
- [ ] Main menu tree: Project ▸ (Save, Save as, Preview, Export, Close project, New, Open) · View ▸ · Settings · Help · About
- [ ] Project bar tree order/labels: Layouts, Event sheets, Object types, Families, Sounds, Music, Fonts, Files
- [ ] Layers bar: ☑ visibility · 🔒 · name · z-index; context Insert layer above/below, Rename
- [ ] Panel arrangement (project bar + properties left, canvas centre, objects/layers right, bottom tabs) via `initialMosaicEditorNodes`
- [ ] Panel headers: uppercase title, pin/close icons
- [ ] Top toolbar + tab strip per `01-start-page.png`
- [ ] Dialog chrome per `02-new-project-dialog.png` (title bar ✕, Help bottom-left, grey buttons)

## Phase 3 — Event sheet (see survey)
- [ ] Rows: margin number, `[icon Object] condition` block, `Add action` placeholder, per-event `Add…`
- [ ] Condition context: Edit · Add another condition · Invert · Replace condition · Replace object · Toggle · Cut/Copy/Paste · Delete
- [ ] Picker step 2: two-column grouped list, category headers, description on top, search; step 3 params with Back/Done and `= Equal to…` operator labels
- [ ] Compact rows, object icon + text, C3 colours (`EventsTree/style.css`)
- [ ] Add condition/action flow: object tiles → condition → params (`InstructionOrObjectSelector.js`)
- [ ] "+ Add…" menu per `05-event-sheet-add-menu.png` (no JS/TS entries)
- [ ] Right-click menus

## Phase 4 — Layout view (see survey)
- [ ] Properties sections LAYOUT / EFFECTS / EDITOR with C3 row order; instance sections Common / Instance variables / Behaviors / Effects / Properties / Editor
- [ ] Instance context: Edit · Z Order ▸ · Align ▸ · Lock ▸ · Cut/Copy/Paste · Delete; double-click empty = add object; object picker as tile grid by category
- [ ] Gizmos, snap/grid defaults, z-order bar, status bar "Mouse · Layer · Zoom"
- [ ] Dark surround outside the layout frame (`InstancesEditor/WindowMask.js`, `Background.js`); canvas colour is project data, not theme
- [ ] Properties panel section order (LAYOUT / EFFECTS / EDITOR)

## Phase 5 — Polish
- [ ] Animation editor, shortcut parity, examples, docs

## Log
- 2026-09-16: repo forked, CLAUDE.md + references committed. Phase 0 done: web + desktop run.
- 2026-09-17: Phase 1 core shipped: theme, pt-BR default, runtime terminology, hides.
