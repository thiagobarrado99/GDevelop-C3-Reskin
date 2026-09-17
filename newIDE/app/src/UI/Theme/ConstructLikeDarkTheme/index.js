import { createGdevelopTheme } from '../CreateTheme';

import styles from './ConstructLikeDarkThemeVariables.json';
import './ConstructLikeDarkThemeVariables.css';

// c3: flat dark greys with a single cyan/green accent, palette measured from
// the Construct 3 reference screenshots (see CLAUDE.md "Style takeaways").
export default createGdevelopTheme({
  styles,

  rootClassNameIdentifier: 'ConstructLikeDarkTheme',
  paletteType: 'dark',
  gdevelopIconsCSSFilter: 'saturate(0%) brightness(1.4)',
  flat: true,
});
