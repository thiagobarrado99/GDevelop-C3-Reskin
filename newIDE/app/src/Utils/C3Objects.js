// @flow
import { c3Label, getC3Language } from './C3Language';
// c3: Construct 3's "add object" tiles that have a GDevelop port (see
// CLAUDE.md "Colour coding, behaviours and icons", object map). Construct
// objects without a GDevelop object (Keyboard, Mouse, AJAX, Dictionary…) are
// built into GDevelop and belong to the add-condition list, not here.
// `icon` is the slug in C3-Icons/object_icons.

export type C3Object = {|
  id: string,
  name: {| en: string, pt_BR: string |},
  defaultName: {| en: string, pt_BR: string |}, // new object name (identifier)
  category: {| en: string, pt_BR: string |},
  type: string,
  icon: string,
|};

const threeD = { en: '3D', pt_BR: '3D' };
const html = { en: 'HTML elements', pt_BR: 'Elementos HTML' };
const general = { en: 'General', pt_BR: 'Geral' };
const media = { en: 'Media', pt_BR: 'Mídia' };
const other = { en: 'Other', pt_BR: 'Outro' };
const data = { en: 'Data & Storage', pt_BR: 'Dados & Armazenamento' };
const input = { en: 'Input', pt_BR: 'Entrada' };

// Construct's order in the add-object dialog.
// Construct's object types and families are project-wide: new objects and
// groups go to the global containers (user decision 2026-09-18, option (a)).
export const C3_GLOBAL_BY_DEFAULT: boolean = true;

export const C3_OBJECT_CATEGORIES = [
  threeD,
  data,
  general,
  html,
  input,
  media,
  other,
];

export const C3_OBJECTS: Array<C3Object> = [
  {
    id: '3d-shape',
    defaultName: { en: 'Shape3D', pt_BR: 'Forma3D' },
    name: { en: '3D shape', pt_BR: 'Forma 3D' },
    category: threeD,
    type: 'Scene3D::Cube3DObject',
    icon: 'forma-3d',
  },
  {
    id: '3d-model',
    defaultName: { en: 'Model3D', pt_BR: 'Modelo3D' },
    name: { en: '3D model', pt_BR: 'Modelo 3D' },
    category: threeD,
    type: 'Scene3D::Model3DObject',
    icon: 'modelo-3d',
  },
  {
    id: 'text-input',
    defaultName: { en: 'TextInput', pt_BR: 'EntradaDeTexto' },
    name: { en: 'Text input', pt_BR: 'Entrada de texto' },
    category: html,
    type: 'TextInput::TextInputObject',
    icon: 'entrada-de-texto',
  },
  {
    id: '9-patch',
    defaultName: { en: 'NinePatch', pt_BR: 'NoveSeccoes' },
    name: { en: '9-patch', pt_BR: '9-secções' },
    category: general,
    type: 'PanelSpriteObject::PanelSprite',
    icon: '9-seccoes',
  },
  {
    id: 'sprite-font',
    defaultName: { en: 'SpriteFont', pt_BR: 'FonteDeSprites' },
    name: { en: 'Sprite font', pt_BR: 'Fonte de sprites' },
    category: general,
    type: 'BitmapText::BitmapTextObject',
    icon: 'fonte-de-sprites',
  },
  {
    id: 'tilemap',
    defaultName: { en: 'Tilemap', pt_BR: 'Mosaico' },
    name: { en: 'Tilemap', pt_BR: 'Mosaico' },
    category: general,
    type: 'TileMap::SimpleTileMap',
    icon: 'mosaico',
  },
  {
    id: 'particles',
    defaultName: { en: 'Particles', pt_BR: 'Particulas' },
    name: { en: 'Particles', pt_BR: 'Partículas' },
    category: general,
    type: 'ParticleSystem::ParticleEmitter',
    icon: 'particulas',
  },
  {
    id: 'tiled-background',
    defaultName: { en: 'TiledBackground', pt_BR: 'PlanoDeFundo' },
    name: { en: 'Tiled background', pt_BR: 'Plano de Fundo em Blocos' },
    category: general,
    type: 'TiledSpriteObject::TiledSprite',
    icon: 'plano-de-fundo-em-blocos',
  },
  {
    id: 'spotlight',
    defaultName: { en: 'Spotlight', pt_BR: 'Refletor' },
    name: { en: 'Spotlight', pt_BR: 'Refletor' },
    category: general,
    type: 'Lighting::LightObject',
    icon: 'refletor',
  },
  {
    id: 'sprite',
    defaultName: { en: 'Sprite', pt_BR: 'Sprite' },
    name: { en: 'Sprite', pt_BR: 'Sprite' },
    category: general,
    type: 'Sprite',
    icon: 'sprite',
  },
  {
    id: 'text',
    defaultName: { en: 'Text', pt_BR: 'Texto' },
    name: { en: 'Text', pt_BR: 'Texto' },
    category: general,
    type: 'TextObject::Text',
    icon: 'texto',
  },
  {
    id: 'video',
    defaultName: { en: 'Video', pt_BR: 'Video' },
    name: { en: 'Video', pt_BR: 'Vídeo' },
    category: media,
    type: 'Video::VideoObject',
    icon: 'video',
  },
  {
    id: 'drawing-canvas',
    defaultName: { en: 'DrawingCanvas', pt_BR: 'TelaDeDesenho' },
    name: { en: 'Drawing canvas', pt_BR: 'Tela de Desenho' },
    category: other,
    type: 'PrimitiveDrawing::Drawer',
    icon: 'tela-de-desenho',
  },
];

// c3: the name given to a new object of this type, in the UI language
// (Construct names objects after their type: Sprite, Texto…).
export const getC3ObjectDefaultName = (type: string): ?string => {
  const tile = C3_OBJECTS.find(tile => tile.type === type);
  return tile ? c3Label(tile.defaultName, getC3Language()) : null;
};
