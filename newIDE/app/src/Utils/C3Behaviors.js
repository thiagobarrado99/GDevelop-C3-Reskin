// @flow
// c3: Construct 3's behaviour list, 1:1 (see CLAUDE.md "Behaviour parity").
// Each tile is a GDevelop behaviour plus the settings applied when it is
// added; several tiles may share one GDevelop type (Solid and Jump-thru are
// both the Platform behaviour). Labels are Construct's own, so they bypass
// the terminology rewrite. `icon` is the slug in C3-Icons/behaviour_icons.

export type C3Behavior = {|
  id: string,
  name: {| en: string, pt_BR: string |},
  category: {| en: string, pt_BR: string |},
  type: string,
  defaultName: string,
  presets: { [string]: string },
  icon: string,
|};

const attributes = { en: 'Attributes', pt_BR: 'Atributos' };
const general = { en: 'General', pt_BR: 'Geral' };
const movements = { en: 'Movements', pt_BR: 'Movimentos' };
const threeD = { en: '3D', pt_BR: '3D' };

export const C3_BEHAVIORS: Array<C3Behavior> = [
  {
    id: 'solid',
    name: { en: 'Solid', pt_BR: 'Sólido' },
    category: attributes,
    type: 'PlatformBehavior::PlatformBehavior',
    defaultName: 'Solid',
    presets: { PlatformType: 'NormalPlatform' },
    icon: 'solido',
  },
  {
    id: 'jump-thru',
    name: { en: 'Jump-thru', pt_BR: 'Pular através' },
    category: attributes,
    type: 'PlatformBehavior::PlatformBehavior',
    defaultName: 'JumpThru',
    presets: { PlatformType: 'Jumpthru' },
    icon: 'pular-atraves',
  },
  {
    id: 'shadow-caster',
    name: { en: 'Shadow caster', pt_BR: 'Projetor de sombra' },
    category: attributes,
    type: 'Lighting::LightObstacleBehavior',
    defaultName: 'ShadowCaster',
    presets: {},
    icon: 'projetor-de-sombra',
  },
  {
    id: 'drag-drop',
    name: { en: 'Drag & Drop', pt_BR: 'Arrastar & Soltar' },
    category: general,
    type: 'DraggableBehavior::Draggable',
    defaultName: 'DragDrop',
    presets: {},
    icon: 'arrastar-e-soltar',
  },
  {
    id: 'anchor',
    name: { en: 'Anchor', pt_BR: 'Âncora' },
    category: general,
    type: 'AnchorBehavior::AnchorBehavior',
    defaultName: 'Anchor',
    presets: {},
    icon: 'ancora',
  },
  {
    id: 'destroy-outside',
    name: { en: 'Destroy outside layout', pt_BR: 'Destruir externamente' },
    category: general,
    type: 'DestroyOutsideBehavior::DestroyOutside',
    defaultName: 'DestroyOutside',
    presets: {},
    icon: 'destruir-externamente',
  },
  {
    id: 'tween',
    name: { en: 'Tween', pt_BR: 'Interpolação' },
    category: general,
    type: 'Tween::TweenBehavior',
    defaultName: 'Tween',
    presets: {},
    icon: 'interpolacao',
  },
  {
    id: 'platform',
    name: { en: 'Platform', pt_BR: 'Plataforma' },
    category: movements,
    type: 'PlatformBehavior::PlatformerObjectBehavior',
    defaultName: 'Platform',
    presets: {},
    icon: 'plataforma',
  },
  {
    id: '8-direction',
    name: { en: '8 Direction', pt_BR: '8 Direções' },
    category: movements,
    type: 'TopDownMovementBehavior::TopDownMovementBehavior',
    defaultName: '8Direction',
    presets: { AllowDiagonals: 'true' },
    icon: '8-direcoes',
  },
  {
    id: 'physics',
    name: { en: 'Physics', pt_BR: 'Física' },
    category: movements,
    type: 'Physics2::Physics2Behavior',
    defaultName: 'Physics',
    presets: {},
    icon: 'fisica',
  },
  {
    id: 'car',
    name: { en: 'Car', pt_BR: 'Carro' },
    category: movements,
    type: 'Physics3D::PhysicsCar3D',
    defaultName: 'Car',
    presets: {},
    icon: 'carro',
  },
  {
    id: 'pathfinding',
    name: { en: 'Pathfinding', pt_BR: 'Explorador de rotas' },
    category: movements,
    type: 'PathfindingBehavior::PathfindingBehavior',
    defaultName: 'Pathfinding',
    presets: {},
    icon: 'explorador-de-rotas',
  },
  {
    id: 'billboard',
    name: { en: 'Billboard', pt_BR: 'Billboard' },
    category: threeD,
    type: 'Scene3D::Base3DBehavior',
    defaultName: 'Billboard',
    presets: {},
    icon: 'billboard',
  },
  // Still to port (community extensions, see the CLAUDE.md survey item):
  // Persist, No save, Bullet, Sine, Rotate, Orbit, MoveTo, Follow, Turret,
  // Tile movement, Custom, Fade, Flash, Pin, Wrap, Timer, Bound to layout,
  // Scroll To, Line of sight.
];

export const getC3Behavior = (id: ?string): ?C3Behavior =>
  id ? C3_BEHAVIORS.find(behavior => behavior.id === id) : null;

export const c3Label = (
  label: {| en: string, pt_BR: string |},
  language: string
): string => (language.replace('-', '_') === 'pt_BR' ? label.pt_BR : label.en);
