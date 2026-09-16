# TODO — C3 reskin

Roadmap and rules: see [CLAUDE.md](CLAUDE.md). Tick items here; add a line under "Log" when a phase ships.

## Phase 0 — Baseline

- [ ] `newIDE/app` `npm install` completes (`node_modules/.package-lock.json` exists)
- [ ] `npm start` → editor opens at http://localhost:3000
- [ ] `newIDE/electron-app` `npm install && npm run start` → desktop window opens
- [ ] Note first impressions vs `docs/c3-reference/*.png`

## Phase 1 — Skin

Theme
- [ ] `npm run create-new-theme "Construct-like Dark"` → `src/UI/Theme/ConstructLikeDarkTheme/`
- [ ] Sample hex from `docs/c3-reference/03-layout-view.png`; fill `theme.json` (greys `#2b2b2b` / `#333` / `#3d3d3d`, teal accent, 2 px radius, no shadows)
- [ ] `npm run build-theme-resources`; make it the default theme in preferences
- [ ] Kill Material ripple / elevation globally (`UI/Theme/Global`)

Terminology (lingui, no identifier edits)
- [ ] Decide mechanism: `en` catalog override vs. post-process step in `locales/` build
- [ ] Scene→Layout, Events→Event sheet, Object group→Family, Object variable→Instance variable, Project manager→Project bar, Properties→Properties bar
- [ ] Same map applied to `pt_BR` (Cena→Layout, Grupo→Família, …)

Hide
- [ ] JS code events: filter `BuiltinCommonInstructions::JsCode` in `src/EventsSheet/EnumerateEventsMetadata.js`
- [ ] Non-HTML5 exporters: keep only `html5Exporter` in `src/ExportAndShare/BrowserExporters/index.js` and `LocalExporters/index.js`
- [ ] Asset store, AI panels, marketing/subscription prompts, community/learn tabs on home page

## Phase 2 — Shell
- [ ] Panel arrangement (project bar + properties left, canvas centre, objects/layers right, bottom tabs) via `initialMosaicEditorNodes`
- [ ] Panel headers: uppercase title, pin/close icons
- [ ] Top toolbar + tab strip per `01-start-page.png`
- [ ] Dialog chrome per `02-new-project-dialog.png` (title bar ✕, Help bottom-left, grey buttons)

## Phase 3 — Event sheet
- [ ] Compact rows, object icon + text, C3 colours (`EventsTree/style.css`)
- [ ] Add condition/action flow: object tiles → condition → params (`InstructionOrObjectSelector.js`)
- [ ] "+ Add…" menu per `05-event-sheet-add-menu.png` (no JS/TS entries)
- [ ] Right-click menus

## Phase 4 — Layout view
- [ ] Gizmos, snap/grid defaults, z-order bar, status bar "Mouse · Layer · Zoom"
- [ ] Properties panel section order (LAYOUT / EFFECTS / EDITOR)

## Phase 5 — Polish
- [ ] Animation editor, shortcut parity, examples, docs

## Log
- 2026-09-16: repo forked, CLAUDE.md + references committed, install in progress.
