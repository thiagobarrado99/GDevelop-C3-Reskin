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
- [x] Font: system sans (Segoe UI on Windows) — `gdevelop.modern-font-family` overridden in `ConstructLikeDarkTheme/theme.json`
- [~] Panel headers: 13 px plain titles, square bars/tabs done (survey: bar titles are plain text); MUI overrides for buttons/dialogs still to review against `02-new-project-dialog.png`

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
- [x] Login/signup header chips removed (`HomePageHeader.js`)
- [ ] View ▸ Example browser still opens GDevelop's template dialog with the Remix row (start page button already removed)

## Phase 2 — Shell (see `docs/c3-reference/ui-survey.md`)
- [x] Start page per survey (`HomePage/C3StartPage.js`): NEW / OPEN / BROWSE EXAMPLES, RECENT PROJECTS, LEARN/PARTICIPATE/EXPLORE cards, RECOMMENDED EXAMPLES
- [x] New project dialog per survey (`ProjectCreation/C3NewProjectDialog.js`); GDevelop's dialog kept for examples/templates (`UseNewProjectDialog.js`)
- [x] Local files only: Cloud provider removed, `BrowserFileStorageProvider` gives the web build a real Open picker (.a3p / .json / .zip); start page hover/pointer, white NOVO/ABRIR, "Explorar exemplos" button removed
- [x] Web build: device files are inlined as `data:` URLs for non-cloud projects (`FileToCloudProjectResourceUploader.js`, `// c3:`), so they travel inside `game.json`
- [x] Web build saves to a real local file (File System Access API: picker on first save, direct write on Ctrl+S, handles kept in IndexedDB for recent projects); download fallback for Firefox/Safari
- [x] `.a3p` project extension (desktop + web, file association in electron-builder config)
- [x] Brand: Assemble3 everywhere the UI said GDevelop (runtime `brandRules` + `APP_NAME`)
- [x] Assemble3 icon everywhere (favicons, PWA, Electron ico/icns/appx, window icon, start page, About)
- [x] Start page polish: Assemble3 logo + name, uniform cards (same size, icon/text placement)
- [ ] Start page: recent-project context menu (remove from list)
- [ ] Closing the browser tab / window asks for confirmation only when the project has unsaved changes (`UI/CloseConfirmDialog.js`, wired in `MainFrame/index.js` with `shouldPrompt={!!state.currentProject}` — change to `&& hasUnsavedChanges`; note it is skipped in dev via `Window.isDev()`, so test on `npm run build` or Electron)
- [x] New projects keep their game size on startup (`CreateProject.js`, Construct default)
- [x] Main menu tree (`MainFrame/C3MainMenu.js`, ☰ opens it as a dropdown; project manager drawer reachable from View ▸ Project bar until it is docked)
- [ ] Project bar tree order/labels: Layouts, Event sheets, Object types, Families, Sounds, Music, Fonts, Files
- [ ] Layers bar: ☑ visibility · 🔒 · name · z-index; context Insert layer above/below, Rename
- [x] Panel arrangement: properties left, canvas centre, objects top-right, layers bottom-right (`MosaicEditorsDisplay/index.js` `initialMosaicEditorNodes`; users with a saved layout keep theirs)
- [ ] Project bar as a docked panel — needs a new editor-tab kind for the side panes; for now the drawer opens from the toolbar's first button and View ▸ Project bar, and no longer carries the old File/View/Help row
- [x] Panel headers: 13 px plain title, square bars (`ConstructLikeDarkTheme/ConstructLikeDark.css`, scoped to the theme's body class)
- [x] Toolbar: Save · Preview ▾ · Export on the left (`MainFrame/Toolbar/index.js`); version-history buttons removed (cloud only)
- [x] Tabs: cream active tab, square corners (theme CSS)
- [ ] Merge tab strip and toolbar into one row?
- [~] Dialog chrome: title + ✕, Help bottom-left already match; grey filled buttons / title bar strip still to do

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
- [~] Layout colours: new layouts default to rgb(50, 50, 50) (project data, `MainFrame/index.js` + `ProjectManager/index.js`); dark surround outside the layout frame (`InstancesEditor/WindowMask.js`, `Background.js`) still theme work
- [ ] Properties panel section order (LAYOUT / EFFECTS / EDITOR)

## Phase 6 — Colour coding & behaviour parity (see CLAUDE.md "Colour coding, behaviours and icons")
- [x] Colour tokens as theme-scoped CSS variables `--c3-layout-color` / `--c3-event-sheet-color` / `--c3-behavior-color` / `--c3-effect-color` (`ConstructLikeDark.css`; components use `var(--c3-…-color, inherit)` so other themes are untouched)
- [ ] Project bar rows tinted per kind (`ProjectManager/*TreeViewItemContent.js`)
- [ ] Open editor tab background matches its kind (`EditorTabs/DraggableEditorTabs.js`, `UI/ClosableTabs.js`, by tab `kind`)
- [x] Properties panel: Behaviors/Effects section titles and each behaviour/effect name tinted; object editor dialog tabs too (`TopLevelCollapsibleSection`/`CollapsibleSubPanel` got a `color` prop)
- [ ] Add-behaviour / add-effect dialogs and the full behaviours editor tinted too
- [ ] Add-behaviour dialog as a Construct-style grid: icon + name tiles by category, description at the bottom after clicking, Add/Cancel (`BehaviorsEditor/NewBehaviorDialog.js`)
- [ ] Simplistic placeholder icons for behaviours/objects, single lookup point (user replaces every icon later)
- [x] Controls parity: PlatformerObject jumps with ↑ too (runtime one-liner in `Extensions/PlatformBehavior`, logged in CLAUDE.md Decisions)
- [ ] Naming parity: `Platform` behaviour → "Solid"/"Sólido", jump-thru → "Jump-thru"; whole-string rules in `C3Terminology.js` (libGD names go through the patched `i18n._`)
- [ ] Instance properties panel: show non-overridable behaviours (Physics…) and the object's effects, editing through to the object; else an "Edit on object" button using `editObjectInPropertiesPanel` (`CompactInstancePropertiesEditor/index.js`)
- [ ] Survey Construct's behaviour list vs GDevelop built-ins/extensions; fill the parity table in CLAUDE.md; rename or bundle what students expect (8 Direction, Drag & Drop, Bullet, Sine, Fade, …)

## Phase 5 — Polish
- [ ] Animation editor, shortcut parity, examples, docs

## Log
- 2026-09-16: repo forked, CLAUDE.md + references committed. Phase 0 done: web + desktop run.
- 2026-09-17: Phase 1 core shipped: theme, pt-BR default, runtime terminology, hides.
- 2026-09-18: Phase 2 shell shipped: start page, new-project dialog, ☰ menu, toolbar, panel arrangement, local files (.a3p, File System Access), Assemble3 brand + icons. Phase 6 started: colour tokens, properties panel tint. Construct defaults: game size kept, rgb(50,50,50) layouts, ↑ jumps.
