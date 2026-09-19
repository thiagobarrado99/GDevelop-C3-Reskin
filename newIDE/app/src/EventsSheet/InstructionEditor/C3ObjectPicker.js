// @flow
// c3: step 1 of Construct's add-condition/action flow - "System" first, then
// every object and family as a tile. Choosing "System" reports null so the
// dialog shows the free (non-object) instructions; a pseudo-object tile
// (Keyboard, Mouse…) reports null plus the extension names to keep.
import * as React from 'react';
import { Trans, t } from '@lingui/macro';
import { I18n } from '@lingui/react';
import C3TileGrid from '../../UI/C3TileGrid';
import Text from '../../UI/Text';
import { Column } from '../../UI/Grid';
import { enumerateObjectsAndGroups } from '../../ObjectsList/EnumerateObjects';
import ObjectsRenderingService from '../../ObjectsRendering/ObjectsRenderingService';
import { ProjectScopedContainersAccessor } from '../../InstructionOrExpression/EventsScope';
import {
  C3_PSEUDO_OBJECTS,
  C3_SYSTEM_EXTENSION_FILTER,
  type C3ExtensionFilter,
} from '../../Utils/C3PseudoObjects';
import { c3Label, getC3Language } from '../../Utils/C3Language';
import { c3ObjectIcon } from '../../Utils/C3Icons';

export const SYSTEM_TILE_ID = 'c3-system';
// Gear (black; ListIcon inverts SVG data URIs on dark themes).
const systemIcon =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000"><path d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.7 7.7 0 0 0-1.7-1L15 3.2H9l-.3 2.7a7.7 7.7 0 0 0-1.7 1l-2.5-1-2 3.5L4.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.7 7.7 0 0 0 1.7 1l.3 2.7h6l.3-2.7a7.7 7.7 0 0 0 1.7-1l2.5 1 2-3.5L19.4 13zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>'
  );

type Props = {|
  project: gdProject,
  projectScopedContainersAccessor: ProjectScopedContainersAccessor,
  isCondition: boolean,
  onChoose: (objectName: ?string, extensionFilter?: C3ExtensionFilter) => void,
  // Gives the dialog what its "Next" button should run (null: nothing selected).
  onSelect: (next: ?() => void) => void,
|};

const PSEUDO_TILE_PREFIX = 'c3-pseudo-';

const C3ObjectPicker = ({
  project,
  projectScopedContainersAccessor,
  isCondition,
  onChoose,
  onSelect,
}: Props): React.Node => {
  const { allObjectsList, allGroupsList } = enumerateObjectsAndGroups(
    projectScopedContainersAccessor.get().getObjectsContainersList()
  );
  const choose = (id: string) => {
    if (id === SYSTEM_TILE_ID)
      return onChoose(null, C3_SYSTEM_EXTENSION_FILTER);
    const pseudo = C3_PSEUDO_OBJECTS.find(
      pseudo => PSEUDO_TILE_PREFIX + pseudo.id === id
    );
    if (pseudo) return onChoose(null, { include: pseudo.extensionNames });
    onChoose(id);
  };
  const tile = (name: string, iconUrl: string) => ({
    id: name,
    name,
    description: '',
    iconUrl,
    category: '',
    enabled: true,
  });
  return (
    <I18n>
      {({ i18n }) => (
        <Column expand noMargin>
          <Text>
            {isCondition ? (
              <Trans>Pick an object to create a new condition from:</Trans>
            ) : (
              <Trans>Pick an object to create a new action from:</Trans>
            )}
          </Text>
          <C3TileGrid
            searchable
            noFooter
            colorVariable="--c3-object-label-color"
            onSelect={tile => onSelect(tile ? () => choose(tile.id) : null)}
            onChoose={choose}
            tiles={[
              { ...tile(i18n._(t`System`), systemIcon), id: SYSTEM_TILE_ID },
              ...C3_PSEUDO_OBJECTS.filter(
                pseudo =>
                  !pseudo.requiresExtension ||
                  project.hasEventsFunctionsExtensionNamed(
                    pseudo.requiresExtension
                  )
              ).map(pseudo => ({
                ...tile(
                  c3Label(pseudo.name, getC3Language()),
                  c3ObjectIcon(pseudo.icon)
                ),
                id: PSEUDO_TILE_PREFIX + pseudo.id,
              })),
              ...allObjectsList.map(({ object }) =>
                tile(
                  object.getName(),
                  ObjectsRenderingService.getThumbnail(
                    project,
                    object.getConfiguration()
                  )
                )
              ),
              ...allGroupsList.map(({ group }) =>
                tile(group.getName(), 'res/ribbon_default/objectsgroups64.png')
              ),
            ]}
          />
        </Column>
      )}
    </I18n>
  );
};

export default C3ObjectPicker;
