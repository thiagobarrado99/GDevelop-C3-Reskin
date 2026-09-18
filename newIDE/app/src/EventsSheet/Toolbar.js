//@flow
import { t } from '@lingui/macro';
import * as React from 'react';
import { ToolbarGroup } from '../UI/Toolbar';
import ToolbarSeparator from '../UI/ToolbarSeparator';
import IconButton from '../UI/IconButton';
import ToolbarCommands from './ToolbarCommands';
import { type EventMetadata } from './EnumerateEventsMetadata';
// c3: the add-event icons are no longer used here.
import TrashIcon from '../UI/CustomSvgIcons/Trash';
import ToolbarSearchIcon from '../UI/CustomSvgIcons/ToolbarSearch';
import EditSceneIcon from '../UI/CustomSvgIcons/EditScene';
// c3: shortcut display names / local variable icon no longer used here.

type Props = {|
  onAddStandardEvent: () => void,
  onAddSubEvent: () => void,
  canAddSubEvent: boolean,
  onAddLocalVariable: () => void,
  canAddLocalVariable: boolean,
  onAddCommentEvent: () => void,
  allEventsMetadata: Array<EventMetadata>,
  onAddEvent: (eventType: string) => Array<gdBaseEvent>,
  onToggleInvertedCondition: () => void,
  onToggleDisabledEvent: () => void,
  canToggleEventDisabled: boolean,
  canToggleInstructionInverted: boolean,
  onRemove: () => void,
  canRemove: boolean,
  undo: () => void,
  canUndo: boolean,
  redo: () => void,
  canRedo: boolean,
  onToggleSearchPanel: () => void,
  onOpenSettings?: ?() => void,
  settingsIcon?: React.Node,
  moveEventsIntoNewGroup: () => void,
  canMoveEventsIntoNewGroup: boolean,
  onOpenSceneVariables: () => void,
  onAddInstruction: (isCondition: boolean) => void, // c3
  canAddInstruction: boolean, // c3
|};

const Toolbar: React.ComponentType<Props> = React.memo<Props>(function Toolbar({
  onAddStandardEvent,
  onAddSubEvent,
  canAddSubEvent,
  onAddLocalVariable,
  canAddLocalVariable,
  onAddCommentEvent,
  allEventsMetadata,
  onAddEvent,
  onToggleInvertedCondition,
  onToggleDisabledEvent,
  canToggleEventDisabled,
  canToggleInstructionInverted,
  onRemove,
  canRemove,
  undo,
  canUndo,
  redo,
  canRedo,
  onToggleSearchPanel,
  onOpenSettings,
  settingsIcon,
  moveEventsIntoNewGroup,
  canMoveEventsIntoNewGroup,
  onOpenSceneVariables,
  onAddInstruction,
  canAddInstruction,
}: Props) {
  return (
    <>
      <ToolbarCommands
        onAddCommentEvent={onAddCommentEvent}
        onAddSubEvent={onAddSubEvent}
        canAddSubEvent={canAddSubEvent}
        onAddLocalVariable={onAddLocalVariable}
        canAddLocalVariable={canAddLocalVariable}
        onAddStandardEvent={onAddStandardEvent}
        onAddEvent={onAddEvent}
        allEventsMetadata={allEventsMetadata}
        onToggleInvertedCondition={onToggleInvertedCondition}
        onToggleDisabledEvent={onToggleDisabledEvent}
        canToggleEventDisabled={canToggleEventDisabled}
        canToggleInstructionInverted={canToggleInstructionInverted}
        onRemove={onRemove}
        canRemove={canRemove}
        undo={undo}
        canUndo={canUndo}
        redo={redo}
        canRedo={canRedo}
        onToggleSearchPanel={onToggleSearchPanel}
        onOpenSettings={onOpenSettings}
        moveEventsIntoNewGroup={moveEventsIntoNewGroup}
        canMoveEventsIntoNewGroup={canMoveEventsIntoNewGroup}
        onOpenSceneVariables={onOpenSceneVariables}
        onAddInstruction={onAddInstruction}
        canAddInstruction={canAddInstruction}
      />
      <ToolbarGroup lastChild>
        {/* c3: add event / sub-event / local variable / comment / choose-and-add
            buttons are gone - the sheet's "Add event" / "Add…" links and the
            context menu cover them, like Construct. */}
        <IconButton
          size="small"
          color="default"
          onClick={onRemove}
          disabled={!canRemove}
          tooltip={t`Delete the selected event(s)`}
          acceleratorString={'Delete'}
        >
          <TrashIcon />
        </IconButton>

        {/* c3: undo / redo are in the top bar. */}
        <ToolbarSeparator />

        <IconButton
          size="small"
          color="default"
          onClick={() => onToggleSearchPanel()}
          tooltip={t`Search in events`}
          acceleratorString={'CmdOrCtrl+F'}
        >
          <ToolbarSearchIcon />
        </IconButton>
        {onOpenSettings && <ToolbarSeparator />}
        {onOpenSettings && (
          <IconButton
            size="small"
            color="default"
            onClick={onOpenSettings}
            tooltip={t`Open settings`}
          >
            {settingsIcon || <EditSceneIcon />}
          </IconButton>
        )}
      </ToolbarGroup>
    </>
  );
});

export default Toolbar;
