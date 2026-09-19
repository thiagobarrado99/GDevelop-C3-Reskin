# GDevelop-C3-Reskin → **Assemble3**

Fork of [GDevelop](https://github.com/4ian/GDevelop) (MIT) whose editor UI is reworked to look and feel like Scirra's **Construct 3**, so a team already fluent in Construct can switch with near-zero relearning. Open source, no feature limits, browser + desktop, HTML5 export only.

**Product name: Assemble3** (chosen by the user on 2026-09-18). Project files are `.a3p`. The name is applied at runtime to every translated string (`brandRules` in `src/Utils/i18n/C3Terminology.js`, all languages, word-boundary and case-sensitive so `gdevelop.io` URLs stay) and hardcoded through `src/Utils/C3Brand.js` (`APP_NAME`) in the window title (`ProjectTitlebar.js`), the start page, `public/index.html`, `public/manifest.json`, and the Electron `package.json`/`electron-builder-config.js` (`productName`, `executableName`, `appId: com.assemble3.ide`). Use `APP_NAME` for any new hardcoded mention. Icon: sources are `newIDE/app/branding/assemble3_icon.png` (512 px) and `assemble3_icon_minimalistic.png` (grey, used for the loading screen in `public/index.html` via `public/res/assemble3-loading.png`); all sizes are regenerated with `python newIDE/app/branding/build-icons.py` (Pillow) (favicons + `public/res/assemble3-icon.png` + `res/assemble3-banner.png` for the About dialog; `electron-app/build/icon.{ico,icns,png}` and `build/appx/*`; Electron dev window uses `build/icon.png`). Still GDevelop's: the About dialog's contributor credits (must stay), help/forum/website links, `public/GDevelop-editor-thumbnail.png` (og:image), and source identifiers — do not rename those.

## Current state (read first in a new session)

Last updated: 2026-09-19 (see the "2026-09-19 session" paragraph below). 2026-09-18 (evening session, after the 2-hour pause): **project bar ✕ bug fixed** (`MainFrame/index.js`: the drawer is mobile-only via `c3DrawerOpen`; `c3SetProjectBarShown(open)` backs every "open project bar" path — toolbar button, ☰ View menu, command palette, editors' `openProjectManager` prop — and only the bar's ✕ hides it), **Keyboard/Mouse/Touch/Audio/… instructions moved out of `Sistema`** (user request: `C3_SYSTEM_EXTENSION_FILTER` excludes the pseudo-objects' extensions when the System tile is chosen; `extensionFilter` `{ include?, exclude? }` replaces the old include-only prop), **A6 done as option (a)** (`C3_GLOBAL_BY_DEFAULT` in `Utils/C3Objects.js`: `ObjectsList.addObject` and `ObjectGroupEditorDialog` insert into the global containers unless the user adds inside a layout folder; the global section is first, carries the `Adicionar objeto` / `+` button and opens by default, the per-layout section stays folded while empty; pt-BR sections `Tipos de objeto` / `Tipos de objeto deste layout`, `Famílias` / `Famílias deste layout`, family dialog strings; verified headless: Sprite made in Layout 1 shows and edits from Layout 2, drag-in and canvas-picker instances work), new layouts / event sheets / external layouts are numbered `Layout 2`, `Layout 3`… (`c3NumberedNameGenerator` in `Utils/NewNameGenerator.js`). Earlier the same day: parity guide Phase A — A1 category order (`C3TileGrid` `categoryOrder`), A2 pseudo-object tiles (`Utils/C3PseudoObjects.js`), A3 step 2 fully expanded, A4 new Sprite = `Animação 1` + blank `data:` frame + Piskel opens at once (`Utils/C3Sprite.js`; desktop path still to verify by hand), A5 selected rows readable, A7 layer lights only with 3D objects (`Utils/C3Layers.js`).

**Parity guide Phase B done the same evening (one commit per item, all verified headless):** B1 `Adicionar evento` opens the condition picker and cancelling removes the empty event (`EventsSheet` `_c3PendingEvent`); B2 Add… menu in Construct's order (`EventsTree/BottomButtons.js`, paste at end, global variable → variables dialog on the global tab); B3 properties bar sections open, behaviours unfolded, no `Mostrar mais`, `Editor` section with grid rows (`CompactScenePropertiesSchema.js` `makeC3EditorSchema`, `onInstancesEditorSettingsChanged` through `EditorsDisplay`); B4 bar titled `Projeto` with the project row first (properties dialog / context menu) and layout rows showing layout properties (`MainFrame.openLayout` → `deselectAll`); B5 no Extensions / Gameplay tests / Game Dashboard rows, `Arquivos do projeto`; B6 instance panel rows Posição · Tamanho · Ângulo · Opacidade · Camada · Índice Z · UID · Editar animações; B7 object editor = medium window, ✕/Esc/Fechar keep changes; B8 default names `Variavel` / `Efeito` / `Familia` (`C3_DEFAULT_NAMES` in `Utils/C3Language.js`), `Booleano`; B9 canvas tooltip + status bar in the UI language (`C3_CANVAS_LABELS`), start-page examples with pt-BR names by slug; B10 tab `Folha de eventos — Layout 1`; B11 part 1 Undo · Redo in the top bar (`EditorTabsPane` `c3UndoOrRedo`, `EventsSheetInterface` gained `undo`/`redo`), editor toolbars lost theirs; B12 layout toolbar without Objects / Families / Layers toggles; B13 layout + object row menus in Construct's order (`Visualizar layout` = `launchPreview({ c3LayoutName })`).

**Parity guide Phase C done 2026-09-18/19 (one commit per item, all verified headless):** C1 start page `ABRIR ▾` (Arquivo… · Projetos recentes ▸) + `EXPLORAR EXEMPLOS` + closable `Página inicial` tab; C2 picker dialogs as `md` windows — add-condition step 1 has a search box + `Próximo` (`C3TileGrid` `searchable` / `onSelect` / `noFooter`), add-object = `Criar novo tipo de objeto` with search, description, `Nome` field and `Inserir · Cancelar` (`NewObjectFromScratch` `onSelectionChange`, `onCreateNewObject(type, name)`); C3/C4 as before; C5 instance menu with `Clonar tipo de objeto` (`SceneEditor._c3CloneObjectType`), `Localizar todas as referências…` (`c3FindReferences` prop chain MainFrame → EditorTabsPane → BaseEditor → SceneEditor; `GlobalEventsSearchEditor.c3SearchFor`) and `Ajuda`; C6 layer rows = name · index · eye · lock, selected row = active layer (`_onChooseLayer` also updates `instancesEditorSettings.selectedLayer` for the status bar), no `Cor de Fundo` row, title `Camadas — Layout 1`; C7 theme CSS hides `.c3-tree-row-menu` (⋮), root `.c3-tree-root-button` (+) and `#add-layer-button`; C8 `EventsSheet/C3EmptyPropertiesBar.js` (empty `Propriedades` beside event sheets) + right-click `Fechar` on every bar title (EditorMosaic wrapper, docked bar title); C9 layouts open at 100 % (`InstancesEditorSettings.getRecommendedInitialZoomFactor`); C10 Preview ▾ = Visualizar layout · Visualizar projeto (`launchNewPreview({ c3FromProjectStart })`) · Depurar layout · Visualização remota (rede), no `Convidar` export tab. **2026-09-19 session:** B11 part 2 done — one top row like Construct's (☰ · project bar · save · undo · redo · Visualizar ▾ · Exportar · document tabs · the editor's own tools at the right): `TabsTitlebar` `c3RenderRow` hands its tabs to `MainframeToolbar` `c3Tabs` (`EditorTabsPane` `renderC3Toolbar`; drawers keep the old two rows). Also: `Forma 3D` tile inserts a blank 3D box (`NewObjectDialog` skips the asset-pack step while the store is hidden); object row `Adicionar à família ▸` (`ObjectTreeViewItemContent._c3AddToFamilyItem`, refresh via `ObjectsList` `c3OnObjectAddedToGroup` → `forceUpdateObjectGroupsList`) and `Adicionar uma nova família…` on the Families section's right-click menu (the `+` is hidden by C7); the empty-sheet explanation wraps. Flow clean, all pushed. Desktop Piskel path verified by the user (2026-09-19). **Upstream merged 2026-09-19** (`master` = upstream `c6d092110`, 10 commits: preferences dialog redesign, agent features, gameplay tests; one conflict in `KeyboardShortcuts/index.js` resolved keeping the c3 multi-command lookup + upstream's `handledByInGameEditor` filter; Flow/jest/headless smoke clean; the new preferences dialog hides its `Ask AI` section). Sync recipe in "Git workflow" works as written — repeat it every few weeks. **Next:** nothing planned from the parity guide; optional: C9's dashed layout-size rectangle, instance `Global ☐` toggle (skipped — objects are global by default). Ask the user for the next batch of feedback from the team.

