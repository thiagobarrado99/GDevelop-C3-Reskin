// @flow
import { Trans } from '@lingui/macro';
import { t } from '@lingui/macro';
import { I18n } from '@lingui/react';
import * as React from 'react';
import { Line, Column } from '../../UI/Grid';
import ElementWithMenu from '../../UI/Menu/ElementWithMenu';
import {
  enumerateEventsMetadata,
  type EventMetadata,
} from '../EnumerateEventsMetadata';
import { type DropTargetComponent } from '../../UI/DragAndDrop/DropTarget';
import { type SortableTreeNode } from './SortableEventsTree';
import { moveEventToEventsList } from './helpers';
import GDevelopThemeContext from '../../UI/Theme/GDevelopThemeContext';
import { useScreenType } from '../../UI/Responsive/ScreenTypeMeasurer';
import { hasClipboardEvents } from '../ClipboardKind'; // c3
import { type I18n as I18nType } from '@lingui/core';

const styles = {
  addButton: {
    cursor: 'pointer',
  },
  dropIndicator: {
    border: '2px solid black',
    outline: '1px solid white',
  },
};

type Props = {|
  onAddEvent: (eventType: string) => void,
  onPaste: () => void, // c3
  onOpenGlobalVariables: () => void, // c3

  // Connect a drop target to be able to drop an event at the end of the sheet.
  DnDComponent: DropTargetComponent<SortableTreeNode>,
  draggedNode: ?SortableTreeNode,
  rootEventsList: gdEventsList,
|};

// c3: Construct's "Add…" menu; GDevelop's loop events sit in a submenu.
const c3TopLevel = [
  ['BuiltinCommonInstructions::Standard', t`Add event`],
  ['BuiltinCommonInstructions::Comment', t`Add comment`],
  ['BuiltinCommonInstructions::Group', t`Add group`],
];
const c3Loops = [
  'BuiltinCommonInstructions::Else',
  'BuiltinCommonInstructions::ForEach',
  'BuiltinCommonInstructions::ForEachChildVariable',
  'BuiltinCommonInstructions::Repeat',
  'BuiltinCommonInstructions::While',
];
const makeMenuTemplateBuilderForEvents = (
  i18n: I18nType,
  onAddEvent: (eventType: string) => void,
  onPaste: () => void,
  onOpenGlobalVariables: () => void
) => () => {
  const metadataByType: { [string]: EventMetadata } = {};
  enumerateEventsMetadata().forEach(metadata => {
    metadataByType[metadata.type] = metadata;
  });
  return [
    ...c3TopLevel.map(([type, label]) => ({
      label: i18n._(label),
      click: () => onAddEvent(type),
    })),
    { label: i18n._(t`Add global variable`), click: onOpenGlobalVariables },
    {
      label: i18n._(t`Include event sheet`),
      click: () => onAddEvent('BuiltinCommonInstructions::Link'),
    },
    { label: i18n._(t`Paste`), click: onPaste, enabled: hasClipboardEvents() },
    {
      label: i18n._(t`Loops`),
      submenu: c3Loops
        .filter(type => metadataByType[type])
        .map(type => ({
          label: metadataByType[type].fullName,
          click: () => onAddEvent(type),
        })),
    },
  ];
};

const addButtonTooltipLabelMouse = t`Right-click for more events`;
const addButtonTooltipLabelTouch = t`Long press for more events`;

export default function BottomButtons({
  onAddEvent,
  onPaste,
  onOpenGlobalVariables,
  DnDComponent,
  draggedNode,
  rootEventsList,
}: Props): React.Node {
  const screenType = useScreenType();
  const gdevelopTheme = React.useContext(GDevelopThemeContext);
  const onDrop = () => {
    draggedNode &&
      draggedNode.event &&
      moveEventToEventsList({
        targetEventsList: rootEventsList,
        movingEvent: draggedNode.event,
        initialEventsList: draggedNode.eventsList,
        // Drops node at the end of root events list.
        toIndex: -1,
      });
  };
  return (
    <I18n>
      {({ i18n }) => (
        <DnDComponent canDrop={() => true} drop={onDrop}>
          {({ connectDropTarget, isOver }) =>
            connectDropTarget(
              <div>
                {isOver && (
                  <div
                    style={{
                      ...styles.dropIndicator,
                      borderColor: gdevelopTheme.dropIndicator.canDrop,
                      outlineColor: gdevelopTheme.dropIndicator.border,
                    }}
                  />
                )}
                <Column>
                  <Line justifyContent="space-between">
                    <ElementWithMenu
                      openMenuWithSecondaryClick
                      element={
                        <button
                          style={styles.addButton}
                          className="add-link"
                          onClick={() =>
                            onAddEvent('BuiltinCommonInstructions::Standard')
                          }
                          title={i18n._(
                            screenType === 'touch'
                              ? addButtonTooltipLabelTouch
                              : addButtonTooltipLabelMouse
                          )}
                        >
                          + <Trans>Add a new event</Trans>
                        </button>
                      }
                      // $FlowFixMe[incompatible-type]
                      buildMenuTemplate={makeMenuTemplateBuilderForEvents(
                        i18n,
                        onAddEvent,
                        onPaste,
                        onOpenGlobalVariables
                      )}
                    />
                    <ElementWithMenu
                      element={
                        <button style={styles.addButton} className="add-link">
                          + <Trans>Add...</Trans>
                        </button>
                      }
                      // $FlowFixMe[incompatible-type]
                      buildMenuTemplate={makeMenuTemplateBuilderForEvents(
                        i18n,
                        onAddEvent,
                        onPaste,
                        onOpenGlobalVariables
                      )}
                    />
                  </Line>
                </Column>
              </div>
            )
          }
        </DnDComponent>
      )}
    </I18n>
  );
}
