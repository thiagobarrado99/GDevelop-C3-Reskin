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
- [x] Panel headers: 13 px plain titles, square bars/tabs; dialog buttons/fields restyled in Phase 2

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
- [x] Start page: recent-project context menu (right-click → Remover da lista, `C3StartPage.js`)
- [x] Closing the browser tab / window asks for confirmation only when the project has unsaved changes (`UI/CloseConfirmDialog.js`, wired in `MainFrame/index.js` with `shouldPrompt={!!state.currentProject}` — change to `&& hasUnsavedChanges`; note it is skipped in dev via `Window.isDev()`, so test on `npm run build` or Electron)
- [x] New projects keep their game size on startup (`CreateProject.js`, Construct default)
- [x] Main menu tree (`MainFrame/C3MainMenu.js`, ☰ opens it as a dropdown; project manager drawer reachable from View ▸ Project bar until it is docked)
- [x] Project bar tree order: Layouts · Folhas de eventos · Layouts externos · Extensões · Configurações do jogo (`ProjectManager/index.js` root array reordered, `// c3:`); object types/families/resources stay per-scene / in the Resources editor
- [x] Layers bar: visibility · lock · rename already upstream; context menu gained Adicionar camada acima/abaixo (`LayerTreeViewItemContent.js`, names `Camada N`); z-index column skipped
- [x] Panel arrangement: properties left, canvas centre, objects top-right, layers bottom-right (`MosaicEditorsDisplay/index.js` `initialMosaicEditorNodes`; users with a saved layout keep theirs)
- [ ] Project bar as a docked panel — needs a new editor-tab kind for the side panes; for now the drawer opens from the toolbar's first button and View ▸ Project bar, and no longer carries the old File/View/Help row
- [x] Panel headers: 13 px plain title, square bars (`ConstructLikeDarkTheme/ConstructLikeDark.css`, scoped to the theme's body class)
- [x] Toolbar: Save · Preview ▾ · Export on the left (`MainFrame/Toolbar/index.js`); version-history buttons removed (cloud only)
- [x] Tabs: cream active tab, square corners (theme CSS)
- [ ] Merge tab strip and toolbar into one row?
- [x] Dialog chrome: grey title strip with centred title + ✕, dark filled fields, grey buttons (`Dialog.js` gets a `c3-dialog-title` class, rules in `ConstructLikeDark.css`)

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
- [x] Colour tokens as theme-scoped CSS variables `--c3-layout-color` / `--c3-event-sheet-color` / `--c3-behavior-color` (`#f75651`, from the C3 behaviour icons) / `--c3-effect-color` / `--c3-object-color` (`#00768e`, from the C3 object icons) (`ConstructLikeDark.css`; components use `var(--c3-…-color, inherit)` so other themes are untouched)
- [x] Project bar rows tinted per kind — theme CSS only, keyed on the rows' `data-scene` / `data-external-events` / `data-external-layout` and `#project-manager`; icons redrawn as masks (`/* webpackIgnore: true */ url(/res/…)` so css-loader leaves public URLs alone)
- [x] Editor tabs tinted by kind: `DraggableEditorTabs.js` adds `data-kind` to the tab button, theme CSS fills the active tab / colours the inactive label
- [x] Properties panel: Behaviors/Effects section titles and each behaviour/effect name tinted; object editor dialog tabs too (`TopLevelCollapsibleSection`/`CollapsibleSubPanel` got a `color` prop)
- [ ] Add-behaviour / add-effect dialogs and the full behaviours editor tinted too
- [x] Add-behaviour dialog as a Construct-style grid: `UI/C3TileGrid.js` (+ `.css`) mounted in `AssetStore/BehaviorStore/index.js` (`useC3Grid`), description + Add in the footer, double-click adds; compatibility check shared via `isBehaviorUsable` in `BehaviorListItem.js`
- [~] 1:1 behaviour parity (user, 2026-09-18) — 22 of 32 tiles ported (built-ins + Persist/No save + 8 reviewed store extensions installed on demand; presets + default names applied via `addBehaviorToObject(…, presets)`; ⋮ menu has "Mostrar todos os comportamentos do GDevelop"). No port yet: Sine, Rotate, MoveTo, Follow, Tile movement, Custom, Fade, Timer, Line of sight — write our own events-based extensions later. Spec: `Utils/C3Behaviors.js` table (Construct tile → GDevelop type + presets + default name + category + icon slug) feeds the grid instead of the full GDevelop/store list; presets applied after `addNewBehavior` (Solid = Platform behaviour with `platformType=NormalPlatform`, Jump-thru = same with `Jumpthru`); *ext* rows need the community extension bundled or installed on demand; keep a "show all GDevelop behaviours" toggle in the ⋮ menu
- [ ] Icons: copy `C3-Icons/{behaviour,object}_icons` to `public/res/c3-icons/{behaviors,objects}/`, add `Utils/C3Icons.js` (type → file map from CLAUDE.md) and wrap `gd.BehaviorMetadata/ObjectMetadata.prototype.getIconFilename` in `src/index.js` — no call-site edits (user decides first whether the files are committed)
- [ ] Icons: render as CSS masks tinted by `--c3-behavior-color` / `--c3-object-color` and drop `IconContainer`'s white gradient under the theme; check add-object dialog, add-condition step 1, objects bar, behaviour tiles/rows, event sheet rows
- [x] Add-object dialog: asset-store tab hidden (`NewObjectDialog.js`, `hideAssetStore`), opens straight on the object types
- [x] Add-object dialog as Construct tiles: `Utils/C3Objects.js` (13 object types with a GDevelop port, categories 3D · Elementos HTML · Geral · Mídia · Outro) through `C3TileGrid` in `NewObjectFromScratch.js`; ⋮ menu "Mostrar todos os objetos do GDevelop"; labels use `--c3-object-label-color` (#00b1cc). Add-behaviour grid done above.
- [ ] Icons: swap the tiles' `previewIconUrl` for the C3 icons once the user decides whether `C3-Icons/` can be committed (Phase 6 icon items)
- [x] Controls parity: PlatformerObject jumps with ↑ too (runtime one-liner in `Extensions/PlatformBehavior`, logged in CLAUDE.md Decisions)
- [x] Naming parity: `Platform` → Solid/Sólido, `Platformer character` → Platform/Plataforma, `Jumpthru platform` → Jump-thru/Atravessável (whole-string rules in `C3Terminology.js`, tested)
- [x] Instance properties panel: non-overridable behaviours (Physics…) render the object-level compact editor ("Compartilhado por todas as instâncias do objeto.") and the object's effects get their own section, both editing the object (`CompactInstancePropertiesEditor/index.js`, `// c3:`)
- [x] Survey of the reviewed extension store done (registry fetched from `api.gdevelop.io/asset/extension`); ports recorded in `Utils/C3Behaviors.js` and the CLAUDE.md table; on-demand install kept (no bundling)

## Phase 5 — Polish
- [ ] Animation editor, shortcut parity, examples, docs

## Log
- 2026-09-16: repo forked, CLAUDE.md + references committed. Phase 0 done: web + desktop run.
- 2026-09-17: Phase 1 core shipped: theme, pt-BR default, runtime terminology, hides.
- 2026-09-18: Phase 2 shell shipped: start page, new-project dialog, ☰ menu, toolbar, panel arrangement, local files (.a3p, File System Access), Assemble3 brand + icons. Phase 6 started: colour tokens, properties panel tint. Construct defaults: game size kept, rgb(50,50,50) layouts, ↑ jumps.
- 2026-09-18 (later): user supplied `C3-Icons/` (94 flat 64 px PNGs + the two Construct grid screenshots); documented the type→file map and the `getIconFilename` wrapper plan in CLAUDE.md; `--c3-behavior-color` = `#f75651`, new `--c3-object-color` = `#00768e`, both sampled from the icons. Queued: close-tab confirmation only on unsaved changes (Phase 2), instance panel edit-through (Phase 6). Open question: may the icons be committed?
- 2026-09-18 (night): Phase 2 leftovers shipped (close-tab prompt only on unsaved changes, project bar order, recent-project context menu, layer add above/below, Construct dialog chrome); docked project bar still open. Phase 6: rows/tabs coloured by kind, Solid/Platform/Jump-thru renames, `C3TileGrid` for add-behaviour (22/32 Construct behaviours ported 1:1 with presets, store extensions installed on demand) and add-object (13 tiles), instance panel edits physics behaviours + effects through to the object. Icons wait on the user's answer.