History — 2026-09-18: `docs/c3-reference/parity-guide.md` is the phase-by-phase plan (A/B/C) for the survey items at the end of `TODO.md`; a Sprite with no animation renders as a transparent 250×250 (`res/empty_sprite.png`). Before that: side-by-side survey vs Construct 3 written to the end of `TODO.md`. Earlier 2026-09-20: project bar rework done (see TODO "Project bar rework") — every layout's event sheet is a row under `Folhas de eventos` (`ProjectManager/LayoutEventsTreeViewItemContent.js`); Objects · Families · Layers are docked in the bar between the event sheets and `Layouts externos` (`MainFrame/index.js` renders `ProjectManager` twice with `c3Section`, `MosaicEditorsDisplay` portals the three panels into `#c3-project-bar-panels`, `TreeView` `fitContent`, column scrolls; the layout editor mosaic is now properties + canvas); the add-object / add-behaviour grids show GDevelop-only items as extra tiles after Construct's (no ⋮ toggle). Open: "Objetos" vs "Tipos de objeto", merge tab strip + toolbar, icons. 2026-09-19 (night): dark surround outside the layout frame (`InstancesEditor/Background.js`), Align ▸ submenu (`SceneEditor/index.js` `_alignSelection`), example browser shows the example grid only, behaviours editor / effects list tinted, and the 9 Construct behaviours with no GDevelop port as our own events-based extensions (`Utils/C3Extensions/A3*.json`, `bundledExtension` rows in `Utils/C3Behaviors.js`, installed via `importedSerializedExtensions`; pt-BR strings; `C3Extensions.spec.js`). Earlier 2026-09-19: docked project bar — `MainFrame/index.js` renders the `ProjectManager` element in a `.c3-project-bar` column at the right of `PanesContainer` on desktop (`c3ProjectBarDocked`, toolbar button shows/hides it, the drawer stays for mobile). Event sheet keys are Construct's (`KeyboardShortcuts/DefaultShortcuts.js`; new commands `ADD_CONDITION`/`ADD_ACTION`/`ADD_ELSE_EVENT`/`ADD_GROUP_EVENT`; `useKeyboardShortcuts` runs the first *registered* command bound to a key so editors can share letters). Picker step 2 shows the hovered item's description; event context menu in Construct's order; GDevelop tutorial banners hidden. Phase 4 done earlier the same day (context menus, double-click insert, status bar, panel order). Icons: applied 2026-09-20 — `public/res/c3-icons/{behaviors,objects}/*.png` are committed (user decision), the root `C3-Icons/` stays local (`/C3-Icons/` in `.git/info/exclude`); `Utils/C3Icons.js` wraps `getIconFilename`, tiles and non-sprite thumbnails use the slugs; GDevelop-only items got their own flat icons too (122 drawn by the user, mapped by type in `C3Icons.js`); a new extension showing up later needs a PNG + a row there. Flow clean.

Done (Phase 0 complete):
- Clone at `D:/Projetos/GDevelop-C3-Reskin` (blobless partial clone; `git fetch` lazily pulls blobs — first checkout of old files may be slow).
- Remotes: `upstream` = 4ian/GDevelop, `origin` = thiagobarrado99/GDevelop-C3-Reskin (GitHub fork exists, `gh` is logged in as `thiagobarrado99`).
- Branch `c3-reskin` (tracks `origin/c3-reskin`). `master` untouched = upstream. Commits prefixed `c3:`.
- `docs/c3-reference/` holds the 5 Construct 3 screenshots described below — **local only**: `/docs` is gitignored upstream and they are Scirra's UI, so they are not in git. Measured palette is in "Style takeaways" so the notes survive without them.
- `newIDE/app` and `newIDE/electron-app` are installed (`npm ci`, Node 25 works, no OpenSSL flag needed). `npm start` compiles and serves http://localhost:3000; Electron opens Assemble3 against it.
- `TODO.md` holds the per-phase checklist; Phase 0 done, Phase 1 core done (theme `Construct-like Dark` as default, `pt_BR` default language, runtime terminology rewrite, JS events / exporters / AI / storefront hidden), Phase 2 mostly done (start page `HomePage/C3StartPage.js` + `.css`, new-project dialog `ProjectCreation/C3NewProjectDialog.js`, menu, toolbar, panels, local files, brand — leftovers listed below), Phase 6 started (colour tokens + properties panel tint). Every reskin edit in upstream files carries a `// c3:` comment — grep it to find them. New UI strings get their pt-BR in `reskinPtBr` inside `C3Terminology.js`.

