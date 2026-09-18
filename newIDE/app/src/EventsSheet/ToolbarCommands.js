// @flow
import * as React from 'react';
import {
  useCommand,
  useCommandWithOptions,
} from '../CommandPalette/CommandHooks';
import { type EventMetadata } from './EnumerateEventsMetadata';

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
  moveEventsIntoNewGroup: () => void,
  canMoveEventsIntoNewGroup: boolean,
  onOpenSceneVariables: () => void,
  onAddInstruction: (isCondition: boolean) => void, // c3
  canAddInstruction: boolean, // c3
|};

const ToolbarCommands = (props: Props): null => {
  const { onAddEvent } = props;

  useCommand('ADD_STANDARD_EVENT', true, {
    handler: props.onAddStandardEvent,
  });

  useCommand('ADD_SUBEVENT', props.canAddSubEvent, {
    handler: props.onAddSubEvent,
  });

  useCommand('ADD_LOCAL_VARIABLE', props.canAddLocalVariable, {
    handler: props.onAddLocalVariable,
  });

  useCommand('ADD_COMMENT_EVENT', true, {
    handler: props.onAddCommentEvent,
  });

  useCommand('TOGGLE_EVENT_DISABLED', props.canToggleEventDisabled, {
    handler: props.onToggleDisabledEvent,
  });

  useCommand('TOGGLE_CONDITION_INVERTED', props.canToggleInstructionInverted, {
    handler: props.onToggleInvertedCondition,
  });

  useCommandWithOptions('CHOOSE_AND_ADD_EVENT', true, {
    generateOptions: React.useCallback(
      () =>
        props.allEventsMetadata.map(metadata => ({
          text: metadata.fullName,
          handler: () => {
            onAddEvent(metadata.type);
          },
        })),
      [props.allEventsMetadata, onAddEvent]
    ),
  });

  // c3: Construct's C / A / X / G keys.
  const { onAddInstruction } = props;
  useCommand('ADD_CONDITION', props.canAddInstruction, {
    handler: React.useCallback(() => onAddInstruction(true), [
      onAddInstruction,
    ]),
  });
  useCommand('ADD_ACTION', props.canAddInstruction, {
    handler: React.useCallback(() => onAddInstruction(false), [
      onAddInstruction,
    ]),
  });
  useCommand('ADD_ELSE_EVENT', true, {
    handler: React.useCallback(
      () => {
        onAddEvent('BuiltinCommonInstructions::Else');
      },
      [onAddEvent]
    ),
  });
  useCommand('ADD_GROUP_EVENT', true, {
    handler: React.useCallback(
      () => {
        onAddEvent('BuiltinCommonInstructions::Group');
      },
      [onAddEvent]
    ),
  });

  useCommand('MOVE_EVENTS_IN_NEW_GROUP', props.canMoveEventsIntoNewGroup, {
    handler: props.moveEventsIntoNewGroup,
  });

  useCommand('DELETE_SELECTION', props.canRemove, {
    handler: props.onRemove,
  });

  useCommand('EVENTS_EDITOR_UNDO', props.canUndo, {
    handler: props.undo,
  });

  useCommand('EVENTS_EDITOR_REDO', props.canRedo, {
    handler: props.redo,
  });

  useCommand('SEARCH_EVENTS', true, {
    handler: props.onToggleSearchPanel,
  });

  useCommand('OPEN_EXTENSION_SETTINGS', !!props.onOpenSettings, {
    handler: props.onOpenSettings || (() => {}),
  });

  useCommand('OPEN_SCENE_VARIABLES', true, {
    handler: props.onOpenSceneVariables,
  });

  return null;
};

export default ToolbarCommands;
