# Construct 3 parity guide — fixing the survey differences, phase by phase

Companion to the "Side-by-side survey vs Construct 3" section at the end of `TODO.md` (the *what*). This file is the *how*: the order to do things in, what each step touches, and how to check it. Every item below maps to a survey checkbox; tick the TODO box when a step ships. Rules as always: `newIDE/` only, `// c3:` on every edit in upstream files, new strings get pt-BR in `reskinPtBr` (`src/Utils/i18n/C3Terminology.js`), commits `c3:`, verify with a headless Playwright run against `localhost:3000` (scripts in the scratchpad `cmp/` reproduce every screen of the survey: new project → insert sprite → select instance / layer / layout → object editor → event sheet → add condition/action).

Phases are ordered by student impact: A fixes what a Construct user *looks for and cannot find*, B what *reads differently*, C is cosmetic. Inside a phase, steps are ordered so each one can ship alone. Paths are relative to `newIDE/app/src/`.

Done already (2026-09-18): new Sprite is a transparent 250×250 placeholder on the canvas (`ObjectsRendering/PixiResourcesLoader.js` `getEmptySpritePIXITexture`, `public/res/empty_sprite.png`) — the rest of the "New Sprite" item is step A4.

---

## Phase A — "Where is it?" (High)

### A1. Category order in the add-object / add-behaviour grids — done 2026-09-18 (`C3TileGrid` `categoryOrder`, `C3_OBJECT_CATEGORIES` / `C3_BEHAVIOR_CATEGORIES`, divider `Também disponíveis`)
- **Symptom**: `Sprite` (Geral) and `Plataforma` / `8 Direções` (Movimentos) are below the fold because `UI/C3TileGrid.js` sorts categories alphabetically (`[...new Set(...)].sort()`, line ~37) and GDevelop-only categories (`Avançado`, `Câmera`, `Efeito visual`…) win.
- **Do**: give `C3TileGrid` an optional `categoryOrder: string[]` prop; known categories keep that order, unknown ones follow alphabetically after a `GDevelop` divider row. Callers pass Construct's order: objects `3D · Dados & Armazenamento · Geral · Elementos HTML · Entrada · Mídia · Outro` (`AssetStore/NewObjectFromScratch.js`), behaviours `3D · Atributos · Geral · Movimentos` (`AssetStore/BehaviorStore/index.js`). Category labels come from `Utils/C3Objects.js` / `Utils/C3Behaviors.js`; the divider label needs pt-BR + en.
- **Check**: both dialogs open with `Geral` visible without scrolling; `Sprite` is the first tile of the object grid after 3D; the extra GDevelop tiles are still there, after the divider.

### A2. Keyboard / Mouse / Touch / Audio / Gamepad… as object tiles — done 2026-09-18 (`Utils/C3PseudoObjects.js`; Dicionário / Matriz / JSON left out: GDevelop's are variables, they would only duplicate `Sistema ▸ Variáveis`)
- **Symptom**: Construct students insert `Teclado`, `Mouse`, `Toque`, `Áudio`, `Gamepad` as object types, then pick them as tiles in step 1 of Add condition/action. Ours hides them inside `Sistema` under folded groups.
- **Do** (step 1 of the picker, `EventsSheet/InstructionEditor/C3ObjectPicker.js`): add a fixed list of *pseudo-object tiles* after `Sistema` — `{ label, icon slug, extensionNames[] / group prefix }` for Teclado (`Keyboard`), Mouse (`Mouse` + touch pointer conditions), Toque (`Touch`), Áudio (`Audio`), Gamepad (extension `Gamepads` — only when installed; else hide the tile), Navegador (`Browser`/`Network` open URL…), Armazenamento local (`Storage`), AJAX (`Network`), Data (`Time`), Dicionário / Matriz / JSON (variables — Construct's are objects, GDevelop's are variables: map to the `Variables` group). Icons: `public/res/c3-icons/objects/{teclado,mouse,toque,audio,gamepad,navegador,armazenamento-local,ajax,data,dicionario,matriz,json}.png` via `Utils/C3Icons.js`. Choosing a tile goes to step 2 with the `InstructionOrExpressionSelector` filtered to that extension's instructions (same code path as `Sistema` but with a `filterExtensionNames` prop). Keep the rest of `Sistema` unchanged.
- **Do** (add-object grid, `AssetStore/NewObjectFromScratch.js` + `Utils/C3Objects.js`): the same tiles under `Entrada` / `Mídia` / `Dados & Armazenamento` marked `info: true` — clicking shows "Já disponível nos eventos: escolha *Teclado* em Adicionar condição/ação." at the bottom instead of adding anything. `Inserir` stays disabled for them.
- **Check**: new project → event sheet → `Adicionar condição` shows `Sistema · Teclado · Mouse · Toque · Áudio · Navegador · Armazenamento local · AJAX · Data` before the scene objects; double-clicking `Teclado` lists only keyboard conditions; add-object grid shows the informational tiles and cannot insert them.

