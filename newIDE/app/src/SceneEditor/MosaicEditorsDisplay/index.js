// @flow

import * as React from 'react';
import ReactDOM from 'react-dom'; // c3
import ChevronArrowBottom from '../../UI/CustomSvgIcons/ChevronArrowBottom'; // c3
import ChevronArrowRight from '../../UI/CustomSvgIcons/ChevronArrowRight'; // c3
import { t, Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';

import PreferencesContext from '../../MainFrame/Preferences/PreferencesContext';
import EditorMosaic, {
  type EditorMosaicInterface,
} from '../../UI/EditorMosaic';
import InstancesEditor from '../../InstancesEditor';
import LayersList, { type LayersListInterface } from '../../LayersList';
import FullSizeInstancesEditorWithScrollbars from '../../InstancesEditor/FullSizeInstancesEditorWithScrollbars';
import CloseButton from '../../UI/EditorMosaic/CloseButton';
import ObjectsList, { type ObjectsListInterface } from '../../ObjectsList';
import ObjectGroupsList, {
  type ObjectGroupsListInterface,
} from '../../ObjectGroupsList';
import InstancesList, {
  type InstancesListInterface,
} from '../../InstancesEditor/InstancesList';
import ObjectsRenderingService from '../../ObjectsRendering/ObjectsRenderingService';

import Rectangle from '../../Utils/Rectangle';
import { type EditorId } from '../utils';
import {
  type SceneEditorsDisplayProps,
  type SceneEditorsDisplayInterface,
} from '../EditorsDisplay.flow';
import {
  InstanceOrObjectPropertiesEditorContainer,
  type InstanceOrObjectPropertiesEditorInterface,
} from '../../SceneEditor/InstanceOrObjectPropertiesEditorContainer';
import { useDoNowOrAfterRender } from '../../Utils/UseDoNowOrAfterRender';
import { preventGameFramePointerEvents } from '../../EmbeddedGame/EmbeddedGameFrame';
import { EmbeddedGameFrameHole } from '../../EmbeddedGame/EmbeddedGameFrameHole';
import { exceptionallyGuardAgainstDeadObject } from '../../Utils/IsNullPtr';

// c3: Construct-like arrangement - properties bar left, layout in the centre;
// objects, families and layers live in the docked project bar (see
// C3BarPanels below), not in the mosaic.
const initialMosaicEditorNodes: any = {
  direction: 'row',
  first: 'properties',
  second: 'instances-editor',
  splitPercentage: 20,
};
const c3BarPanelIds = ['objects-list', 'object-groups-list', 'layers-list'];
// Layouts saved before the panels moved to the bar are ignored.
const withoutC3BarPanels = (node: any) =>
  node && c3BarPanelIds.some(id => JSON.stringify(node).includes(`"${id}"`))
    ? null
    : node;

// c3: the last scene editor that was active keeps its panels in the bar while
// an event sheet is open.
let c3LastActiveDisplayId = 0;
let c3NextDisplayId = 1;

const C3BarSection = ({
  title,
  height,
  children,
}: {|
  title: React.Node,
  height: number,
  children: React.Node,
|}) => {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="c3-bar-section">
      <div
        className="c3-bar-section-title"
        role="button"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronArrowBottom /> : <ChevronArrowRight />}
        {title}
      </div>
      {open ? (
        <div className="c3-bar-section-body" style={{ height }}>
          {children}
        </div>
      ) : null}
    </div>
  );
};

const noop = () => {};

const defaultPanelConfigByEditor = {
  'objects-list': {
    position: 'right',
  },
  properties: {
    position: 'left',
  },
  'object-groups-list': {
    position: 'right',
  },
  'instances-list': {
    position: 'bottom',
  },
  'layers-list': {
    position: 'right',
  },
};

