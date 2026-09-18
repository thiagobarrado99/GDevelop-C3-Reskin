// @flow
// c3: Construct's "objects" that are plain extensions in GDevelop (Keyboard,
// Mouse, Audio…). Step 1 of the add-condition/action picker shows them as
// tiles after "System"; choosing one lists only that extension's
// instructions. `icon` is the slug in C3-Icons/object_icons.
// Step 2 filter: a pseudo-object tile keeps only its extensions' instructions,
// the "System" tile drops every pseudo-object's (they moved out of System).
export type C3ExtensionFilter = {|
  include?: Array<string>,
  exclude?: Array<string>,
|};

export type C3PseudoObject = {|
  id: string,
  name: {| en: string, pt_BR: string |},
  category: {| en: string, pt_BR: string |}, // add-object grid (informational tile)
  icon: string,
  extensionNames: Array<string>,
  // Events-based extension that must be in the project for the tile to show.
  requiresExtension?: string,
|};

const input = { en: 'Input', pt_BR: 'Entrada' };
const media = { en: 'Media', pt_BR: 'Mídia' };
const data = { en: 'Data & Storage', pt_BR: 'Dados & Armazenamento' };
const other = { en: 'Other', pt_BR: 'Outro' };

export const C3_PSEUDO_OBJECTS: Array<C3PseudoObject> = [
  {
    id: 'keyboard',
    category: input,
    name: { en: 'Keyboard', pt_BR: 'Teclado' },
    icon: 'teclado',
    extensionNames: ['BuiltinKeyboard'],
  },
  {
    id: 'mouse',
    category: input,
    name: { en: 'Mouse', pt_BR: 'Mouse' },
    icon: 'mouse',
    extensionNames: ['BuiltinMouse'],
  },
  {
    id: 'touch',
    category: input,
    name: { en: 'Touch', pt_BR: 'Toque' },
    icon: 'toque',
    extensionNames: ['BuiltinMouse'],
  },
  {
    id: 'audio',
    category: media,
    name: { en: 'Audio', pt_BR: 'Áudio' },
    icon: 'audio',
    extensionNames: ['BuiltinAudio'],
  },
  {
    id: 'gamepad',
    category: input,
    name: { en: 'Gamepad', pt_BR: 'Gamepad' },
    icon: 'gamepad',
    extensionNames: ['Gamepads'],
    requiresExtension: 'Gamepads',
  },
  {
    id: 'browser',
    category: other,
    name: { en: 'Browser', pt_BR: 'Navegador' },
    icon: 'navegador',
    extensionNames: ['BuiltinWindow', 'SystemInfo'],
  },
  {
    id: 'local-storage',
    category: data,
    name: { en: 'Local storage', pt_BR: 'Armazenamento local' },
    icon: 'armazenamento-local',
    extensionNames: ['BuiltinFile'],
  },
  {
    id: 'ajax',
    category: other,
    name: { en: 'AJAX', pt_BR: 'AJAX' },
    icon: 'ajax',
    extensionNames: ['BuiltinNetwork'],
  },
  {
    id: 'date',
    category: data,
    name: { en: 'Date', pt_BR: 'Data' },
    icon: 'data',
    extensionNames: ['BuiltinTime'],
  },
];

export const C3_SYSTEM_EXTENSION_FILTER: C3ExtensionFilter = {
  exclude: [].concat(...C3_PSEUDO_OBJECTS.map(pseudo => pseudo.extensionNames)),
};
