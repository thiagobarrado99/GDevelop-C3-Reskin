// @flow
import * as React from 'react';
import { t } from '@lingui/macro';
import { Toolbar, ToolbarGroup } from '../../UI/Toolbar';
import IconButton from '../../UI/IconButton';
import ProjectManagerIcon from '../../UI/CustomSvgIcons/ProjectManager';
import PreviewAndShareButtons, {
  type PreviewAndShareButtonsProps,
} from './PreviewAndShareButtons';
import OpenedVersionStatusChip from '../../VersionHistory/OpenedVersionStatusChip';
import type { OpenedVersionStatus } from '../../VersionHistory';
import GDevelopThemeContext from '../../UI/Theme/GDevelopThemeContext';
import { getStatusColor } from '../../VersionHistory/Utils';
import SaveProjectIcon from '../SaveProjectIcon';
import UndoIcon from '../../UI/CustomSvgIcons/Undo'; // c3
import RedoIcon from '../../UI/CustomSvgIcons/Redo'; // c3
import CustomToolbarButton, {
  type ToolbarButtonConfig,
} from '../CustomToolbarButton';
import { type FileMetadata } from '../../ProjectsStorage';
import { type TriggerNpmScript } from '../NpmScriptRunner/useNpmScriptRunner';

export type MainFrameToolbarProps = {|
  showProjectButtons: boolean,
  showPreviewAndShareButtons: boolean,
  openShareDialog: () => void,
  onSave: (options?: {|
    skipNewVersionWarning: boolean,
  |}) => Promise<?FileMetadata>,
  canSave: boolean,
  onOpenVersionHistory: () => void,
  onOpenProjectManager: () => void, // c3
  onUndo: () => void, // c3: Construct's Save · Undo · Redo
  onRedo: () => void, // c3
  checkedOutVersionStatus?: ?OpenedVersionStatus,
  onQuitVersionHistory: () => Promise<void>,
  canQuitVersionHistory: boolean,
  hidden: boolean,
  toolbarButtons: Array<ToolbarButtonConfig>,
  projectPath: ?string,
  triggerNpmScript: TriggerNpmScript,
  c3Tabs?: React.Node, // c3: the document tabs, after the buttons

  ...PreviewAndShareButtonsProps,
|};

export type ToolbarInterface = {|
  setEditorToolbar: (React.Node | null) => void,
|};

type LeftButtonsToolbarGroupProps = {|
  onSave: (options?: {|
    skipNewVersionWarning: boolean,
  |}) => Promise<?FileMetadata>,
  onOpenVersionHistory: () => void,
  onOpenProjectManager: () => void, // c3
  onUndo: () => void, // c3
  onRedo: () => void, // c3
  checkedOutVersionStatus?: ?OpenedVersionStatus,
  onQuitVersionHistory: () => Promise<void>,
  canQuitVersionHistory: boolean,
  canSave: boolean,
  toolbarButtons: Array<ToolbarButtonConfig>,
  projectPath: ?string,
  triggerNpmScript: TriggerNpmScript,
  children?: React.Node, // c3
|};

const LeftButtonsToolbarGroup = React.memo<LeftButtonsToolbarGroupProps>(
  function LeftButtonsToolbarGroup(props) {
    const toolbarButtons = props.toolbarButtons;
    const triggerNpmScript = props.triggerNpmScript;

    return (
      <>
        <ToolbarGroup firstChild>
          {/* c3: no version history (cloud only); the project bar opens from
              here; preview & export sit next to save, like Construct's
              Save · Preview. */}
          <IconButton
            size="small"
            id="toolbar-project-manager-button"
            onClick={props.onOpenProjectManager}
            tooltip={t`Project bar`}
            color="default"
          >
            <ProjectManagerIcon />
          </IconButton>
          <SaveProjectIcon
            id="toolbar-save-button"
            onSave={props.onSave}
            canSave={props.canSave}
          />
          <IconButton
            size="small"
            id="toolbar-undo-button"
            onClick={props.onUndo}
            tooltip={t`Undo`}
            color="default"
          >
            <UndoIcon />
          </IconButton>
          <IconButton
            size="small"
            id="toolbar-redo-button"
            onClick={props.onRedo}
            tooltip={t`Redo`}
            color="default"
          >
            <RedoIcon />
          </IconButton>
          {props.children}
          {toolbarButtons.map((button, index) => (
            <CustomToolbarButton
              key={index}
              name={button.name}
              icon={button.icon}
              onClick={() =>
                triggerNpmScript({
                  script: button.npmScript,
                  keepTerminalOpen: button.keepTerminalOpen,
                })
              }
            />
          ))}
          {props.checkedOutVersionStatus && (
            <div
              style={{
                // Leave margin between the chip that has a Cross icon to click and the
                // Play icon to preview the project. It's to avoid a mis-click that would
                // quit the version history instead of previewing the game.
                marginRight: 20,
              }}
            >
              <OpenedVersionStatusChip
                onQuit={props.onQuitVersionHistory}
                disableQuitting={!props.canQuitVersionHistory}
                openedVersionStatus={props.checkedOutVersionStatus}
              />
            </div>
          )}
        </ToolbarGroup>
      </>
    );
  }
);

