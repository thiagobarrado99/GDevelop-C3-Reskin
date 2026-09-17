# GDevelop-C3-Reskin → **Assemble3**

Fork of [GDevelop](https://github.com/4ian/GDevelop) (MIT) whose editor UI is reworked to look and feel like Scirra's **Construct 3**, so a team already fluent in Construct can switch with near-zero relearning. Open source, no feature limits, browser + desktop, HTML5 export only.

**Product name: Assemble3** (chosen by the user on 2026-09-18). Project files are `.a3p`. The name is applied at runtime to every translated string (`brandRules` in `src/Utils/i18n/C3Terminology.js`, all languages, word-boundary and case-sensitive so `gdevelop.io` URLs stay) and hardcoded through `src/Utils/C3Brand.js` (`APP_NAME`) in the window title (`ProjectTitlebar.js`), the start page, `public/index.html`, `public/manifest.json`, and the Electron `package.json`/`electron-builder-config.js` (`productName`, `executableName`, `appId: com.assemble3.ide`). Use `APP_NAME` for any new hardcoded mention. Still GDevelop's: logo/icons/thumbnails (`public/`, `electron-app/build/`), the About dialog's contributor credits (must stay), help/forum/website links, and source identifiers — do not rename those.

## Current state (read first in a new session)

Last updated: 2026-09-18.

Done (Phase 0 complete):
- Clone at `D:/Projetos/GDevelop-C3-Reskin` (blobless partial clone; `git fetch` lazily pulls blobs — first checkout of old files may be slow).
- Remotes: `upstream` = 4ian/GDevelop, `origin` = thiagobarrado99/GDevelop-C3-Reskin (GitHub fork exists, `gh` is logged in as `thiagobarrado99`).
- Branch `c3-reskin` (tracks `origin/c3-reskin`). `master` untouched = upstream. Commits prefixed `c3:`.
- `docs/c3-reference/` holds the 5 Construct 3 screenshots described below — **local only**: `/docs` is gitignored upstream and they are Scirra's UI, so they are not in git. Measured palette is in "Style takeaways" so the notes survive without them.
- `newIDE/app` and `newIDE/electron-app` are installed (`npm ci`, Node 25 works, no OpenSSL flag needed). `npm start` compiles and serves http://localhost:3000; Electron opens "GDevelop 5" against it.
- `TODO.md` holds the per-phase checklist; Phase 0 done, Phase 1 core done (theme `Construct-like Dark` as default, `pt_BR` default language, runtime terminology rewrite, JS events / exporters / AI / storefront hidden), Phase 2 started (Construct-like start page `HomePage/C3StartPage.js` and new-project dialog `ProjectCreation/C3NewProjectDialog.js`). Every reskin edit in upstream files carries a `// c3:` comment — grep it to find them. New UI strings get their pt-BR in `reskinPtBr` inside `C3Terminology.js`.

Local files only (2026-09-18): `CloudStorageProvider` is removed from both apps' provider lists. Web build opens/saves through `ProjectsStorage/BrowserFileStorageProvider`: with the File System Access API (Chrome/Edge) "Abrir"/"Salvar como" use the system picker and Ctrl+S writes back to the same `.json` after the browser's permission prompt (handles persisted in IndexedDB so recent projects reopen); without it (Firefox/Safari) "Abrir" reads a picked file and saving downloads a zip. A `.zip` from "Baixar uma cópia" can be opened too (assets inlined as `data:` URLs); its first save asks for a project file. **Project files use the `.a3p` extension** (Assemble3 project — the user's name for this fork; plain GDevelop JSON inside, `.json` still opens): constants in `ProjectsStorage/C3ProjectFile.js`, used by the local (desktop) and browser providers; `electron-builder-config.js` registers the file association. `MainFrame/index.js` skips the "where to open/save" dialogs when a single provider is available. On the web build, files picked from the device are inlined as `data:` URLs (`FileToCloudProjectResourceUploader.js`, `// c3:`) so they live inside `game.json` — fine for classroom-size sprites, keep an eye on project size.

Phase 2 shell (2026-09-18): ☰ opens the Construct menu tree (`MainFrame/C3MainMenu.js`, rendered through a `ContextMenu` anchored under the button in `MainFrame/index.js`); toolbar = Project bar · Save · Preview ▾ · Export on the left (`MainFrame/Toolbar/index.js`); layout editor default mosaic = properties left, objects top-right, layers bottom-right (`MosaicEditorsDisplay/index.js`); theme-scoped CSS in `ConstructLikeDarkTheme/ConstructLikeDark.css` (body carries the theme's root class) squares bars and tabs; system font via the `gdevelop.modern-font-family` override in `theme.json`. The project manager is still a drawer (`ProjectManager/index.js`, old menu row hidden).

Pending / next steps, in order:
1. Phase 2 leftovers in `TODO.md`: docked project bar (new editor-tab kind for the side panes), dialog button chrome, layers bar polish.
2. Phase 3 event sheet (see survey + TODO).

Gotchas:
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

- **Do not modify `Core/`, `GDJS/`, `GDevelop.js/`, `Extensions/`** unless a decision is logged below. Editing C++ means an Emscripten build and losing easy upstream sync.
- Do not copy Construct 3 code, assets, icons, docs, or the "Construct" name. Clone concepts and workflow only.
- Keep GDevelop's expression syntax (`Sprite.X()`, `ToString()`), project format (`.json`), and object model (objects per scene + global objects). Work around, don't rewrite.
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
| `SceneEditor/MosaicEditorsDisplay/index.js` | **Panel layout** (`initialMosaicEditorNodes`: properties 23% left, canvas, objects list right — already C3-ish) | 600 |
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

Progress is tracked in `TODO.md`.

## Decisions

- 2026-09-16: Fork GDevelop rather than write an engine; UI-only changes in `newIDE/` to stay mergeable.
- 2026-09-16: Keep GDevelop expression syntax and per-scene object model.
- 2026-09-17: Terminology is rewritten at runtime (`C3Terminology.js`) rather than in catalogs, because `.po` sources are Crowdin-only. Storefront/AI features are hidden by forcing upstream's classroom `hide*` flags to `true` at each check site, so upstream changes to those features merge cleanly.
