// @flow
// c3: Construct keeps the Properties bar on screen while an event sheet is
// open - empty. Same column as the layout editor's, so nothing jumps when
// switching tabs. ✕ / the title menu hide it for this editor.
import * as React from 'react';
import { Trans, t } from '@lingui/macro';
import Text from '../UI/Text';
import IconButton from '../UI/IconButton';
import Cross from '../UI/CustomSvgIcons/Cross';
import ContextMenu, { type ContextMenuInterface } from '../UI/Menu/ContextMenu';
import './C3EmptyPropertiesBar.css';

type Props = {| children: React.Node |};

const C3EmptyPropertiesBar = ({ children }: Props): React.Node => {
  const [shown, setShown] = React.useState(true);
  const menu = React.useRef<?ContextMenuInterface>(null);
  return (
    <div className="c3-events-with-properties">
      {shown ? (
        <div className="c3-empty-properties-bar">
          <div
            className="c3-empty-properties-bar-title"
            onContextMenu={e => {
              e.preventDefault();
              if (menu.current) menu.current.open(e.clientX, e.clientY, {});
            }}
          >
            <span>
              <Trans>Properties</Trans>
            </span>
            <IconButton size="small" onClick={() => setShown(false)}>
              <Cross />
            </IconButton>
          </div>
          <div className="c3-empty-properties-bar-body">
            <Text color="secondary" size="body-small" noMargin>
              <Trans>No selection</Trans>
            </Text>
          </div>
          <ContextMenu
            ref={menu}
            buildMenuTemplate={i18n => [
              { label: i18n._(t`Close`), click: () => setShown(false) },
            ]}
          />
        </div>
      ) : null}
      <div className="c3-events-with-properties-sheet">{children}</div>
    </div>
  );
};

export default C3EmptyPropertiesBar;