Local files only (2026-09-18): `CloudStorageProvider` is removed from both apps' provider lists. Web build opens/saves through `ProjectsStorage/BrowserFileStorageProvider`: with the File System Access API (Chrome/Edge) "Abrir"/"Salvar como" use the system picker and Ctrl+S writes back to the same `.json` after the browser's permission prompt (handles persisted in IndexedDB so recent projects reopen); without it (Firefox/Safari) "Abrir" reads a picked file and saving downloads a zip. A `.zip` from "Baixar uma cópia" can be opened too (assets inlined as `data:` URLs); its first save asks for a project file. **Project files use the `.a3p` extension** (Assemble3 project — the user's name for this fork; plain GDevelop JSON inside, `.json` still opens): constants in `ProjectsStorage/C3ProjectFile.js`, used by the local (desktop) and browser providers; `electron-builder-config.js` registers the file association. `MainFrame/index.js` skips the "where to open/save" dialogs when a single provider is available. On the web build, files picked from the device are inlined as `data:` URLs (`FileToCloudProjectResourceUploader.js`, `// c3:`) so they live inside `game.json` — fine for classroom-size sprites, keep an eye on project size.

Phase 2 shell (2026-09-18): ☰ opens the Construct menu tree (`MainFrame/C3MainMenu.js`, rendered through a `ContextMenu` anchored under the button in `MainFrame/index.js`); toolbar = Project bar · Save · Preview ▾ · Export on the left (`MainFrame/Toolbar/index.js`); layout editor default mosaic = properties left + canvas, the side panels are in the docked project bar since 2026-09-20 (`MosaicEditorsDisplay/index.js`); theme-scoped CSS in `ConstructLikeDarkTheme/ConstructLikeDark.css` (body carries the theme's root class) squares bars and tabs; system font via the `gdevelop.modern-font-family` override in `theme.json`. The project manager is still a drawer (`ProjectManager/index.js`, old menu row hidden).

Defaults changed to match Construct (2026-09-18): new projects keep their game size on startup (`setSizeOnStartupMode('')` in `ProjectCreation/CreateProject.js`); new layouts start with an rgb(50, 50, 50) background (`MainFrame/index.js` first layout, `ProjectManager/index.js` new scene); the PlatformerObject's up arrow jumps (runtime edit, see Decisions).

Pending / next steps, in order:
0. Icons: done 2026-09-20 (see "Icons" above). Object label colour split (`#00768e` icons / `#00b1cc` text) stands until told otherwise.
1. Phase 2 leftovers: docked project bar done 2026-09-19 (a column next to the panes, not an editor-tab kind). Done 2026-09-18 (night): close-tab confirmation on unsaved changes only, project bar order, recent-project context menu, layer context menu (add above/below), dialog chrome (title strip + filled fields + grey buttons, all theme CSS keyed on the `c3-dialog-title` class in `UI/Dialog.js`). Close-tab confirmation on unsaved changes only is done (`MainFrame/index.js`, `// c3:`; invisible in dev because `CloseConfirmDialog` skips `Window.isDev()`).
2. Phase 6 (see "Colour coding, behaviours and icons"): done so far — colour tokens, properties panel tint, project bar rows + tabs by kind, Solid/Platform/Jump-thru renames, tile grid (`UI/C3TileGrid.js`) in the add-behaviour dialog. The 1:1 behaviour table `Utils/C3Behaviors.js` feeds the grid and applies presets on add (22 of 32 tiles ported; 10 have no GDevelop equivalent — listed as "no port yet" in the table). Instance panel edit-through done. Next: `C3-Icons/` applied (user-supplied 64 px icons, map + wrapper described there) once the user answers step 0; Add-object dialog is a tile grid too (`Utils/C3Objects.js`, 13 tiles; extension-only Construct objects are left to the add-condition list).
3. Phase 3 event sheet (see survey + TODO): done — stepped add-condition/action flow, margin numbers, selection, context/Add menus in Construct's order, hovered-item description, Construct's keys. Left: per-event `Add…` link (low value).
4. Phase 4 layout view: done — context menus, double-click insert, status bar, panel order, dark surround, Align ▸ (Z-order bar = GDevelop's instances list).
5. Phase 5 polish: done (shortcuts, tutorial banners hidden, README banner, example browser; animation editor stays GDevelop's). Behaviours with no port: done as own extensions. Project bar rework done 2026-09-20. Left: icons once the user copies them in.

Gotchas:
- Tooling: one jest file = `CI=true npx react-app-rewired test --env=node <path>` (run from `newIDE/app`); prettier is 1.x — `--list-different`, not `--check` (that one hangs on stdin); `npx flow check` cold start ≈ 10 min on the HDD, run it in the background; lint-staged runs prettier + eslint on commit. Verify UI with a headless Playwright script (global npm install, `require(process.env.APPDATA + '/npm/node_modules/playwright')`) against the dev server rather than eyeballing. When scripting file edits from a Python heredoc, `\b`/`\d` in regex literals get mangled — use the Edit tool for those lines. A long Python script inside a Bash heredoc (triple-quoted strings, backticks) broke bash's parser — write the script to the scratchpad with the Write tool and run `python <path>`. To enumerate built-in behaviour/object type names and icon paths: `require('<newIDE/app>/public/libGD.js')().then(gd => gd.JsPlatform.get().getAllPlatformExtensions() …)` in node (`getBehaviorsTypes()`, `getExtensionObjectsTypes()`, `getBehaviorMetadata(t).getFullName()/getIconFilename()`); JS extensions (Physics2, Tween, Scene3D, TileMap, …) are not loaded there — grep `Extensions/*/JsExtension.js` for `addBehavior(`/`addObject(`.
- `D:` is a SATA HDD (C: is NVMe; user chose to stay on D:). Expect `npm ci` ≈ 45–60 min, deleting `node_modules` ≈ 15 min, slow webpack first compile. Before killing an npm that "looks stuck", check `Get-Counter '\PhysicalDisk(0 D:)\% Disk Time'` — if the disk is saturated it's working. Defender exclusion for the repo folder is already added.
- Windows: use forward slashes; Git Bash is available. Line endings: repo is LF, keep files LF. `core.autocrlf=false` is set locally; the working copy was checked out as CRLF, so run prettier / strip `\r` on any file you edit before committing.
- Node 25 installed locally; CI uses 24. Works as-is.
- Launching Electron from a VS Code-spawned shell: `env -u ELECTRON_RUN_AS_NODE npm run start` (VS Code leaks `ELECTRON_RUN_AS_NODE=1`, which makes `electron-is-dev` throw "Not running in an Electron environment").
- Dev server log check: Playwright headless script pattern in scratchpad worked; `npx playwright open http://localhost:3000` for interactive.
- `react-app-rewired` + CRA 5; config in `newIDE/app/config-overrides.js`.
- Do not commit `newIDE/app/resources/`, `node_modules/`, or `build/`.
- Team language is pt-BR: **`pt_BR` is the default language** (user requirement), English must stay selectable. Only compiled catalogs (`src/locales/<locale>/messages.js`) are in git — `.po` sources live on Crowdin and `compile-translations` is skipped on Windows — so terminology changes are done at runtime in `src/Utils/i18n/C3Terminology.js` (regex rules over `i18n._` output, per language, with jest tests), never by editing catalogs.

## Goals

1. Construct-3-like editor: panel layout, terminology, event sheet look, layout-view feel, dialogs flow.
2. Event-based only. No user-facing JS/TS code events (hide them, don't remove them from Core).
3. Ship targets: web (`newIDE/app`) and desktop (`newIDE/electron-app`). HTML5 export only in the UI; other exporters hidden.
4. Stay **upstream-mergeable**: all changes live in `newIDE/`. Merge `upstream/master` regularly.

## Non-goals / rules

- **Do not modify `Core/`, `GDJS/`, `GDevelop.js/`, `Extensions/`** unless a decision is logged below (see 2026-09-18 for the one existing runtime edit). Editing C++ means an Emscripten build and losing easy upstream sync; runtime `.ts` in `GDJS/Runtime` and `Extensions/` only needs the esbuild step the dev server already runs.
- Do not copy Construct 3 code, assets, icons, docs, or the "Construct" name. Clone concepts and workflow only.
- Keep GDevelop's expression syntax (`Sprite.X()`, `ToString()`), project format (GDevelop JSON, saved as `.a3p`), and object model (objects per scene + global objects). Work around, don't rewrite.
- Prefer a **new theme + new locale + layout config** over touching component logic. Escalate to component edits only when needed for the C3 feel.

## Terminology map (C3 → GDevelop)

| Construct 3 | GDevelop | Notes |
|---|---|---|
| Layout | Scene | rename in UI only |
| Event sheet | Events (scene events / external events) | |
| Object type | Object (scene or global) | GD objects default per-scene; nudge users to global objects |
| Family | Object group | |
| Instance variable | Object variable | |
| Global/local variable | Global / scene / local variable | |
| Behavior | Behavior | same |
| Layer | Layer | same |
| Container | Linked objects extension (approx.) | |
| Else | Else event | exists upstream (`BuiltinCommonInstructions::Else`) |
| Trigger once | Trigger once | exists |
| Or block | Or condition | exists |
| Function | Events function (extension) | |
| Project bar | Project manager | |
| Properties bar | Properties panel | |
| Image/animation editor | Sprite editor + Piskel | |

Rename via lingui strings first (see i18n), not by editing source identifiers.

## Repo map

```
Core/             C++ project/event model, code generator → WASM (libGD.js). DO NOT TOUCH.
GDJS/Runtime/     JS game runtime (Pixi.js/Three.js). DO NOT TOUCH.
Extensions/       Behaviors & objects (Platformer, TopDown, Physics2, Tween, Pathfinding, Draggable, Anchor…). DO NOT TOUCH.
GDevelop.js/      Emscripten bindings; libGD.js is auto-downloaded by newIDE (no local C++ build needed).
newIDE/app/       The editor (React 18, Material-UI v4, Flow types, Pixi canvas). ALL OUR WORK IS HERE.
newIDE/electron-app/  Desktop wrapper (Electron 32). Needs `newIDE/app` dev server running.
```

Key editor dirs (`newIDE/app/src/`):

| Path | What | Size |
|---|---|---|
| `MainFrame/index.js` | App shell, tabs, toolbar, menus, panes | 6.5k lines |
| `MainFrame/EditorTabs`, `PanesContainer`, `Toolbar` | Tab bar / docking / top toolbar | |
| `MainFrame/EditorContainers/` | Scene / events / external layout containers | |
| `SceneEditor/index.js` | Layout editor orchestrator | 3.7k |
| `SceneEditor/MosaicEditorsDisplay/index.js` | **Panel layout** (`initialMosaicEditorNodes`: properties 20% left + canvas; Objects / Families / Layers are portalled into the docked project bar) | 650 |
| `InstancesEditor/` | Pixi canvas: selection, move/resize/rotate, grid, status bar | 2k |
| `EventsSheet/index.js` | Event sheet orchestrator | 3.2k |
| `EventsSheet/EventsTree/` | Event rows; `Renderers/StandardEvent.js`, `Instruction.js`, `ConditionsActionsColumns.js`, `style.css`, `SortableEventsTree.css` | 1.3k |
| `EventsSheet/InstructionEditor/` | Add/edit condition/action dialog (`InstructionOrObjectSelector.js` → `InstructionParametersEditor.js`) | |
| `EventsSheet/ParameterFields/` | Parameter inputs + expression autocomplete | |
| `ObjectsList/`, `ObjectGroupsList/`, `LayersList/`, `PropertiesEditor/`, `CompactPropertiesEditor/` | Side panels | |
| `ObjectEditor/` | Object/sprite/animation editor | |
| `ProjectManager/` | Project tree | |
| `UI/Theme/` | Themes (`<Name>Theme/theme.json` + `index.js`, `ThemeRegistry.js`) | |
| `UI/` | Shared MUI wrappers | |
| `ExportAndShare/` | Export dialogs (hide non-HTML5) | |
| `locales/` | lingui catalogs, 62 locales; `en` is source | |

## Construct 3 visual reference

Screenshots of the real C3 editor (pt-BR UI — the team works in Portuguese, keep `pt_BR` locale working) live in `docs/c3-reference/` (local only). **`docs/c3-reference/ui-survey.md` (tracked) is the full UI survey taken with Playwright on the live editor — menus, dialogs, properties, context menus, condition/action lists, en + pt-BR labels. Read it before working on any screen.** The essentials are in "Construct 3 UI essentials" below.

| File | Shows | Use for |
|---|---|---|
| `01-start-page.png` | Start page: logo top-left; NEW / OPEN wide buttons; columns "Recent projects", "Learn", "Participate", "Explore" as flat grey cards with teal icons; "Recommended examples" thumbnails; top bar = ☰ MENU, save, undo/redo, play, tabs, "Free edition"/user on the right | Home page (`MainFrame/EditorContainers/HomePage`), top bar |
| `02-new-project-dialog.png` | New project dialog: label-left / field-right form (Name, Preset, Viewport size WxH + ratio, Orientation, Start with, "Optimize for pixel art" checkbox); Help bottom-left, Create/Cancel bottom-right; title bar with ✕ | All dialogs (`UI/Dialog`), `ProjectCreation/` |
| `03-layout-view.png` | Main editor: **Properties bar left** (collapsible sections LAYOUT / EFFECTS / EDITOR, label-left value-right rows), **layout canvas centre** with 2D/3D/eye toggle floating at top and status "Mouse: (x,y) · Active layer · Zoom" bottom-right, **Project bar top-right** (tree: Layouts, Event sheets, Scripts, Object types, Families, Timelines; search box), **Layers bar bottom-right** (checkbox visibility, lock, name, index), **Asset browser bottom** panel; tabbed doc area (Home / Layout 1 / Event sheet 1); panels have uppercase titles with pin/close icons; bottom-right tab strip "Layers / Mosaic" | Phase 2 shell + Phase 4 layout view; `SceneEditor/MosaicEditorsDisplay`, `PropertiesEditor`, `ProjectManager`, `LayersList` |
| `04-add-condition-dialog.png` | Add condition dialog step 1: "Choose an object to create a condition from" + search; grid of big object tiles (icon over name, white tile); Cancel/Help left, Next right. Behind it: empty event sheet with "Add event" link top-left, "+ Add…" top-right | `EventsSheet/InstructionEditor/InstructionOrObjectSelector.js` |
| `05-event-sheet-add-menu.png` | Event sheet "+ Add…" dropdown: Add event / function / custom action / JavaScript / TypeScript / comment / group / global variable / include event sheet / Paste / Event sheet ▸ — icon + label rows, dark popover | `EventsSheet/Toolbar.js`, context menus. Omit JS/TS entries. |

Style takeaways (sample exact hex from the PNGs when building the theme):

- Dark neutral greys only (measured with PIL, region modes): panel bg `#474747`; panel title bar / top toolbar `#4f4f4f`; text fields, search boxes, canvas outside layout, popover bg `#303030`; buttons/dropdowns `#575757`; gaps/borders between panels `#6b6b6b`; canvas layout area `#5e5e5e`; event sheet bg `#282828`; start page bg `#2c2c2c`, its cards `#3b3b3b`; dialog body `#575757`, title bar/buttons `#696969`, fields `#383838`. Selected list row `#f7f7f7` and active doc tab `#fff2cc`, both with dark text; bottom tab strip active `#fff` / inactive `#323232`.
- Accents: green `#2fcc63` (layouts, event sheets, "Add event" links), cyan `#00b1cc` (object types, families), light-green links `#29e5a2`. Only red is the "Buy" button `#f85753`. Text ≈ `#e0e0e0`, labels/titles ≈ `#9e9e9e`.
- Flat, square-ish corners (2–3 px), thin 1 px borders, no shadows/elevation, no Material ripple.
- Panel headers: UPPERCASE small text, pin + ✕ icons right.
- Properties: two-column label/value rows, collapsible section headers with ▼.
- Dialogs: centred, title bar with ✕, grey buttons, Help bottom-left.
- Font: system sans (Segoe UI on Windows), ~13 px.

## Construct 3 UI essentials (from the survey)

- **Shell**: top bar = `Menu` ☰ · Save · Undo ▾ · Redo ▾ · Preview ▶ ▾ · document tabs (Start page, Layout 1, Event sheet 1; active tab cream) · right: edition chip + user. Bars: Properties left (full height); Project top-right with search; Layers bottom-right with tab strip `Layers - Layout 1 | Tilemap`; Asset Browser bottom. Bar titles are plain text with pin + ✕; bar-title context = Undock · Pin · Open to popup window · Close.
- **Menu**: Start page · Project ▸ (Save, Save as, Preview, Remote preview, Debug, Export, Close project, New, Open) · Guided tours ▸ · View ▸ (Start page, Example browser, Addon manager, Export manager, Storage cleanup) · Account ▸ · Get addons · Asset Store · Settings · Help · About. *pt: Página inicial · Projeto · Tours guiados · Exibir · Conta · Obter complementos · Loja de Assets · Configurações · Ajuda · Sobre; Salvar · Salvar como · Visualizar · Depurar · Exportar · Fechar projeto · Novo · Abrir.*
- **Start page**: big `NEW` / `OPEN ▾` / `BROWSE EXAMPLES`; `RECENT PROJECTS` list; card columns LEARN / PARTICIPATE / EXPLORE; `RECOMMENDED EXAMPLES` thumbnails. *pt: NOVO / ABRIR / EXPLORAR EXEMPLOS / PROJETOS RECENTES / APRENDER / PARTICIPAR / EXPLORAR / EXEMPLOS RECOMENDADOS.*
- **New project dialog**: Name · Choose preset (SD landscape 16:9 = 854×480 default …) · Viewport size W×H + ratio · Orientations · Start with · ☐ Optimize for pixel art; Help left, Create/Cancel right. Defaults: "New project", "Layout 1", "Event sheet 1", "Layer 0" (*Novo projeto, Layout 1, Folha de eventos 1, Camada 0*).
- **Project bar tree**: Layouts · Event sheets · Scripts · Object types · Families · Timelines · Flowcharts · 3D models · Sounds · Music · Videos · Fonts · Icons & screenshots · Files (*Layouts · Folha de eventos · Scripts · Tipos de objeto · Famílias · Linhas do tempo · Fluxogramas · Modelos 3D · Sons · Música · Vídeos · Fontes · Ícones & capturas de tela · Arquivos*). Item context = Open · Rename · Delete · Duplicate · Edit event sheet · Preview layout · Cut/Copy/Paste · Help (*Abrir · Renomear · Excluir · Duplicar · Editar folha de eventos · Visualizar layout*).
- **Properties bar**: label-left/value-right rows in grey collapsible sections. Layout = LAYOUT (Name, Event sheet, Size, Unbounded scrolling, Sampling, Projection, Vanishing point) · EFFECTS · EDITOR (Margins, Show grid, Snap to grid, Grid size, Grid offset, Pixel snapping, Show collision polygons, …). Instance = Object type properties (Name, Global, Plugin) · Common (Position, Size, Angle, Rotation, Opacity, Color, Sampling, Layer, Z index, UID, Tags) · Instance variables · Behaviors · Effects · Container · Template · Properties (Animations → Edit, Size → Make 1:1, Initially visible, Initial animation/frame, Enable collisions) · Editor (Visible in editor, Locked). Last row "More information → Help".
- **Layout view**: floating 2D/3D/eye toggle top-centre; status bar bottom-right `Mouse: (x, y) · Active layer: … · Zoom: …%`; double-click = Insert new object; context = Insert new object · Timeline ▸ · View ▸ · Edit event sheet · Paste · Help. Instance context = Edit · Insert new object · Add ▸ · Z Order ▸ · Align ▸ · Lock ▸ · Mesh ▸ · View ▸ · Cut · Copy · Paste · Clone object type · Delete · Find all references… · Help. Object picker = "Create new object type" dialog: search + tile grid grouped by category (3D, Data & storage, General, HTML elements, Input, Media, …), Name field, Insert/Cancel. Inserting a Sprite opens the Animations Editor (paint tools left, toolbar top, Animations + Animation Properties right, Frames strip bottom).
- **Event sheet**: `Add event` link top-left, `Add…` top-right; rows = margin number · `[icon Object] condition` blocks · actions column with `Add action` placeholder · per-event `Add…`. Add menu = Add event · Add function · Add custom action · Add comment · Add group · Add global variable · Include event sheet · Paste (JS/TS entries omitted in our fork). Condition context = Edit · Add another condition · Invert · Replace condition · Replace object · Toggle · Cut · Copy · Paste · Delete · Copy as text. **Add condition flow**: (1) object tiles (System first) → Next; (2) grouped two-column list with search, description of the hovered item on top, Back/Next; (3) parameters form label-left, Cancel · Help · Find Expressions left, Back · Done right. Comparison operators are shown as `= Equal to, ≠ Not equal to, < Less than, ≤ Less or equal, > Greater than, ≥ Greater or equal`. *pt: Adicionar evento · Adicionar… · Adicionar ação · Escolha um objeto para criar uma condição a partir dele · Sistema · Próximo/Voltar/Pronto · Encontrar Expressões.*
- **Verbs (pt-BR)**: Definir (set), Comparar, Ao… (on…), Está… (is…), Selecionar (pick), Excluir (delete), Renomear, Duplicar, Recortar/Copiar/Colar, Visualizar (preview), Exportar.

## Colour coding, behaviours and icons (user requirements, 2026-09-18)

**Colour coding** — every kind of thing has one colour, used consistently so students find their way by colour (as in Construct 3):

| Kind | Colour | Where it shows |
|---|---|---|
| Layouts | yellow | project bar row background, the open editor tab background, icon tint |
| Event sheets | green | same |
| Behaviours | red `#f75651` (sampled from the C3 behaviour icons) | behaviour rows/tiles in the object editor, add-behaviour dialog, behaviour tabs |
| Effects | purple | effect rows, add-effect dialog |
| Objects | cyan `#00768e` (sampled from the C3 object icons) for icons; labels use `#00b1cc` (`--c3-object-label-color`, readable on grey) | object tiles/rows, object labels, object icons |

Shades are CSS variables on the theme root in `ConstructLikeDarkTheme/ConstructLikeDark.css` (`--c3-layout-color`, `--c3-event-sheet-color`, `--c3-behavior-color`, `--c3-effect-color`, `--c3-object-color`); components use `var(--c3-…-color, inherit)` so other themes are unaffected — never hardcode a hex in a component. Done so far: properties panel section titles + behaviour/effect names, object editor dialog tabs. Pointers: project bar rows = `ProjectManager/SceneTreeViewItemContent.js`, `ExternalEventsTreeViewItemContent.js`, `ExternalLayoutTreeViewItemContent.js`; tabs = `MainFrame/EditorTabs/DraggableEditorTabs.js` + `UI/ClosableTabs.js`, keyed by the editor tab `kind` (`'layout'`, `'layout events'`, `'external events'`, `'external layout'`, …); behaviours = `BehaviorsEditor/`, effects = `EffectsList/`.

**Add-behaviour dialog** (`BehaviorsEditor/NewBehaviorDialog.js`, currently a vertical list with descriptions) must become Construct's: a horizontal grid of tiles (icon on top, name below), grouped by category, side by side; the description of the clicked tile appears at the bottom of the dialog; Add/Cancel. Same idea later for the object picker ("Create new object type" survey notes).

**Instance panel shows everything from the object (user request, 2026-09-18 — done the same night)**: clicking an instance in the layout shows *all* its behaviours and effects, like Construct. In `InstancesEditor/CompactInstancePropertiesEditor/index.js` (`// c3:`) the non-overridable behaviours (Physics2/Physics3D/Physics, `notOverridableBehaviorTypes`) render the object-level editor (`CompactBehaviorsEditorService.getEditor(type)` on `object.getBehavior(name)`) under a "Compartilhado por todas as instâncias do objeto." note, and `CompactEffectsListEditor` on `object.getEffects()` is mounted after the behaviours section; both edit the object and open the full object editor via `editObjectInPropertiesPanel`.

**Icons (user-supplied, 2026-09-18)** — `C3-Icons/` at the repo root (untracked so far, see the note at the end):

- `all_behaviours_list.png` / `all_objects_list.png`: Construct's pt-BR add-behaviour and add-object grids. They give the tile look for the grid dialogs (icon over label, category headers `ATRIBUTOS`, `GERAL`, `MOVIMENTOS`, `3D` …), the pt-BR label of every entry, and the category each belongs to.
- `behaviour_icons/*.png` (32) and `object_icons/*.png` (62): one file per tile, **64×64 RGBA, transparent background, one flat colour** (behaviours `#f75651`, objects `#00768e`). File name = the tile's pt-BR label slugged (lowercase, accents stripped, spaces/`&` → `-`): `solido.png` = "Sólido", `arrastar-e-soltar.png` = "Arrastar & Soltar", `8-direcoes.png` = "8 Direções".
- Because they are single-colour, ship them as **masks** rather than fixed pictures: `background-color: var(--c3-behavior-color)` (or `--c3-object-color`) with `mask-image: url(...)`/`-webkit-mask-image`, so the colour coding stays in one CSS variable and one PNG serves every size. If an `<img>` is unavoidable, use the PNG as-is.

How GDevelop finds an icon: `behaviorMetadata.getIconFilename()` / `objectMetadata.getIconFilename()` (libGD, e.g. `CppPlatform/Extensions/platformicon.png`, served from `newIDE/app/public/`) is read at ~15 call sites (`grep -rn getIconFilename src`) and shown through `UI/IconContainer.js` (`CorsAwareImage` on a white gradient, `iconWithBackgroundStyle` — that background must go for flat icons on the dark theme; drop it under the theme's body class). **Do not touch the call sites**: put the icons in `newIDE/app/public/res/c3-icons/{behaviors,objects}/<slug>.png`, add one module `Utils/C3Icons.js` holding the type → slug map below, and wrap `gd.BehaviorMetadata.prototype.getIconFilename` and `gd.ObjectMetadata.prototype.getIconFilename` once after libGD loads (`src/index.js`, where `global.gd = gd` is set, same idea as the `i18n._` patch) to return `res/c3-icons/…` when `this.getName()` is in the map and fall through otherwise. Sprite objects keep showing their first frame in lists (`ObjectsRenderingService` thumbnail), as Construct does. Then the swap really is a file drop.

Behaviour map (`getName()` → file; those marked *ext* are not built in — find the matching community extension when doing the parity survey, else leave the row unmapped):

| GDevelop behaviour type | C3 file | C3 label (pt / en) |
|---|---|---|
| `PlatformBehavior::PlatformBehavior` | `solido.png` (`pular-atraves.png` when the platform type is jumpthru, once rows can tell) | Sólido / Solid |
| `PlatformBehavior::PlatformerObjectBehavior` | `plataforma.png` | Plataforma / Platform |
| `TopDownMovementBehavior::TopDownMovementBehavior` | `8-direcoes.png` | 8 Direções / 8 Direction |
| `Physics2::Physics2Behavior`, `Physics3D::Physics3DBehavior`, `PhysicsBehavior::PhysicsBehavior` | `fisica.png` | Física / Physics |
| `Physics3D::PhysicsCar3D` | `carro.png` | Carro / Car |
| `DraggableBehavior::Draggable` | `arrastar-e-soltar.png` | Arrastar & Soltar / Drag & Drop |
| `AnchorBehavior::AnchorBehavior` | `ancora.png` | Âncora / Anchor |
| `Tween::TweenBehavior` | `interpolacao.png` | Interpolação / Tween |
| `PathfindingBehavior::PathfindingBehavior` (+ `PathfindingObstacleBehavior`, NavMesh) | `explorador-de-rotas.png` | Explorador de rotas / Pathfinding |
| `DestroyOutsideBehavior::DestroyOutside` | `destruir-externamente.png` | Destruir externamente / Destroy outside layout |
| `Scene3D::Base3DBehavior` | `billboard.png` (closest; Construct has no "3D object" behaviour) | Billboard |
| *ext* Bullet / Sine / Fade / Flash / Rotate / Orbit / MoveTo / Follow / Pin / Wrap / Timer / Turret / Bound to layout / Scroll To / Line of sight / Tile movement / Shadow caster / Persist / No save / Custom | `projetil` `senoide` `esmaecer` `piscar` `girar` `orbita` `mover-para` `seguir` `fixar` `dar-a-volta` `cronometro` `canhao` `restrito-ao-layout` `centrar-em` `campo-de-visao` `movimento-em-grid` `projetor-de-sombra` `persistir` `nao-salvar` `personalizado` | see `all_behaviours_list.png` |

Object map:

| GDevelop object type | C3 file | C3 label (pt / en) |
|---|---|---|
| `Sprite` | `sprite.png` | Sprite |
| `TextObject::Text`, `BBText::BBText`, `BitmapText::BitmapTextObject` | `texto.png` (`fonte-de-sprites.png` for BitmapText) | Texto / Text, Fonte de sprites / Sprite font |
| `TiledSpriteObject::TiledSprite` | `plano-de-fundo-em-blocos.png` | Plano de Fundo em Blocos / Tiled Background |
| `PanelSpriteObject::PanelSprite` | `9-seccoes.png` | 9-secções / 9-patch |
| `ParticleSystem::ParticleEmitter` | `particulas.png` | Partículas / Particles |
| `PrimitiveDrawing::Drawer` | `tela-de-desenho.png` | Tela de Desenho / Drawing canvas |
| `TextInput::TextInputObject`, `TextEntryObject::TextEntry` | `entrada-de-texto.png` | Entrada de texto / Text input |
| `Video::VideoObject` | `video.png` | Vídeo |
| `TileMap::TileMap`, `TileMap::SimpleTileMap`, `TileMap::CollisionMask` | `mosaico.png` | Mosaico / Tilemap |
| `Lighting::LightObject` | `refletor.png` | Refletor / Spotlight-ish (closest) |
| `Scene3D::Cube3DObject` | `forma-3d.png` | Forma 3D / 3D shape |
| `Scene3D::Model3DObject` | `modelo-3d.png` | Modelo 3D / 3D model |
| `SpineObject::SpineObject` | `sprite.png` (no C3 equivalent) | — |
| extensions without an object (Keyboard, Mouse, Touch, Audio, Gamepad, AJAX/Network, Browser, LocalStorage/Storage, Dictionary/Array/JSON → variables, Multiplayer, Camera, Time…) | `teclado` `mouse` `toque` `audio` `gamepad` `ajax` `navegador` `armazenamento-local` `dicionario` `matriz` `json` `multiplayer` `camera-3d` `data` … | use them for the extension rows of the add-condition/action object list (Phase 3) and the project bar; the rest (Facebook, Google Play, IAP, micro:bit, Bluetooth, MIDI, …) have no counterpart — skip |

Where the icons must show up: object tiles of the add-object dialog and of the add-condition/action step 1, objects bar rows (non-sprite objects), behaviour tiles of the add-behaviour grid, behaviour rows in the properties panel / behaviours editor / instance panel, and the event sheet's instruction rows (object icon before the condition text).

**Note on the files**: the user supplied them and decided (2026-09-20) that the copies in `public/res/c3-icons/` are committed; the root `C3-Icons/` folder stays out of git (`/C3-Icons/` in `.git/info/exclude`).

**Behaviour parity is 1:1 with Construct 3 (user requirement, 2026-09-18)** — the add-behaviour dialog offers exactly Construct's behaviour list (the 32 tiles of `all_behaviours_list.png`: same names, same four categories `[3D]` · `ATRIBUTOS` · `GERAL` · `MOVIMENTOS`, same icons), nothing else. Every tile is a *port*: one GDevelop behaviour (built-in, or a community extension bundled/installed on demand) **plus the settings applied when it is added**. Several tiles may point at the same GDevelop behaviour with different settings:

- **Sólido / Solid** = `PlatformBehavior::PlatformBehavior` with `platformType = "NormalPlatform"` (jump-through disabled).
- **Pular através / Jump-thru** = the *same* `PlatformBehavior::PlatformBehavior` with `platformType = "Jumpthru"`.

The tile also fixes the behaviour's default *name* on the object, per UI language (`defaultName: { en: 'Solid', pt_BR: 'Solido' }` — identifiers: no accents, no leading digit, so 8 Direction is `EightDirection` / `OitoDirecoes`; `c3DefaultName(tile)` reads the language from `Utils/C3Language.js`, set by `applyC3Terminology`), so the properties panel reads like Construct. New objects are named after their type the same way (`C3Objects.js` `defaultName`, `getC3ObjectDefaultName` in `ObjectsList`): `Sprite`, `Texto`, `PlanoDeFundo`… GDevelop's own "Type: Platform / Jumpthru / Ladder" property stays editable afterwards — the tile only sets the initial value.

Implementation: one table in `Utils/C3Behaviors.js` — Construct label (pt / en) → `{ type, extensionName?, presets: { property: value }, defaultName, icon slug, category }`. The grid (`UI/C3TileGrid.js`, mounted by `AssetStore/BehaviorStore/index.js`) is fed from that table only; `installAndChoose` installs the extension when the type is not in the project yet, `NewBehaviorDialog.onChoose` (→ `BehaviorsEditor` `addBehavior`) applies the presets through `behavior.updateProperty(name, value)` right after `object.addNewBehavior`. GDevelop behaviours that are not in the table are listed after Construct's tiles, in their own GDevelop category (user decision 2026-09-19: everything Construct has, plus extras). The whole-string renames in `C3Terminology.js` (`Platform` → Solid, `Platformer character` → Platform, `Jumpthru platform` → Jump-thru) stay: they cover the behaviour *type* name wherever GDevelop prints it (condition/action groups, panel subtitles).

Mapping (the table in `Utils/C3Behaviors.js` is the source of truth; *ext* = reviewed community extension, installed on demand by the store flow when the tile is chosen — needs network the first time):

| Construct tile (pt / en) | Category | GDevelop port | Presets |
|---|---|---|---|
| Sólido / Solid | Atributos | `PlatformBehavior::PlatformBehavior` | `platformType=NormalPlatform`, name `Solid` |
| Pular através / Jump-thru | Atributos | `PlatformBehavior::PlatformBehavior` | `platformType=Jumpthru`, name `JumpThru` |
| Persistir / Persist | Atributos | `SaveState::SaveConfiguration` | `defaultProfilePersistence=Persisted` |
| Não salvar / No save | Atributos | `SaveState::SaveConfiguration` | `defaultProfilePersistence=DoNotSave` |
| Projetor de sombra / Shadow caster | Atributos | `Lighting::LightObstacleBehavior` | |
| Plataforma / Platform | Movimentos | `PlatformBehavior::PlatformerObjectBehavior` | name `Platform` |
| 8 Direções / 8 Direction | Movimentos | `TopDownMovementBehavior::TopDownMovementBehavior` | `allowDiagonals=true`, name `8Direction` |
| Física / Physics | Movimentos | `Physics2::Physics2Behavior` | |
| Carro / Car | Movimentos | `Physics3D::PhysicsCar3D` (3D objects only; 2D could use *ext* `PhysicsCar::PhysicsCar`) | |
| Explorador de rotas / Pathfinding | Movimentos | `PathfindingBehavior::PathfindingBehavior` | |
| Projétil / Bullet | Movimentos | *ext* `AdvancedProjectile::AdvancedProjectile` | |
| Órbita / Orbit | Movimentos | *ext* `EllipseMovement::EllipseMovement` | |
| Canhão / Turret | Movimentos | *ext* `Turret::Turret` | |
| Senóide / Sine, Girar / Rotate, Mover para / MoveTo, Seguir / Follow, Movimento em grid / Tile movement, Personalizado / Custom | Movimentos | **own extensions** `A3Sine::Sine`, `A3Rotate::Rotate`, `A3MoveTo::MoveTo`, `A3Follow::Follow`, `A3TileMovement::TileMovement`, `A3CustomMovement::CustomMovement` (`Utils/C3Extensions`, bundled JSON) | |
| Arrastar & Soltar / Drag & Drop | Geral | `DraggableBehavior::Draggable` | name `DragDrop` |
| Âncora / Anchor | Geral | `AnchorBehavior::AnchorBehavior` | |
| Destruir externamente / Destroy outside layout | Geral | `DestroyOutsideBehavior::DestroyOutside` | |
| Interpolação / Tween | Geral | `Tween::TweenBehavior` | |
| Piscar / Flash | Geral | *ext* `Flash::Flash` | |
| Fixar / Pin | Geral | *ext* `Sticker::Sticker` | |
| Dar a volta / Wrap | Geral | *ext* `ScreenWrap::ScreenWrap` | |
| Restrito ao layout / Bound to layout | Geral | *ext* `StayOnScreen::StayOnScreen` | |
| Centrar em / Scroll To | Geral | *ext* `SmoothCamera::SmoothCamera` | |
| Esmaecer / Fade, Cronômetro / Timer, Campo de visão / Line of sight | Geral | **own extensions** `A3Fade::Fade` (needs the Opacity capability), `A3Timer::Timer` (object timers + `__A3Timer[tag]` object variables), `A3LineOfSight::LineOfSight` (range + cone + point sampling against an obstacles parameter) | |
| [Billboard] | 3D | `Scene3D::Base3DBehavior` (closest) | |

## Setup / run / test

Node: CI uses 24; local has 25 (works). npm, not yarn.

```bash
cd newIDE/app
npm install
npm start                 # web editor on localhost:3000 + GDJS runtime watcher; downloads libGD.js
npm run electron-app      # desktop, in a 2nd terminal, with npm start still running
npm test                  # jest (react-app-rewired test --env=node)
npm run flow              # type check (Flow, not TS)
npm run format            # prettier on src/
npm run lint              # eslint, zero warnings allowed
npm run storybook         # component playground
npm run build-theme-resources   # after editing any theme.json
npm run create-new-theme "<Theme Name>"
npm run build             # production web build
```

Browser test: Playwright is installed globally (`npx playwright open http://localhost:3000`).

## Conventions

- Flow-typed JS (`// @flow`), Prettier, eslint max-warnings=0. Run `npm run format && npm run flow` before committing.
- All user-visible strings go through lingui: `<Trans>…</Trans>` or `t\`…\`` from `@lingui/macro`. Never import `Trans` from `@lingui/react`.
- Match surrounding code style; MUI v4 (`@material-ui/core` 4.11), not v5.
- Themes: edit `theme.json`, run `build-theme-resources`, never hand-edit generated `.css`/`.json`.
- Panel layout is a react-mosaic tree — change `initialMosaicEditorNodes` / `defaultPanelConfigByEditor`, don't fork the mosaic component.
- Commits: small, one concern each. Prefix `c3:` for reskin work so upstream merges are easy to review.

## Git workflow

```
upstream = https://github.com/4ian/GDevelop.git  (blobless partial clone; full history)
origin   = https://github.com/thiagobarrado99/GDevelop-C3-Reskin.git  (our fork; push c3-reskin here)
```

- Work on `c3-reskin` branch off `master`. Keep `master` = upstream.
- Sync: `git fetch upstream && git checkout master && git merge --ff-only upstream/master && git checkout c3-reskin && git merge master`.

## Roadmap

Phase 0 — Baseline: `npm start` works, note first impressions vs C3 side-by-side.
Phase 1 — Skin (days): `Construct-like Dark` theme in `UI/Theme`; C3 terminology via the runtime rewrite in `Utils/i18n/C3Terminology.js`; hide JS code events, non-HTML5 exporters, marketing/asset-store/AI panels the team won't use.
Phase 2 — Shell (2–4 wks): C3 panel arrangement (project bar left, properties left, layout center, layers/objects right, bottom tabs), toolbar, tab styling, ribbon-less menu.
Phase 3 — Event sheet (1–2 mo): compact rows with object icon + condition/action text, C3 colour scheme, right-click menus, add-condition/action dialog flow (object → condition → params) tuned to C3 order/keyboard flow.
Phase 4 — Layout view (2–4 wks): C3 gizmos, snap/grid defaults, z-order bar, instance-properties panel ordering.
Phase 5 — Polish: animation editor, keyboard shortcuts parity, examples, docs.
Phase 6 — Colour coding & behaviour parity (requested 2026-09-18, do right after the Phase 2 leftovers, before Phase 3): one colour per kind (layouts yellow, event sheets green, behaviours red, effects purple) in project bar rows, tabs and icons; Construct-style add-behaviour grid dialog; the user's `C3-Icons/` applied through one `getIconFilename` wrapper + type→file map (`Utils/C3Icons.js`); 1:1 behaviour parity with Construct (each tile = GDevelop behaviour + presets, e.g. Solid and Jump-thru are both the Platform behaviour); instance panel shows the object's non-overridable behaviours and effects (edit-through or "Edit on object" button). Spec in "Colour coding, behaviours and icons".

Progress is tracked in `TODO.md`.

## Decisions

- 2026-09-16: Fork GDevelop rather than write an engine; UI-only changes in `newIDE/` to stay mergeable.
- 2026-09-16: Keep GDevelop expression syntax and per-scene object model.
- 2026-09-18: **One runtime edit outside `newIDE/`** — `Extensions/PlatformBehavior/platformerobjectruntimebehavior.ts`: the up arrow also triggers a jump (Construct 3's Platform behavior default; Space/Shift kept). It is TypeScript compiled by `GDJS/scripts/build.js` (esbuild, no C++), and the `npm start` watcher rebuilds `newIDE/app/resources/GDJS` automatically. Keep such runtime edits to one-liners with a `// c3:` comment and log them here; `Core/` (C++) stays untouched.
- 2026-09-18: **Objects and families are project-wide by default** (parity guide A6, option (a)): the team's games are simple and share resources across layouts, so `Adicionar objeto` / new family create *global* objects/groups; per-layout ones stay available as an advanced fold. Implemented 2026-09-18 (evening) — `C3_GLOBAL_BY_DEFAULT` in `Utils/C3Objects.js`.
- 2026-09-17: Terminology is rewritten at runtime (`C3Terminology.js`) rather than in catalogs, because `.po` sources are Crowdin-only. Storefront/AI features are hidden by forcing upstream's classroom `hide*` flags to `true` at each check site, so upstream changes to those features merge cleanly.