// Forward ref to allow Scene editor to force update some editors
const MosaicEditorsDisplay: React.ComponentType<{
  ...SceneEditorsDisplayProps,
  +ref?: React.RefSetter<SceneEditorsDisplayInterface>,
}> = React.forwardRef<SceneEditorsDisplayProps, SceneEditorsDisplayInterface>(
  (props, ref) => {
    const {
      gameEditorMode,
      project,
      resourceManagementProps,
      layout,
      eventsFunctionsExtension,
      eventsBasedObject,
      eventsBasedObjectVariant,
      updateBehaviorsSharedData,
      layersContainer,
      globalObjectsContainer,
      objectsContainer,
      projectScopedContainersAccessor,
      initialInstances,
      chosenLayer,
      selectedLayer,
      selectedObjectGroup,
      onSelectInstances,
      onInstancesModified,
      onWillInstallExtension,
      onExtensionInstalled,
      onCreateNewExtensionWithBehavior,
      isActive,
      onRestartInGameEditor,
      showRestartInGameEditorAfterErrorButton,
    } = props;
    const {
      getDefaultEditorMosaicNode,
      setDefaultEditorMosaicNode,
    } = React.useContext(PreferencesContext);
    const selectedInstances = props.instancesSelection.getSelectedInstances();

    const instanceOrObjectPropertiesEditorRef = React.useRef<?InstanceOrObjectPropertiesEditorInterface>(
      null
    );
    const layersListRef = React.useRef<?LayersListInterface>(null);
    const instancesListRef = React.useRef<?InstancesListInterface>(null);
    const editorRef = React.useRef<?InstancesEditor>(null);
    const objectsListRef = React.useRef<?ObjectsListInterface>(null);
    const editorMosaicRef = React.useRef<?EditorMosaicInterface>(null);
    const objectGroupsListRef = React.useRef<?ObjectGroupsListInterface>(null);
    const objectsListDoNowOrAfterRender = useDoNowOrAfterRender<?ObjectsListInterface>(
      objectsListRef
    );

    const forceUpdatePropertiesEditor = React.useCallback(() => {
      if (instanceOrObjectPropertiesEditorRef.current)
        instanceOrObjectPropertiesEditorRef.current.forceUpdate();
    }, []);
    const forceUpdateInstancesList = React.useCallback(() => {
      if (instancesListRef.current) instancesListRef.current.forceUpdate();
    }, []);
    const forceUpdateObjectsList = React.useCallback(() => {
      if (objectsListRef.current) objectsListRef.current.forceUpdateList();
    }, []);
    const forceUpdateObjectGroupsList = React.useCallback(() => {
      if (objectGroupsListRef.current)
        objectGroupsListRef.current.forceUpdate();
    }, []);
    const scrollObjectGroupsListToObjectGroup = React.useCallback(
      (objectGroup: gdObjectGroup) => {
        if (objectGroupsListRef.current)
          objectGroupsListRef.current.scrollToObjectGroup(objectGroup);
      },
      []
    );
    const forceUpdateLayersList = React.useCallback(() => {
      if (layersListRef.current) layersListRef.current.forceUpdateList();
    }, []);
    const getInstanceSize = React.useCallback((instance: gdInitialInstance) => {
      return editorRef.current
        ? editorRef.current.getInstanceSize(instance)
        : [
            instance.getDefaultWidth(),
            instance.getDefaultHeight(),
            instance.getDefaultDepth(),
          ];
    }, []);

    const _onInstancesModified = React.useCallback(
      (instances: Array<gdInitialInstance>) => {
        if (onInstancesModified) onInstancesModified(instances);
        forceUpdateInstancesList();
      },
      [onInstancesModified, forceUpdateInstancesList]
    );
    // c3: while the Objects / Families / Layers panels live in the project
    // bar, the mosaic never opens them (they count as visible).
    const c3PanelsInBarRef = React.useRef(false);
    const toggleEditorView = React.useCallback((editorId: EditorId) => {
      if (c3PanelsInBarRef.current && c3BarPanelIds.includes(editorId)) return;
      if (!editorMosaicRef.current) return;
      const config = defaultPanelConfigByEditor[editorId];
      editorMosaicRef.current.toggleEditor(
        editorId,
        // $FlowFixMe[incompatible-type]
        config.position
      );
    }, []);
    const isEditorVisible = React.useCallback((editorId: EditorId) => {
      if (c3PanelsInBarRef.current && c3BarPanelIds.includes(editorId))
        return true;
      if (!editorMosaicRef.current) return false;
      return editorMosaicRef.current.getOpenedEditorNames().includes(editorId);
    }, []);
    const ensureEditorVisible = React.useCallback(
      (editorId: EditorId) => {
        if (!isEditorVisible(editorId)) {
          toggleEditorView(editorId);
        }
      },
      [isEditorVisible, toggleEditorView]
    );

    const startSceneRendering = React.useCallback(
      (start: boolean, reason: string) => {
        const editor = editorRef.current;
        if (!editor) return;

        if (start) editor.resumeSceneRendering(reason);
        else editor.pauseSceneRendering(reason);
      },
      []
    );
    const openNewObjectDialog = React.useCallback(
      () => {
        if (!isEditorVisible('objects-list')) {
          // Objects list is not opened. Open it now.
          toggleEditorView('objects-list');
        }

        // Open the new object dialog when the objects list is opened.
        objectsListDoNowOrAfterRender((objectsList: ?ObjectsListInterface) => {
          if (objectsList) objectsList.openNewObjectDialog();
        });
      },
      [isEditorVisible, toggleEditorView, objectsListDoNowOrAfterRender]
    );

    // $FlowFixMe[incompatible-type]
    React.useImperativeHandle(ref, () => {
      const { current: editor } = editorRef;
      return {
        getName: () => 'mosaic',
        forceUpdateInstancesList,
        forceUpdatePropertiesEditor,
        forceUpdateObjectsList,
        forceUpdateObjectGroupsList,
        scrollObjectGroupsListToObjectGroup,
        forceUpdateLayersList,
        openNewObjectDialog,
        toggleEditorView,
        isEditorVisible,
        ensureEditorVisible,
        startSceneRendering,
        viewControls: {
          zoomBy: editor ? editor.zoomBy : noop,
          setZoomFactor: editor ? editor.setZoomFactor : noop,
          zoomToInitialPosition: editor ? editor.zoomToInitialPosition : noop,
          zoomToFitContent: editor ? editor.zoomToFitContent : noop,
          zoomToFitSelection: editor ? editor.zoomToFitSelection : noop,
          centerViewOnLastInstance: editor
            ? editor.centerViewOnLastInstance
            : noop,
          getLastCursorSceneCoordinates: editor
            ? editor.getLastCursorSceneCoordinates
            : () => [0, 0],
          getLastContextMenuSceneCoordinates: editor
            ? editor.getLastContextMenuSceneCoordinates
            : () => [0, 0],
          getViewPosition: editor ? editor.getViewPosition : noop,
        },
        instancesHandlers: {
          getContentAABB: editor ? editor.getContentAABB : () => null,
          getSelectionAABB: editor
            ? editor.selectedInstances.getSelectionAABB
            : () => new Rectangle(),
          getInstanceAABB: editor
            ? editor.getInstanceAABB
            : (instance, bounds) => bounds, // c3
          addInstances: editor ? editor.addInstances : () => [],
          clearHighlightedInstance: editor
            ? editor.clearHighlightedInstance
            : noop,
          cancelClickInterception: editor
            ? editor.cancelClickInterception
            : () => false,
          resetInstanceRenderersFor: editor
            ? editor.resetInstanceRenderersFor
            : noop,
          forceRemountInstancesRenderers: editor ? editor.forceRemount : noop,
          addSerializedInstances: editor
            ? editor.addSerializedInstances
            : () => [],
          snapSelection: editor ? editor.snapSelection : noop,
        },
      };
    });

    const selectInstances = React.useCallback(
      (instances: Array<gdInitialInstance>, multiSelect: boolean) => {
        onSelectInstances(instances, multiSelect);
        forceUpdateInstancesList();
        forceUpdatePropertiesEditor();
      },
      [forceUpdateInstancesList, forceUpdatePropertiesEditor, onSelectInstances]
    );

    const selectedObjects = props.selectedObjectFolderOrObjectsWithContext
      .map(objectFolderOrObjectWithContext => {
        const { objectFolderOrObject } = objectFolderOrObjectWithContext;
        if (!objectFolderOrObject) return null; // Protect ourselves from an unexpected null value.
        if (objectFolderOrObject.isFolder()) return null;
        return exceptionallyGuardAgainstDeadObject(
          objectFolderOrObject.getObject()
        );
      })
      .filter(Boolean);

    const selectedObjectNames = selectedObjects.map(object => object.getName());

    const isCustomVariant = eventsBasedObject
      ? eventsBasedObject.getDefaultVariant() !== eventsBasedObjectVariant
      : false;

    // c3: panels rendered into the docked project bar.
    const c3DisplayIdRef = React.useRef(c3NextDisplayId++);
    if (isActive) c3LastActiveDisplayId = c3DisplayIdRef.current;
    const c3BarTarget =
      c3LastActiveDisplayId === c3DisplayIdRef.current
        ? document.getElementById('c3-project-bar-panels')
        : null;
    c3PanelsInBarRef.current = !!c3BarTarget;
    const [, c3Rerender] = React.useReducer<number, void>(x => x + 1, 0);
    React.useEffect(
      () => {
        // The bar can be (re)mounted after this render: check again.
        if (c3BarTarget !== document.getElementById('c3-project-bar-panels'))
          c3Rerender();
      },
      [isActive, c3BarTarget]
    );

    const editors = {
      properties: {
        type: 'secondary',
        title: t`Properties`,
        renderEditor: () => (
          <I18n>
            {({ i18n }) => (
              <InstanceOrObjectPropertiesEditorContainer
                i18n={i18n}
                project={project}
                resourceManagementProps={resourceManagementProps}
                layout={layout}
                eventsFunctionsExtension={eventsFunctionsExtension}
                onUpdateBehaviorsSharedData={updateBehaviorsSharedData}
                objectsContainer={objectsContainer}
                globalObjectsContainer={globalObjectsContainer}
                initialInstances={initialInstances}
                layersContainer={layersContainer}
                projectScopedContainersAccessor={
                  projectScopedContainersAccessor
                }
                instances={selectedInstances}
                selectedObjectFolderOrObjectsCount={
                  props.selectedObjectFolderOrObjectsWithContext.length
                }
                objects={selectedObjects}
                layer={selectedLayer}
                objectGroup={selectedObjectGroup}
                editInstanceVariables={props.editInstanceVariables}
                editObjectInPropertiesPanel={props.editObjectInPropertiesPanel}
                onEditObject={props.onEditObject}
                onEditObjectGroup={props.onEditObjectGroup}
                onObjectsModified={props.onObjectsModified}
                onEffectAdded={props.onEffectAdded}
                onInstancesModified={_onInstancesModified}
                onGetInstanceSize={getInstanceSize}
                ref={instanceOrObjectPropertiesEditorRef}
                unsavedChanges={props.unsavedChanges}
                historyHandler={props.historyHandler}
                tileMapTileSelection={props.tileMapTileSelection}
                onSelectTileMapTile={props.onSelectTileMapTile}
                lastSelectionType={props.lastSelectionType}
                onWillInstallExtension={props.onWillInstallExtension}
                onExtensionInstalled={props.onExtensionInstalled}
                onCreateNewExtensionWithBehavior={
                  onCreateNewExtensionWithBehavior
                }
                onOpenEventBasedObjectVariantEditor={
                  props.onOpenEventBasedObjectVariantEditor
                }
                onDeleteEventsBasedObjectVariant={
                  props.onDeleteEventsBasedObjectVariant
                }
                isVariableListLocked={isCustomVariant}
                isBehaviorListLocked={isCustomVariant}
                isObjectGroupObjectListLocked={isCustomVariant}
                onEditLayerEffects={props.editLayerEffects}
                onEditLayer={props.editLayer}
                onLayersModified={props.onLayersModified}
                eventsBasedObject={props.eventsBasedObject}
                eventsBasedObjectVariant={props.eventsBasedObjectVariant}
                getContentAABB={
                  editorRef.current
                    ? editorRef.current.getContentAABB
                    : () => null
                }
                onEventsBasedObjectChildrenEdited={
                  props.onEventsBasedObjectChildrenEdited
                }
                onBackgroundColorChanged={props.onBackgroundColorChanged}
                instancesEditorSettings={props.instancesEditorSettings} // c3
                onInstancesEditorSettingsChanged={
                  props.onInstancesEditorSettingsChanged
                } // c3
                openSceneVariables={props.openSceneVariables}
              />
            )}
          </I18n>
        ),
      },
      'layers-list': {
        type: 'secondary',
        title: t`Layers`,
        renderEditor: () => (
          <LayersList
            project={project}
            layout={layout}
            eventsFunctionsExtension={eventsFunctionsExtension}
            eventsBasedObject={eventsBasedObject}
            chosenLayer={chosenLayer}
            onChooseLayer={props.onChooseLayer}
            selectedLayer={selectedLayer}
            onSelectLayer={props.onSelectLayer}
            onEditLayerEffects={props.editLayerEffects}
            onEditLayer={props.editLayer}
            onLayersModified={props.onLayersModified}
            onLayersVisibilityInEditorChanged={
              props.onLayersVisibilityInEditorChanged
            }
            onRemoveLayer={props.onRemoveLayer}
            onLayerRenamed={props.onLayerRenamed}
            onCreateLayer={forceUpdatePropertiesEditor}
            layersContainer={layersContainer}
            ref={layersListRef}
            hotReloadPreviewButtonProps={props.hotReloadPreviewButtonProps}
            onBackgroundColorChanged={props.onBackgroundColorChanged}
            gameEditorMode={props.gameEditorMode}
          />
        ),
      },
      'instances-list': {
        type: 'secondary',
        title: t`Instances List`,
        renderEditor: () => (
          <InstancesList
            instances={initialInstances}
            selectedInstances={selectedInstances}
            onSelectInstances={selectInstances}
            onInstancesModified={onInstancesModified || noop}
            ref={instancesListRef}
          />
        ),
      },
      'instances-editor':
        gameEditorMode === 'embedded-game'
          ? {
              type: 'primary',
              noTitleBar: true,
              noSoftKeyboardAvoidance: true,
              renderEditor: () => (
                <EmbeddedGameFrameHole
                  isActive={isActive}
                  onRestartInGameEditor={onRestartInGameEditor}
                  showRestartInGameEditorAfterErrorButton={
                    showRestartInGameEditorAfterErrorButton
                  }
                />
              ),
            }
          : {
              type: 'primary',
              noTitleBar: true,
              noSoftKeyboardAvoidance: true,
              renderEditor: () => (
                <FullSizeInstancesEditorWithScrollbars
                  project={project}
                  layout={layout}
                  eventsBasedObject={eventsBasedObject}
                  eventsBasedObjectVariant={eventsBasedObjectVariant}
                  globalObjectsContainer={globalObjectsContainer}
                  objectsContainer={objectsContainer}
                  layersContainer={layersContainer}
                  chosenLayer={chosenLayer}
                  initialInstances={initialInstances}
                  instancesEditorSettings={props.instancesEditorSettings}
                  onInstancesEditorSettingsMutated={
                    props.onInstancesEditorSettingsMutated
                  }
                  instancesSelection={props.instancesSelection}
                  onInstancesAdded={props.onInstancesAdded}
                  onInstancesSelected={props.onInstancesSelected}
                  onInstanceDoubleClicked={props.onInstanceDoubleClicked}
                  onBackgroundDoubleClicked={props.onBackgroundDoubleClicked} // c3
                  onInstancesMoved={props.onInstancesMoved}
                  onInstancesResized={props.onInstancesResized}
                  onInstancesRotated={props.onInstancesRotated}
                  selectedObjectNames={selectedObjectNames}
                  onContextMenu={props.onContextMenu}
                  isInstanceOf3DObject={props.isInstanceOf3DObject}
                  instancesEditorShortcutsCallbacks={
                    props.instancesEditorShortcutsCallbacks
                  }
                  wrappedEditorRef={editor => {
                    editorRef.current = editor;
                  }}
                  pauseRendering={!props.isActive}
                  tileMapTileSelection={props.tileMapTileSelection}
                  onSelectTileMapTile={props.onSelectTileMapTile}
                  editorViewPosition2D={props.editorViewPosition2D}
                />
              ),
            },
      'objects-list': {
        type: 'secondary',
        title: t`Objects`,
        toolbarControls: [<CloseButton key="close" />],
        renderEditor: () => (
          <I18n>
            {({ i18n }) => (
              <ObjectsList
                getThumbnail={ObjectsRenderingService.getThumbnail.bind(
                  ObjectsRenderingService
                )}
                project={project}
                layout={layout}
                eventsFunctionsExtension={eventsFunctionsExtension}
                eventsBasedObject={eventsBasedObject}
                projectScopedContainersAccessor={
                  projectScopedContainersAccessor
                }
                globalObjectsContainer={globalObjectsContainer}
                objectsContainer={objectsContainer}
                initialInstances={initialInstances}
                onSelectAllInstancesOfObjectInLayout={
                  props.onSelectAllInstancesOfObjectInLayout
                }
                resourceManagementProps={props.resourceManagementProps}
                selectedObjectFolderOrObjectsWithContext={
                  props.selectedObjectFolderOrObjectsWithContext
                }
                onEditObject={props.onEditObject}
                onOpenEventBasedObjectEditor={
                  props.onOpenEventBasedObjectEditor
                }
                onOpenEventBasedObjectVariantEditor={
                  props.onOpenEventBasedObjectVariantEditor
                }
                onExportAssets={props.onExportAssets}
                onImportAssets={props.onImportAssets}
                onDeleteObjects={(objectWithContext, cb) =>
                  props.onDeleteObjects(i18n, objectWithContext, cb)
                }
                getValidatedObjectOrGroupName={(newName, global) =>
                  props.getValidatedObjectOrGroupName(newName, global, i18n)
                }
                onObjectCreated={props.onObjectCreated}
                onObjectEdited={props.onObjectEdited}
                onObjectFolderOrObjectsWithContextSelected={
                  props.onObjectFolderOrObjectsWithContextSelected
                }
                onRenameObjectFolderOrObjectWithContextFinish={
                  props.onRenameObjectFolderOrObjectWithContextFinish
                }
                onAddObjectInstance={props.onAddObjectInstance}
                onObjectPasted={props.updateBehaviorsSharedData}
                beforeSetAsGlobalObject={objectName =>
                  props.canObjectOrGroupBeGlobal(i18n, objectName)
                }
                onSetAsGlobalObject={props.onSetAsGlobalObject}
                ref={objectsListRef}
                unsavedChanges={props.unsavedChanges}
                hotReloadPreviewButtonProps={props.hotReloadPreviewButtonProps}
                isListLocked={isCustomVariant}
                onWillInstallExtension={onWillInstallExtension}
                onExtensionInstalled={onExtensionInstalled}
              />
            )}
          </I18n>
        ),
      },
      'object-groups-list': {
        type: 'secondary',
        title: t`Object Groups`,
        renderEditor: () => (
          <I18n>
            {({ i18n }) => (
              <ObjectGroupsList
                ref={objectGroupsListRef}
                globalObjectGroups={
                  globalObjectsContainer &&
                  globalObjectsContainer.getObjectGroups()
                }
                projectScopedContainersAccessor={
                  projectScopedContainersAccessor
                }
                objectGroups={objectsContainer.getObjectGroups()}
                onCreateGroup={props.onCreateObjectGroup}
                selectedObjectGroup={selectedObjectGroup}
                onSelectObjectGroup={props.onSelectObjectGroup}
                onEditGroup={props.onEditObjectGroup}
                onDeleteGroup={props.onDeleteObjectGroup}
                onRenameGroup={props.onRenameObjectGroup}
                getValidatedObjectOrGroupName={(newName, global) =>
                  props.getValidatedObjectOrGroupName(newName, global, i18n)
                }
                beforeSetAsGlobalGroup={groupName =>
                  props.canObjectOrGroupBeGlobal(i18n, groupName)
                }
                unsavedChanges={props.unsavedChanges}
                isListLocked={isCustomVariant}
              />
            )}
          </I18n>
        ),
      },
    };

    return (
      <>
        {c3BarTarget
          ? ReactDOM.createPortal(
              <>
                <C3BarSection title={<Trans>Objects</Trans>} height={320}>
                  {editors['objects-list'].renderEditor()}
                </C3BarSection>
                <C3BarSection title={<Trans>Object Groups</Trans>} height={160}>
                  {editors['object-groups-list'].renderEditor()}
                </C3BarSection>
                <C3BarSection
                  title={
                    <>
                      <Trans>Layers</Trans>
                      {layout ? ` — ${layout.getName()}` : ''}
                    </>
                  }
                  height={220}
                >
                  {editors['layers-list'].renderEditor()}
                </C3BarSection>
              </>,
              c3BarTarget
            )
          : null}
        <EditorMosaic
          // $FlowFixMe[incompatible-type]
          editors={editors}
          centralNodeId="instances-editor"
          initialNodes={
            // $FlowFixMe[incompatible-type]
            withoutC3BarPanels(getDefaultEditorMosaicNode('scene-editor')) ||
            initialMosaicEditorNodes
          }
          isTransparent={gameEditorMode === 'embedded-game'}
          onDragOrResizedStarted={() => {
            preventGameFramePointerEvents(true);
          }}
          onDragOrResizedEnded={() => {
            preventGameFramePointerEvents(false);
          }}
          onOpenedEditorsChanged={props.onOpenedEditorsChanged}
          onPersistNodes={node =>
            setDefaultEditorMosaicNode('scene-editor', node)
          }
          ref={editorMosaicRef}
        />
      </>
    );
  }
);

export default MosaicEditorsDisplay;