export default (React.forwardRef<MainFrameToolbarProps, ToolbarInterface>(
  function MainframeToolbar(props: MainFrameToolbarProps, ref) {
    const gdevelopTheme = React.useContext(GDevelopThemeContext);
    const [editorToolbar, setEditorToolbar] = React.useState<?React.Node>(null);

    // $FlowFixMe[incompatible-type]
    React.useImperativeHandle(ref, () => ({
      setEditorToolbar,
    }));

    const borderBottomColor = React.useMemo(
      () => {
        if (!props.checkedOutVersionStatus) return null;
        return getStatusColor(
          gdevelopTheme,
          props.checkedOutVersionStatus.status
        );
      },
      [props.checkedOutVersionStatus, gdevelopTheme]
    );

    // c3: Construct's single top row - buttons, then the tabs, then the
    // editor's own tools at the right. The groups must not grow.
    const c3Tabs = props.c3Tabs;
    const c3Group = (node: React.Node) =>
      c3Tabs ? (
        <div style={{ display: 'flex', flexShrink: 0, height: '100%' }}>
          {node}
        </div>
      ) : (
        node
      );

    return (
      <Toolbar borderBottomColor={borderBottomColor} hidden={props.hidden}>
        {props.showProjectButtons
          ? c3Group(
              <LeftButtonsToolbarGroup
                onSave={props.onSave}
                canSave={props.canSave}
                onOpenVersionHistory={props.onOpenVersionHistory}
                onOpenProjectManager={props.onOpenProjectManager}
                onUndo={props.onUndo}
                onRedo={props.onRedo}
                checkedOutVersionStatus={props.checkedOutVersionStatus}
                onQuitVersionHistory={props.onQuitVersionHistory}
                canQuitVersionHistory={props.canQuitVersionHistory}
                toolbarButtons={props.toolbarButtons}
                projectPath={props.projectPath}
                triggerNpmScript={props.triggerNpmScript}
              >
                {props.showPreviewAndShareButtons && (
                  <PreviewAndShareButtons
                    onPreviewWithoutHotReload={props.onPreviewWithoutHotReload}
                    onOpenDebugger={props.onOpenDebugger}
                    onNetworkPreview={props.onNetworkPreview}
                    onHotReloadPreview={props.onHotReloadPreview}
                    onLaunchPreviewWithDiagnosticReport={
                      props.onLaunchPreviewWithDiagnosticReport
                    }
                    setPreviewOverride={props.setPreviewOverride}
                    canDoNetworkPreview={props.canDoNetworkPreview}
                    isPreviewEnabled={props.isPreviewEnabled}
                    previewState={props.previewState}
                    hasPreviewsRunning={props.hasPreviewsRunning}
                    openShareDialog={props.openShareDialog}
                    isSharingEnabled={props.isSharingEnabled}
                  />
                )}
              </LeftButtonsToolbarGroup>
            )
          : null}
        {c3Tabs ? (
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              alignSelf: 'flex-end',
              marginLeft: 8,
            }}
          >
            {c3Tabs}
          </div>
        ) : null}
        {c3Group(editorToolbar || <ToolbarGroup />)}
      </Toolbar>
    );
  }
): React.ComponentType<{
  ...MainFrameToolbarProps,
  +ref?: React.RefSetter<ToolbarInterface>,
}>);