### A3. Step 2 of Add condition/action: flat list, no dummy extension — (1) and (2) done 2026-09-18; (3) group icons and (4) two columns left as optional polish
- **Symptom**: `InstructionOrExpressionSelector` renders a folded tree (`Geral ▸`, `Entrada ▸`…), GDevelop icons, and the dev-only `My Dummy Extension`.
- **Do**: in `EventsSheet/InstructionEditor/InstructionOrExpressionSelector/index.js` (and `InstructionOrExpressionTreeViewItems.js`) — (1) start with every group expanded (`initiallyOpen`/`getAllGroupIds` fed to the tree's `openedNodeIds`); (2) nothing to do for `My Dummy Extension`: it is only loaded in dev builds (`filterExamples: !isDev` in `BrowserApp.js` / `LocalApp.js`); (3) group-header icons through `Utils/C3Icons.js` (extension name → slug) with the GDevelop icon as fallback; (4) if the flat look is still off, drop the group nesting and render `Category` headers as non-collapsible rows, Construct-style two columns is optional (`columns: 2` in the list via CSS `column-count` inside the theme CSS, keyed on the theme root class).
- **Check**: `Sistema` → step 2 shows `Variáveis`, `Layout`, `Temporizadores e tempo`… all open with their rows; no `My Dummy Extension`; hovered row still shows its description on top (already done).

### A4. New Sprite: blank frame, `Animação 1`, straight into the image editor — done 2026-09-18 (`Utils/C3Sprite.js`; web Piskel unblocked for local projects in `BrowserResourceExternalEditors.js`; desktop Piskel path not verified yet; the "Assistir ao tutorial" placeholder no longer shows for new sprites so it was left alone)
- **Symptom**: after inserting a Sprite the object editor opens on "Adicione sua primeira animação" (Criar com Piskel / Importar / Assistir ao tutorial); the Objects bar shows `?`. Construct creates `Animation 1` with one blank 250×250 frame and opens its editor at once.
- **Do**: in the insert path (`ObjectsList/index.js` `addObject`, Sprite type only): create a transparent 250×250 PNG resource named `<ObjectName>.png` (write it with the project's resource storage — desktop: `ResourcesList/LocalResourceExternalEditors.js` already knows how to save Piskel output next to the project; web: `data:` URL resource as `FileToCloudProjectResourceUploader.js` does), add animation `Animação 1` (en `Animation 1`, name from `Utils/C3Language.js`) with one frame pointing at it, then call the Piskel external editor on that frame (`ResourcesList/*ResourceExternalEditors.js` `edit`) — desktop in-app, web keeps the popup. Hide the "Assistir ao tutorial" button in `ObjectEditor/Editors/SpriteEditor/` (`// c3:`). List thumbnail: `RenderedSpriteInstance.getThumbnail` returns the frame → no more `?`.
- **Check**: insert Sprite → Objects bar shows a blank thumbnail, object editor lists `Animação 1` with one frame, Piskel opened (desktop) — saving a drawing updates the canvas instance.

### A5. Selected object / layer rows unreadable — done 2026-09-18 (`ConstructLikeDark.css`: `[class*='TreeView_rowContainer'][aria-selected='true'] { color: var(--theme-selection-color) }`)
- **Symptom**: selected row in the Objects section and the selected `Camada 0` row show light-grey text on white (screenshots `zoom1.png` / `zoom2.png`).
- **Do**: theme-only. `UI/Theme/ConstructLikeDarkTheme/ConstructLikeDark.css` already styles `[data-scene][aria-selected='true']` etc. (line ~124); add the same rule for object rows (`[data-object]` / the `TreeView` row inside `#c3-project-bar-panels`) and layer rows (`LayersList/LayerTreeViewItemContent.js` row) with `color: var(--c3-selected-row-text, #1e1e1e)` and the cyan/white background Construct uses (`#f7f7f7` bg, dark text; object label keeps `--c3-object-label-color` only when *not* selected). Check the theme's `theme.json` `listItem.selected*` tokens (`npm run build-theme-resources` after editing) before adding CSS.
- **Check**: Playwright screenshot after clicking the Sprite row and `Camada 0`; text contrast ≥ 4.5:1 (sample with PIL).

### A6. Objects and families project-wide by default — done 2026-09-18, option (a) (`C3_GLOBAL_BY_DEFAULT` in `Utils/C3Objects.js`; global section carries the Add button and opens by default, the per-layout one stays folded while empty)
- **Symptom**: `Objetos Globais` / `Objetos do layout`, `Grupos Globais` / `Grupos de Layouts`; a Sprite created in Layout 1 is absent from Layout 2.
- **Decision to take first** (ask the user): (a) default new objects/groups to *global* and fold the per-layout sections as "Avançado", or (b) keep GDevelop's split and only relabel. (a) matches Construct's mental model; risk: GDevelop's global objects can't be edited from every place a scene object can (e.g. some asset flows) — test `Editar objeto` from Layout 2 on a global object before committing to it.
- **Do (a)**: `ObjectsList/index.js` `addObject` → `project.insertNewObject` instead of `objectsContainer.insertNewObject` (behind a `c3` constant), same for `ObjectGroupsList` (`project.getObjectGroups()`), and instance insertion from the picker works unchanged (global objects are visible to all layouts). Relabel sections: `Tipos de objeto` / `Tipos de objeto deste layout` and `Famílias` / `Famílias deste layout` in `reskinPtBr`. Fix `Grupos de Layouts` regardless.
- **Do (b)**: relabel only + a one-line hint under `Objetos do layout` ("Visíveis apenas neste layout — use ⋮ ▸ Definir como objeto global para usar em todos").
- **Check**: create Sprite in Layout 1, open Layout 2 → it is in the bar; `Grupos de Layouts` gone.

### A7. New layers without the two 3D lights — done 2026-09-18 (`Utils/C3Layers.js`; `Efeitos 3D` section left as is, it is collapsible)
- **Symptom**: every new layer (and the first one) gets `3D Ambient Hemisphere Light` + `3D Sun Light` (`ProjectCreation/CreateProject.js` `addDefaultLightToLayer`, also called from `LayersList/index.js` line ~494), untranslated, filling the Properties bar.
- **Do**: only add the lights when the project already has a 3D object (`Scene3D::*` type in any objects container) — gate `addDefaultLightToLayer` with a helper `projectHas3DObjects(project)` in `Utils/C3Layers.js`; for 2D projects the layer has no effects. When 3D objects *are* present, name them `Luz ambiente 3D` / `Luz do sol 3D` (`reskinPtBr` regex on the effect name is not enough — set the name at creation from the UI language). In the properties bar, fold `Efeitos 3D` when empty (`LayersList/CompactLayerPropertiesEditor`).
- **Check**: new project → click `Camada 0` → Properties bar = Nome · Visível · Bloqueada · Parallax? (what GDevelop has) · Efeitos (empty). Insert a `Forma 3D` → new layers get the lights again, translated.

---

## Phase B — "Reads differently" (Medium)

### B1. `Adicionar evento` opens the condition picker — done 2026-09-18 (`EventsSheet/index.js` `_c3PendingEvent`: every new standard event selects itself and opens the condition picker; cancel with no condition/action undoes the add)
- `EventsSheet/index.js` `addNewEvent` / the `EmptyPlaceholder` `add-event-button` (`EventsTree/index.js` line ~1125) and `Add…▸ Evento` (`EventsTree/BottomButtons.js` `makeMenuTemplateBuilderForEvents`): after inserting the standard event, select it and open the instruction editor for a new condition (the same call the `C` shortcut makes — `ADD_CONDITION` in `KeyboardShortcuts/DefaultShortcuts.js`). Cancelling the picker keeps the empty event (Construct deletes it — match that: remove the event on cancel when it has no conditions/actions).
- Check: click `Adicionar evento` → picker opens; `Pronto` → event with the condition; cancel → no event left.

### B2. Add… menu = Construct's — done 2026-09-18 (`EventsTree/BottomButtons.js`; `Colar` pastes at the end when nothing is selected, `Adicionar variável global` opens the variables dialog on the global tab)
- `EventsTree/BottomButtons.js` + `EventsSheet/index.js` context menu builder: top level `Adicionar evento · Adicionar comentário · Adicionar grupo · Adicionar variável global · Incluir folha de eventos · Colar · Loops ▸ (Senão · Para cada objeto · Para cada variável filha · Repetir · Enquanto)`. `Adicionar variável global` opens the global variables dialog (`MainFrame` `openGlobalVariablesDialog` — pass the callback down through `EventsSheet` props). `Adicionar função` / `ação personalizada` are omitted (extensions are hidden). pt-BR in `reskinPtBr`.
- Check: text dump of the menu equals the list above.

### B3. Properties bar expanded by default + grid settings — done 2026-09-18 (layout sections open by default, behaviours unfolded on instances, no more `Mostrar mais` fold, `Editor` section with grid rows bound to `setInstancesEditorSettings` through `onInstancesEditorSettingsChanged`)
- `InstancesEditor/CompactInstancePropertiesEditor`, `LayersList/CompactLayerPropertiesEditor`, `SceneEditor` layout properties, `ObjectEditor/CompactObjectPropertiesEditor`: sections `Propriedades`, `Comportamentos`, `Variáveis…` open by default (`defaultOpen`/`initiallyOpen` props, keep the user's toggle in local storage). Object `Propriedades ▸ Mostrar mais` → show all. Add an `Editor` section to the *layout* properties with `Exibir grid ☐ · Alinhar ao grid ☐ · Tamanho do grid W×H · Deslocamento do grid` bound to the same state the toolbar grid button edits (`SceneEditor/index.js` `uiSettings`).
- Check: click instance → behaviours listed without a click; layout row → `Editor` section with grid rows.

### B4. Project root row + layout rows select in the bar — done 2026-09-18 (bar title `Projeto`, first row = project name → properties dialog, context menu Propriedades · Variáveis globais · Recursos; `MainFrame.openLayout` calls the open scene editor's `deselectAll` so the Properties bar shows the layout; `Propriedades do projeto` label)
- `ProjectManager/index.js`: a first row `Novo projeto` (project name, project icon) whose click opens the properties dialog (`ProjectPropertiesDialog.js`) and whose context menu = `Propriedades · Variáveis globais · Recursos`. Rename `Configurações do jogo` → `Propriedades do projeto` (`reskinPtBr`). Clicking a layout row calls `onSelectLayout` → the layout editor (if open) sets its properties panel to "layout" mode (`SceneEditor/index.js` `_onSelectLayoutProperties`; the same thing the empty-canvas click does).
- Check: click `Layout 1` row → Properties bar shows layout properties; root row opens the dialog.

### B5. Extra project-bar rows — done 2026-09-18 (`Extensões`, `Testes de jogabilidade`, `Painel do jogo` gone — `c3HiddenRootIds` in `ProjectManager/index.js`; `Recursos` → `Arquivos do projeto`; resources split by kind left for later)
- `ProjectManager/index.js`: hide `Painel do jogo`, `Testes de jogabilidade` (`GameplayTestTreeViewItemContent.js`), `Extensões` (`ExtensionTreeViewItemContent.js`) under the existing classroom `hide*` flags or a `c3` constant; keep `Layouts externos` (used) but move it after `Camadas`; rename `Recursos` → `Arquivos do projeto`. Optional later: split resources by kind into `Sons · Música · Vídeos · Fontes · Arquivos` folders (`ResourcesList` filter by `resource.getKind()`).
- Check: bar tree = Layouts · Folhas de eventos · Objetos · Famílias · Camadas · Layouts externos · Propriedades do projeto · Arquivos do projeto.

### B6. Instance panel rows like Construct — done 2026-09-18 (2D schema in `CompactInstancePropertiesSchema.js`: Posição · Tamanho · Ângulo · Opacidade · Camada · Índice Z · UID, labelled rows, `Editar animações` for sprites; the `Global ☐` toggle was skipped — objects are global by default since A6)
- `InstancesEditor/CompactInstancePropertiesEditor/index.js`: replace the icon-only X/Y/Z/W/H fields with label rows `Posição X,Y · Tamanho W,H · Ângulo · Opacidade · Camada · Índice Z`; behaviours unfolded (B3); `Editar objeto` becomes `Animações → Editar` for sprites (opens the object editor on the animations tab — already wired) plus a `Global ☐` toggle row that calls the existing "Definir como objeto global" action (`ObjectsList` `setAsGlobalObject`). `UID` = instance `getPersistentUuid()` read-only.
- Check: screenshot vs `cmp/c3-*-instance*.png`.

### B7. Object editor as a window, no cancel confirmation — done 2026-09-18 (`ObjectEditorDialog.js`: `maxWidth="md"`, ✕/Esc/`Fechar` all apply, no Cancel button)
- `ObjectEditor/ObjectEditorDialog.js`: not `fullScreen`; `maxWidth="md"`; Esc/✕ = apply (drop the "Cancelar as alterações?" prompt under `// c3:` — the changes are already in the undo stack); keep `Aplicar` as the primary button labelled `Fechar`. Behaviour properties stay in the dialog (Construct puts them in the bar; the instance panel already edits through).
- Check: open `Editar objeto`, press Esc → closes, no prompt, changes kept.

### B8. Default names + add-variable dialog — done 2026-09-18 (`C3_DEFAULT_NAMES` / `c3DefaultName` in `Utils/C3Language.js`: `Variavel`, `Efeito`, `Familia`; `Booleano`; the optional add-variable dialog was not needed)
- Translate default names at creation: `Variable` (`VariablesList/VariablesList.js` line ~1533, `VariablesEditorDialog.js`, `ObjectGroupVariablesDialog.js`), `Effect` (`EffectsList/index.js`), `Group` (`ObjectGroupsList`) → `Variavel` / `Efeito` / `Grupo` via `Utils/C3Language.js` (identifiers: no accents). `Boleano` typo → `Booleano` (`reskinPtBr` rule). Optional: a small `Adicionar variável` dialog (Nome · Tipo · Valor inicial) — only if the inline row confuses students in practice.
- Check: `+` on Variáveis → row `Variavel`; type menu says `Booleano`.

### B9. Untranslated strings
- Canvas tooltip `Sprite X: … Layer: Layer 0 Z order: 1` (`InstancesEditor/index.js` / `InstancesRenderer` hover label), status bar `Layer: Layer 0` (`InstancesEditor/StatusBar.js`), `Effect` section header, start-page example titles/descriptions (`HomePage/C3StartPage.js` — the API returns English; map the shown examples to pt-BR titles in `C3StartPage.js` or hide the description). Strings that come from lingui: add `reskinPtBr` rules; hardcoded ones: `<Trans>` + rule.
- Check: grep the text dumps `a3-*.txt` for `Layer:`, `Z order`, `Effect`, `Platformer`.

### B10. Event sheet naming
- Tab title `Layout 1 (Eventos)` → `Folha de eventos — Layout 1` (`MainFrame/EditorTabs/*` `getTabLabel` for kind `'layout events'`), bar row under `Folhas de eventos` → same label (`ProjectManager/LayoutEventsTreeViewItemContent.js`).
- Check: tab + row text.

### B11. Undo/redo + toolbar merge
- One top bar: `MainFrame/Toolbar/index.js` gains Undo · Redo after Save (wired to the active editor's `undo`/`redo` via the editor ref `MainFrame` already keeps for the toolbar), tab strip moves into the same row (`MainFrame/EditorTabs` inside the toolbar's flex row, tabs after the buttons); editor toolbars (`SceneEditor/Toolbar.js`, `EventsSheet/Toolbar.js`) drop their undo/redo and the panel toggles (Objetos · Famílias · Propriedades · Instâncias · Camadas — B12). Do it in two commits: (1) undo/redo in the top bar, (2) tab strip merge.
- Check: layout + event sheet both undo from the top bar; only one row above the canvas.

### B12. Layout toolbar toggles
- `SceneEditor/Toolbar.js`: hide the five panel toggles under the theme (they duplicate the docked bar); keep grid, zoom, delete, settings until B11.
- Check: toolbar = grid · zoom · undo · redo · delete · settings (then fewer after B11).

### B13. Row context menus in Construct's order
- Layout row (`ProjectManager/SceneTreeViewItemContent.js`): `Abrir · Renomear · Excluir · Duplicar · Editar folha de eventos · Visualizar layout · Recortar · Copiar · Colar · Propriedades do layout · Variáveis do layout · Definir como layout inicial · Ajuda`. `Visualizar layout` = launch preview on that scene (`MainFrame` `launchPreview` with `layoutName`). Object row (`ObjectsList/index.js` `buildContextMenu`): `Editar animações · Editar variáveis · Editar comportamentos · Editar efeitos · Adicionar à família · Clonar · Renomear · Excluir · Recortar · Copiar · Colar · Definir como objeto global · Mover para pasta · Adicionar instância ao layout · Ajuda`.
- Check: text dumps of both menus.

---

## Phase C — Cosmetic (Low)

### C1. Start page
- `HomePage/C3StartPage.js` + `.css`: `ABRIR ▾` dropdown (Arquivo · Projeto recente…), `EXPLORAR EXEMPLOS` button beside `EXEMPLOS RECOMENDADOS`; home tab labelled `Página inicial ✕` (`MainFrame/EditorTabs`, kind `'start page'`). Recommended examples: pt-BR titles (B9).

### C2. Picker dialogs sized like windows
- `C3ObjectPicker.js` (step 1) and `AssetStore/NewObjectFromScratch.js`: `maxWidth="sm"`, not full-screen; step 1 gains a search box (filter tiles by label) and a `Próximo` button enabled when a tile is selected; add-object dialog gains a `Nome` field prefilled with the tile's default name (`C3Objects.js` `defaultName`), title `Criar novo tipo de objeto`, buttons `Inserir · Cancelar`.

### C3. Empty event sheet placeholder
- `EventsTree/index.js` `EmptyPlaceholder` (line ~1125): drop `Assistir ao tutorial`; text = Construct's explanation ("Clique em *Adicionar evento*…"); optional sample event image drawn with our own CSS (no Construct asset).

### C4. Event sheet toolbar
- `EventsSheet/Toolbar.js`: hide the add-event / sub-event / local-variable / comment / choose-and-add buttons once B1–B2 cover them; keep search, undo/redo until B11.

### C5. Instance context menu
- `SceneEditor/index.js` instance menu: add `Clonar tipo de objeto` (duplicate object + swap the instance), `Localizar todas as referências…` (opens the events search with the object name), `Ajuda` last; drop `Extrair`, `Editar folha de eventos`, `Propriedades do layout` from the *instance* menu (they stay in the canvas menu).

### C6. Layers section rows
- `LayersList/index.js` + `LayerTreeViewItemContent.js` + `BackgroundColorTreeViewItemContent.js`: one visibility checkbox + lock + name + index; `Cor de Fundo` row moves to the layout properties (B3 `Layout` section); section title `Camadas — Layout 1`; the `+` becomes a context-menu item (C7).

### C7. `+` / `⋮` icons
- `ProjectManager/*TreeViewItemContent.js`, `ObjectsList`, `ObjectGroupsList`, `LayersList`: hide the per-row `⋮` and per-section `+` under the theme (context menu and the `Add…` items cover them). Keep keyboard/right-click paths working.

### C8. Properties bar on the event sheet + bar-title menu
- `MainFrame/index.js` / `MosaicEditorsDisplay`: keep the properties column mounted (empty, "Nenhuma seleção") when an event sheet tab is active. Bar titles (`.c3-project-bar-title`, properties header) get a context menu `Fechar` only (no docking system to undock into).

### C9. Layout framing at 100 %
- `SceneEditor/index.js` initial zoom: open at 100 % centred on the game window instead of fit-to-view 82 %; `InstancesEditor/Background.js` dark surround already reads as margins. Optional dashed 1708×960 "layout size" rectangle = game size × 2.

### C10. Preview ▾ wording, export tabs, settings
- `MainFrame/Toolbar/index.js` preview menu: `Visualizar layout · Visualizar projeto · Depurar layout · Visualização remota (rede)`; `ExportAndShare/*`: hide the `Convidar` tab; menu `Idioma` moves inside `Configurações` (or stays — low value).

### C11. Not planned (by decision)
Asset Browser panel, `Mosaico` bar, timelines/flowcharts, `Tours guiados`, `Conta`, `Obter complementos`. Mention them in the classroom notes instead of the UI.

---

## Working method for every step
1. Reproduce with the survey script (scratchpad `cmp/`): screenshot + `innerText` dump of the screen before the change.
2. Implement in the smallest file set; `// c3:` on upstream lines; pt-BR strings in `reskinPtBr` + a jest case in `C3Terminology.spec.js` when a rule is added.
3. `npx prettier --list-different <files>`; a jest file when logic is touched (`CI=true npx react-app-rewired test --env=node <path>` from `newIDE/app`).
4. Re-run the same Playwright flow, compare with the `c3-NN-*.png` counterpart, keep the pair in the scratchpad.
5. Tick the TODO checkbox, update the "Current state" line in `CLAUDE.md` when a phase completes, commit `c3: …`.
