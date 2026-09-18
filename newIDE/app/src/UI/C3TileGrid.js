// @flow
// c3: Construct-style picker - tiles (icon over name) grouped by category,
// the selected tile's description in a footer with the Add button. Used by
// the add-behaviour dialog; meant to serve the add-object dialog too.
import * as React from 'react';
import { Trans } from '@lingui/macro';
import ButtonBase from '@material-ui/core/ButtonBase';
import Text from './Text';
import ListIcon from './ListIcon';
import RaisedButton from './RaisedButton';
import './C3TileGrid.css';

export type C3Tile = {|
  id: string,
  name: string,
  description: string,
  iconUrl: string,
  category: string,
  enabled: boolean,
  +info?: boolean, // shows its description only; cannot be chosen
|};

type Props = {|
  tiles: $ReadOnlyArray<C3Tile>,
  onChoose: (id: string) => void,
  colorVariable: string, // e.g. '--c3-behavior-color'
  instant?: boolean, // a single click chooses; no footer
  // Known categories in this order first; the others alphabetically after a
  // divider (GDevelop-only items the Construct dialog does not have).
  categoryOrder?: Array<string>,
|};

const C3TileGrid = ({
  tiles,
  onChoose,
  colorVariable,
  instant,
  categoryOrder = [],
}: Props): React.Node => {
  const [selectedId, setSelectedId] = React.useState<?string>(null);
  const selected = tiles.find(tile => tile.id === selectedId);
  const rank = (category: string) => {
    const index = categoryOrder.indexOf(category);
    return index === -1 ? Infinity : index;
  };
  const categories = [...new Set(tiles.map(tile => tile.category))].sort(
    (a, b) => rank(a) - rank(b) || a.localeCompare(b)
  );
  const firstExtra = categories.find(category => rank(category) === Infinity);

  return (
    <div
      className="c3-tile-grid"
      style={{ '--c3-tile-color': `var(${colorVariable}, #e0e0e0)` }}
    >
      <div className="c3-tile-grid-body">
        {categories.map(category => (
          <React.Fragment key={category}>
            {category === firstExtra && firstExtra !== categories[0] ? (
              <div className="c3-tile-divider">
                <Trans>Also available</Trans>
              </div>
            ) : null}
            {category ? (
              <div className="c3-tile-category">{category}</div>
            ) : null}
            <div className="c3-tile-row">
              {tiles
                .filter(tile => tile.category === category)
                .map(tile => (
                  <ButtonBase
                    key={tile.id}
                    id={`c3-tile-${tile.id}`}
                    className={
                      'c3-tile' +
                      (tile.id === selectedId ? ' selected' : '') +
                      (tile.enabled ? '' : ' disabled') +
                      (tile.info ? ' info' : '')
                    }
                    onClick={() =>
                      instant && tile.enabled && !tile.info
                        ? onChoose(tile.id)
                        : setSelectedId(tile.id)
                    }
                    onDoubleClick={() =>
                      tile.enabled && !tile.info && onChoose(tile.id)
                    }
                  >
                    <ListIcon
                      src={tile.iconUrl}
                      iconSize={40}
                      padding={4}
                      useExactIconSize
                    />
                    <span className="c3-tile-name">{tile.name}</span>
                  </ButtonBase>
                ))}
            </div>
          </React.Fragment>
        ))}
      </div>
      {instant ? null : (
        <div className="c3-tile-grid-footer">
          <div className="c3-tile-description">
            {selected ? (
              <>
                <Text noMargin>{selected.name}</Text>
                <Text noMargin size="body2" color="secondary">
                  {selected.description}
                </Text>
              </>
            ) : (
              <Text noMargin color="secondary">
                <Trans>Click an item to see its description.</Trans>
              </Text>
            )}
          </div>
          <RaisedButton
            primary
            label={<Trans>Add</Trans>}
            disabled={!selected || !selected.enabled || selected.info}
            onClick={() => selected && onChoose(selected.id)}
          />
        </div>
      )}
    </div>
  );
};

export default C3TileGrid;
