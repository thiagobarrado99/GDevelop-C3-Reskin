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
- [x] View ▸ Example browser opens the searchable example grid only (`NewProjectSetupDialog.js` `browseExamples`, no templates / premium rows)

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
- [x] Project bar docked at the right of the editors on desktop (`MainFrame/index.js` `.c3-project-bar` column, toolbar button shows/hides it; drawer kept for mobile)
- [x] Panel headers: 13 px plain title, square bars (`ConstructLikeDarkTheme/ConstructLikeDark.css`, scoped to the theme's body class)
- [x] Toolbar: Save · Preview ▾ · Export on the left (`MainFrame/Toolbar/index.js`); version-history buttons removed (cloud only)
- [x] Tabs: cream active tab, square corners (theme CSS)
- [ ] Merge tab strip and toolbar into one row?
- [x] Dialog chrome: grey title strip with centred title + ✕, dark filled fields, grey buttons (`Dialog.js` gets a `c3-dialog-title` class, rules in `ConstructLikeDark.css`)

## Phase 3 — Event sheet (see survey)
- [x] Rows: margin number on the drag handle (`data-event-number`, theme CSS), `[icon Object] condition` block, `+ Add action` placeholder, cream selected block
- [~] Condition context: Edit · Add another condition · Invert · Cut · Copy · Paste · Delete (done); Replace condition/object, Toggle, Copy as text not offered
- [x] Picker step 2: two-column grouped list with category headers + search, description of the hovered item above the list (`InstructionOrExpressionSelector/index.js`, items found back from their DOM id); step 3 params with Back/Done — operator labels stay GDevelop's `= (igual a)` form
- [x] Add condition/action flow: System + object tiles → list → params (`InstructionEditor/C3ObjectPicker.js`, `InstructionEditorDialog.js` `useC3Steps`)
- [x] "+ Add…" menu: Event · Comment · Group · Include event sheet · loops (`EnumerateEventsMetadata.js` order + runtime renames)
- [x] Event context menu in Construct's order: Add ▸ (Condition C · Action A · Event E · Sub-event B · Local variable L · Comment Q · Group · Include · Else · loops) · Edit · Toggle disabled · Cut · Copy · Paste · Delete · Select/Deselect all · … (`EventsSheet/index.js` `_buildEventContextMenu`)
- [x] Construct's event sheet keys as the default shortcut map (`KeyboardShortcuts/DefaultShortcuts.js`): E event, B sub-event, Q comment, C condition, A action, X else, G group, I invert, L local variable, D toggle disabled; new commands `ADD_CONDITION` / `ADD_ACTION` / `ADD_ELSE_EVENT` / `ADD_GROUP_EVENT` (`CommandsList.js`, `EventsSheet/ToolbarCommands.js`); keys shared with the layout editor resolve to the active tab's command (`useKeyboardShortcuts` tries every command bound to the key)
- [~] Per-event `Add…` link — covered by the per-row `+ Add condition / + Add action` links and the event's Add ▸ context menu

## Phase 4 — Layout view (see survey)
- [x] Instance panel sections in Construct's order: Common (position/size/angle/layer/Z) · Instance variables · Behaviors · Effects (`CompactInstancePropertiesEditor/index.js`); object panel: Properties · Object variables · Behaviors · Effects (`CompactObjectPropertiesEditor/index.js`)
- [x] Context menus (`SceneEditor/index.js` `buildContextMenu`, `// c3`): empty space = Insert new object · View ▸ (zoom) · Edit event sheet · Layout properties · Paste; instance = Edit · Insert new object · Add ▸ (Instance variable / Behavior / Effect) · Z Order ▸ · Lock ▸ (Lock = locked + sealed, Unlock all) · View ▸ · Cut · Copy · Paste · Duplicate · Delete · Extract ▸
- [x] Double-click on empty space = Insert new object under the cursor (`InstancesEditor/index.js` `onBackgroundDoubleClicked`, `// c3`)
- [x] Status bar `Mouse: (x, y)   Layer: …   Zoom: N%` (`InstancesEditor/StatusBar.js`, PIXI text, English labels only)
- [x] Snap/grid defaults already Construct's (32×32, grid and snap off)
- [x] Layout colours: new layouts default to rgb(50, 50, 50) (project data, `MainFrame/index.js` + `ProjectManager/index.js`); dark `#1f1f1f` surround outside the layout frame, layout colour inside (`InstancesEditor/Background.js`)
- [x] Canvas hover tooltip says "Layer 0" for the base layer (`HighlightedInstance.js`)
- [x] Align ▸ submenu (Left · Horizontal center · Right · Top · Vertical center · Bottom on the selection's bounding box, `SceneEditor/index.js` `_alignSelection`); Z-order bar = GDevelop's Instances list (toolbar button, sorted by Z by default)

## Phase 6 — Colour coding & behaviour parity (see CLAUDE.md "Colour coding, behaviours and icons")
- [x] Colour tokens as theme-scoped CSS variables `--c3-layout-color` / `--c3-event-sheet-color` / `--c3-behavior-color` (`#f75651`, from the C3 behaviour icons) / `--c3-effect-color` / `--c3-object-color` (`#00768e`, from the C3 object icons) (`ConstructLikeDark.css`; components use `var(--c3-…-color, inherit)` so other themes are untouched)
- [x] Project bar rows tinted per kind — theme CSS only, keyed on the rows' `data-scene` / `data-external-events` / `data-external-layout` and `#project-manager`; icons redrawn as masks (`/* webpackIgnore: true */ url(/res/…)` so css-loader leaves public URLs alone)
- [x] Editor tabs tinted by kind: `DraggableEditorTabs.js` adds `data-kind` to the tab button, theme CSS fills the active tab / colours the inactive label
- [x] Properties panel: Behaviors/Effects section titles and each behaviour/effect name tinted; object editor dialog tabs too (`TopLevelCollapsibleSection`/`CollapsibleSubPanel` got a `color` prop)
- [x] Full behaviours editor (behaviour names) and effects list (effect names) tinted (theme CSS)
- [x] Add-behaviour dialog as a Construct-style grid: `UI/C3TileGrid.js` (+ `.css`) mounted in `AssetStore/BehaviorStore/index.js` (`useC3Grid`), description + Add in the footer, double-click adds; compatibility check shared via `isBehaviorUsable` in `BehaviorListItem.js`
- [x] 1:1 behaviour parity (user, 2026-09-18) — 31 of 32 tiles ported (built-ins + Persist/No save + 8 reviewed store extensions installed on demand + 9 of our own events-based extensions; presets + default names applied via `addBehaviorToObject(…, presets)`; ⋮ menu has "Mostrar todos os comportamentos do GDevelop"; Billboard only for 3D objects). Own extensions (2026-09-19): Sine, Rotate, MoveTo, Follow, Tile movement, Custom, Fade, Timer, Line of sight — generated JSON in `Utils/C3Extensions/A3*.json` (generator script kept in the session scratchpad, rebuild with libGD.js when changing them), `bundledExtension` rows in `Utils/C3Behaviors.js`, installed through `installExtension({ importedSerializedExtensions })` in `NewBehaviorDialog.js`; `C3Extensions.spec.js` checks each one generates code without errors; runtime checked in a preview (MoveTo, Timer once/regular, Tile movement snapping, Custom velocity, Fade + destroy, Follow, Line of sight in range/blocked/behind/far). pt-BR labels only (extension strings are not translated by lingui). Spec: `Utils/C3Behaviors.js` table (Construct tile → GDevelop type + presets + default name + category + icon slug) feeds the grid instead of the full GDevelop/store list; presets applied after `addNewBehavior` (Solid = Platform behaviour with `platformType=NormalPlatform`, Jump-thru = same with `Jumpthru`); *ext* rows need the community extension bundled or installed on demand; keep a "show all GDevelop behaviours" toggle in the ⋮ menu
- [x] Icons applied (2026-09-20): `public/res/c3-icons/{behaviors,objects}/*.png` (committed — user decision; the root `C3-Icons/` stays out via `/C3-Icons/` in `.git/info/exclude`), `Utils/C3Icons.js` (type → slug from the `C3Behaviors`/`C3Objects` tables + a few extras) wraps `gd.BehaviorMetadata/ObjectMetadata.prototype.getIconFilename` from `src/index.js`; tiles use the slug directly; `ObjectsRenderingService.getThumbnail` returns the flat icon for every non-sprite type
- [~] Icons render as plain `<img>` (the PNGs are already flat and coloured); the white gradient is dropped for them in the theme CSS (`img[src*='res/c3-icons/']`). Masks tinted by the colour variables only if the colours ever change
- [x] Add-object dialog: asset-store tab hidden (`NewObjectDialog.js`, `hideAssetStore`), opens straight on the object types
- [x] Add-object dialog as Construct tiles: `Utils/C3Objects.js` (13 object types with a GDevelop port, categories 3D · Elementos HTML · Geral · Mídia · Outro) through `C3TileGrid` in `NewObjectFromScratch.js`; ⋮ menu "Mostrar todos os objetos do GDevelop"; labels use `--c3-object-label-color` (#00b1cc). Add-behaviour grid done above.
- [x] Tiles use the C3 icons (`BehaviorStore`, `NewObjectFromScratch`)
- [x] Controls parity: PlatformerObject jumps with ↑ too (runtime one-liner in `Extensions/PlatformBehavior`, logged in CLAUDE.md Decisions)
- [x] Naming parity: `Platform` → Solid/Sólido, `Platformer character` → Platform/Plataforma, `Jumpthru platform` → Jump-thru/Atravessável (whole-string rules in `C3Terminology.js`, tested)
- [x] Instance properties panel: non-overridable behaviours (Physics…) render the object-level compact editor ("Compartilhado por todas as instâncias do objeto.") and the object's effects get their own section, both editing the object (`CompactInstancePropertiesEditor/index.js`, `// c3:`)
- [x] Survey of the reviewed extension store done (registry fetched from `api.gdevelop.io/asset/extension`); ports recorded in `Utils/C3Behaviors.js` and the CLAUDE.md table; on-demand install kept (no bundling)

## Phase 5 — Polish
- [x] Shortcut parity for the event sheet (see Phase 3); layout editor keeps GDevelop's letters (O objects, P properties, L layers, I instances, G groups…)
- [x] GDevelop's video tutorial banners hidden (`Hints/TutorialMessage.js`)
- [x] README banner for the fork
- [~] Animation editor: GDevelop's sprite editor + Piskel stay (decision); examples = View ▸ Example browser (GDevelop's example grid)

## Project bar rework (user request 2026-09-19, done 2026-09-20)
- [x] Every layout's own event sheet is listed under `Folhas de eventos`, before the external events (`ProjectManager/LayoutEventsTreeViewItemContent.js`, rows carry `data-layout-events` and share the green tint; click opens the events tab only)
- [x] GDevelop-only objects and behaviours are shown as extra tiles after Construct's, grouped by their GDevelop category — no ⋮ "show all" toggles any more (`BehaviorStore/index.js` `c3TileItems`, `NewObjectFromScratch.js` `c3Tiles`)
- [x] Objects · Families · Layers live in the docked project bar, between `Folhas de eventos` and `Layouts externos`, and the column scrolls (`MainFrame/index.js` renders the tree twice with `c3Section='top' | 'bottom'` around a `#c3-project-bar-panels` target; `ProjectManager` filters its roots per section, the bottom half has no search bar and the id `project-manager-bottom`; `TreeView` `fitContent` sizes the list to its rows; `MosaicEditorsDisplay` portals `C3BarSection`s with the Objects / Object Groups / Layers panels into the target from the last active scene editor, default mosaic = properties + canvas, saved layouts still holding those panels are ignored)
- [ ] Open question kept: "Objetos" vs "Tipos de objeto" wording; the toolbar's objects/layers toggles still open mosaic panels (duplicates) — hide them if it bothers

## Icons (complete, 2026-09-20)
Every object type and behaviour shown in the add dialogs has a flat C3-style icon in `public/res/c3-icons/{objects,behaviors}/` (Construct's 32 + 62 from the user, plus 122 drawn by the user for GDevelop-only items; only the dev-only "Dummy" test items keep GDevelop's). Types → slugs live in `Utils/C3Icons.js`; new extensions that appear later need a row there and a PNG (the `C3-Icons/missing-icons/index.txt` workflow: placeholders named by pt-BR label, drawn, copied over).

## Log
- 2026-09-16: repo forked, CLAUDE.md + references committed. Phase 0 done: web + desktop run.
- 2026-09-17: Phase 1 core shipped: theme, pt-BR default, runtime terminology, hides.
- 2026-09-18: Phase 2 shell shipped: start page, new-project dialog, ☰ menu, toolbar, panel arrangement, local files (.a3p, File System Access), Assemble3 brand + icons. Phase 6 started: colour tokens, properties panel tint. Construct defaults: game size kept, rgb(50,50,50) layouts, ↑ jumps.
- 2026-09-18 (later): user supplied `C3-Icons/` (94 flat 64 px PNGs + the two Construct grid screenshots); documented the type→file map and the `getIconFilename` wrapper plan in CLAUDE.md; `--c3-behavior-color` = `#f75651`, new `--c3-object-color` = `#00768e`, both sampled from the icons. Queued: close-tab confirmation only on unsaved changes (Phase 2), instance panel edit-through (Phase 6). Open question: may the icons be committed?
- 2026-09-18 (night): Phase 2 leftovers shipped (close-tab prompt only on unsaved changes, project bar order, recent-project context menu, layer add above/below, Construct dialog chrome); docked project bar still open. Phase 6: rows/tabs coloured by kind, Solid/Platform/Jump-thru renames, `C3TileGrid` for add-behaviour (22/32 Construct behaviours ported 1:1 with presets, store extensions installed on demand) and add-object (13 tiles), instance panel edits physics behaviours + effects through to the object. Icons wait on the user's answer.
- 2026-09-18 (late night): Phase 3 started — Construct's add-condition/action steps (object tiles with System first, two-column list, parameters with Back/Pronto), margin numbers, cream selection, green sheet links, instruction context menu and Add… menu in Construct's order.
- 2026-09-19: Phase 4 layout view — Construct context menus, double-click inserts an object, status bar, properties panel section order. `C3-Icons/` stays local (user decision, `.git/info/exclude`).
- 2026-09-19 (later): docked project bar (Phase 2 leftover closed), Construct event sheet keys + new add-condition/action commands, hovered-item description in the picker, event context menu order, tutorial banners hidden, README banner.
- 2026-09-20 (evening): the 122 GDevelop-only icons drawn by the user are in too — every tile has a flat icon now.
- 2026-09-20 (later): C3 icons applied (committed under `public/res/c3-icons`), bar sections fixed (readable title, collapsible with chevrons); missing-icon list above.
- 2026-09-20: project bar rework shipped (layout event sheet rows, Objects/Families/Layers docked in the bar with a scrollable column, GDevelop extras as tiles).
- 2026-09-19 (night): leftovers closed — dark surround outside the layout frame, Align ▸ submenu, example browser = example grid only, behaviours editor / effects list tinted; the 9 Construct behaviours without a GDevelop port shipped as our own events-based extensions (`Utils/C3Extensions`), runtime-checked in a preview. User briefing for tomorrow added above (event sheet rows, show extra GDevelop objects/behaviours, Objects/Families/Layers into the project bar).
