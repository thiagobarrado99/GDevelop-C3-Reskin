// @flow
// c3: Construct 3's "add object" tiles that have a GDevelop port (see
// CLAUDE.md "Colour coding, behaviours and icons", object map). Construct
// objects without a GDevelop object (Keyboard, Mouse, AJAX, Dictionary…) are
// built into GDevelop and belong to the add-condition list, not here.
// `icon` is the slug in C3-Icons/object_icons.

export type C3Object = {|
  id: string,
  name: {| en: string, pt_BR: string |},
  category: {| en: string, pt_BR: string |},
  type: string,
  icon: string,
|};

const threeD = { en: '3D', pt_BR: '3D' };
const html = { en: 'HTML elements', pt_BR: 'Elementos HTML' };
const general = { en: 'General', pt_BR: 'Geral' };
const media = { en: 'Media', pt_BR: 'Mídia' };
const other = { en: 'Other', pt_BR: 'Outro' };

export const C3_OBJECTS: Array<C3Object> = [
  {
    id: '3d-shape',
    name: { en: '3D shape', pt_BR: 'Forma 3D' },
    category: threeD,
    type: 'Scene3D::Cube3DObject',
    icon: 'forma-3d',
  },
  {
    id: '3d-model',
    name: { en: '3D model', pt_BR: 'Modelo 3D' },
    category: threeD,
    type: 'Scene3D::Model3DObject',
    icon: 'modelo-3d',
  },
  {
    id: 'text-input',
    name: { en: 'Text input', pt_BR: 'Entrada de texto' },
    category: html,
    type: 'TextInput::TextInputObject',
    icon: 'entrada-de-texto',
  },
  {
    id: '9-patch',
    name: { en: '9-patch', pt_BR: '9-secções' },
    category: general,
    type: 'PanelSpriteObject::PanelSprite',
    icon: '9-seccoes',
  },
  {
    id: 'sprite-font',
    name: { en: 'Sprite font', pt_BR: 'Fonte de sprites' },
    category: general,
    type: 'BitmapText::BitmapTextObject',
    icon: 'fonte-de-sprites',
  },
  {
    id: 'tilemap',
    name: { en: 'Tilemap', pt_BR: 'Mosaico' },
    category: general,
    type: 'TileMap::SimpleTileMap',
    icon: 'mosaico',
  },
  {
    id: 'particles',
    name: { en: 'Particles', pt_BR: 'Partículas' },
    category: general,
    type: 'ParticleSystem::ParticleEmitter',
    icon: 'particulas',
  },
  {
    id: 'tiled-background',
    name: { en: 'Tiled background', pt_BR: 'Plano de Fundo em Blocos' },
    category: general,
    type: 'TiledSpriteObject::TiledSprite',
    icon: 'plano-de-fundo-em-blocos',
  },
  {
    id: 'spotlight',
    name: { en: 'Spotlight', pt_BR: 'Refletor' },
    category: general,
    type: 'Lighting::LightObject',
    icon: 'refletor',
  },
  {
    id: 'sprite',
    name: { en: 'Sprite', pt_BR: 'Sprite' },
    category: general,
    type: 'Sprite',
    icon: 'sprite',
  },
  {
    id: 'text',
    name: { en: 'Text', pt_BR: 'Texto' },
    category: general,
    type: 'TextObject::Text',
    icon: 'texto',
  },
  {
    id: 'video',
    name: { en: 'Video', pt_BR: 'Vídeo' },
    category: media,
    type: 'Video::VideoObject',
    icon: 'video',
  },
  {
    id: 'drawing-canvas',
    name: { en: 'Drawing canvas', pt_BR: 'Tela de Desenho' },
    category: other,
    type: 'PrimitiveDrawing::Drawer',
    icon: 'tela-de-desenho',
  },
];
