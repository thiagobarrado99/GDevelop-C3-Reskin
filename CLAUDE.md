# GDevelop-C3-Reskin

Fork of [GDevelop](https://github.com/4ian/GDevelop) (MIT) whose editor UI is reworked to look and feel like Scirra's **Construct 3**, so a team already fluent in Construct can switch with near-zero relearning. Open source, no feature limits, browser + desktop, HTML5 export only.

## Current state (read first in a new session)

Last updated: 2026-09-16.

Done:
- Clone at `D:/Projetos/GDevelop-C3-Reskin` (blobless partial clone; `git fetch` lazily pulls blobs — first checkout of old files may be slow).
- Remotes: `upstream` = 4ian/GDevelop, `origin` = thiagobarrado99/GDevelop-C3-Reskin (GitHub fork exists, `gh` is logged in as `thiagobarrado99`).
- Branch `c3-reskin` (tracks `origin/c3-reskin`), 3 commits: CLAUDE.md, reference screenshots, remote note. `master` untouched = upstream.
- `docs/c3-reference/` holds the 5 Construct 3 screenshots described below.
- `npm install` in `newIDE/app` was started 2026-09-16 (see "Pending" — verify it finished).

Pending / next steps, in order:
1. Verify install: `ls newIDE/app/node_modules/.package-lock.json`. If missing, rerun `cd newIDE/app && npm install`.
2. `cd newIDE/app && npm start` → wait for "Compiled successfully" / http://localhost:3000. First run downloads `libGD.js` and copies GDJS runtime into `newIDE/app/resources/` (gitignored). Check it opens in a browser (Playwright: `npx playwright open http://localhost:3000`).
3. `cd newIDE/electron-app && npm install && npm run start` (with the web server still running) to confirm desktop works.
4. Create `TODO.md` at the repo root with the Phase 1 checklist and start Phase 1 (theme + terminology + hiding unwanted panels).
5. Commit with `c3:` prefix, push to `origin c3-reskin`.

Gotchas:
- Windows: use forward slashes; Git Bash is available. Line endings: repo is LF, keep files LF.
- Node 25 installed locally; CI uses 24. If `npm start` fails with OpenSSL/webpack errors, try `NODE_OPTIONS=--openssl-legacy-provider` or install Node 24 via nvm-windows.
- `react-app-rewired` + CRA 5; config in `newIDE/app/config-overrides.js`.
- Do not commit `newIDE/app/resources/`, `node_modules/`, or `build/`.
- Team language is pt-BR; the reskin must keep the `pt_BR` locale working (lingui catalogs in `newIDE/app/src/locales/pt_BR`).

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

Screenshots of the real C3 editor (pt-BR UI — the team works in Portuguese, keep `pt_BR` locale working) live in `docs/c3-reference/`. Look at them before styling anything.

| File | Shows | Use for |
|---|---|---|
| `01-start-page.png` | Start page: logo top-left; NEW / OPEN wide buttons; columns "Recent projects", "Learn", "Participate", "Explore" as flat grey cards with teal icons; "Recommended examples" thumbnails; top bar = ☰ MENU, save, undo/redo, play, tabs, "Free edition"/user on the right | Home page (`MainFrame/EditorContainers/HomePage`), top bar |
| `02-new-project-dialog.png` | New project dialog: label-left / field-right form (Name, Preset, Viewport size WxH + ratio, Orientation, Start with, "Optimize for pixel art" checkbox); Help bottom-left, Create/Cancel bottom-right; title bar with ✕ | All dialogs (`UI/Dialog`), `ProjectCreation/` |
| `03-layout-view.png` | Main editor: **Properties bar left** (collapsible sections LAYOUT / EFFECTS / EDITOR, label-left value-right rows), **layout canvas centre** with 2D/3D/eye toggle floating at top and status "Mouse: (x,y) · Active layer · Zoom" bottom-right, **Project bar top-right** (tree: Layouts, Event sheets, Scripts, Object types, Families, Timelines; search box), **Layers bar bottom-right** (checkbox visibility, lock, name, index), **Asset browser bottom** panel; tabbed doc area (Home / Layout 1 / Event sheet 1); panels have uppercase titles with pin/close icons; bottom-right tab strip "Layers / Mosaic" | Phase 2 shell + Phase 4 layout view; `SceneEditor/MosaicEditorsDisplay`, `PropertiesEditor`, `ProjectManager`, `LayersList` |
| `04-add-condition-dialog.png` | Add condition dialog step 1: "Choose an object to create a condition from" + search; grid of big object tiles (icon over name, white tile); Cancel/Help left, Next right. Behind it: empty event sheet with "Add event" link top-left, "+ Add…" top-right | `EventsSheet/InstructionEditor/InstructionOrObjectSelector.js` |
| `05-event-sheet-add-menu.png` | Event sheet "+ Add…" dropdown: Add event / function / custom action / JavaScript / TypeScript / comment / group / global variable / include event sheet / Paste / Event sheet ▸ — icon + label rows, dark popover | `EventsSheet/Toolbar.js`, context menus. Omit JS/TS entries. |

Style takeaways (sample exact hex from the PNGs when building the theme):

- Dark neutral greys only: window bg ≈ `#2b2b2b`, panel bg ≈ `#333`, cards/fields ≈ `#3d3d3d`, panel title bars slightly darker, active tab light grey with dark text.
- Single accent: teal/green (`#3ac`-ish icons, green links like "Add event", green tree items for layouts/event sheets, cyan for object types/families).
- Flat, square-ish corners (2–3 px), thin 1 px borders, no shadows/elevation, no Material ripple.
- Panel headers: UPPERCASE small text, pin + ✕ icons right.
- Properties: two-column label/value rows, collapsible section headers with ▼.
- Dialogs: centred, title bar with ✕, grey buttons, Help bottom-left.
- Font: system sans (Segoe UI on Windows), ~13 px.

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
Phase 1 — Skin (days): `Construct-like Dark` theme in `UI/Theme`; C3 terminology via a custom `en` catalog override; hide JS code events, non-HTML5 exporters, marketing/asset-store/AI panels the team won't use.
Phase 2 — Shell (2–4 wks): C3 panel arrangement (project bar left, properties left, layout center, layers/objects right, bottom tabs), toolbar, tab styling, ribbon-less menu.
Phase 3 — Event sheet (1–2 mo): compact rows with object icon + condition/action text, C3 colour scheme, right-click menus, add-condition/action dialog flow (object → condition → params) tuned to C3 order/keyboard flow.
Phase 4 — Layout view (2–4 wks): C3 gizmos, snap/grid defaults, z-order bar, instance-properties panel ordering.
Phase 5 — Polish: animation editor, keyboard shortcuts parity, examples, docs.

Progress is tracked in `TODO.md` (create when Phase 1 starts).

## Decisions

- 2026-09-16: Fork GDevelop rather than write an engine; UI-only changes in `newIDE/` to stay mergeable.
- 2026-09-16: Keep GDevelop expression syntax and per-scene object model.
