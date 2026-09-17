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
  {
    id: 'persist',
    name: { en: 'Persist', pt_BR: 'Persistir' },
    category: attributes,
    type: 'SaveState::SaveConfiguration',
    defaultName: 'Persist',
    presets: { defaultProfilePersistence: 'Persisted' },
    icon: 'persistir',
  },
  {
    id: 'no-save',
    name: { en: 'No save', pt_BR: 'Não salvar' },
    category: attributes,
    type: 'SaveState::SaveConfiguration',
    defaultName: 'NoSave',
    presets: { defaultProfilePersistence: 'DoNotSave' },
    icon: 'nao-salvar',
  },
  // Community extensions (installed on demand from the extension store).
  {
    id: 'bullet',
    name: { en: 'Bullet', pt_BR: 'Projétil' },
    category: movements,
    type: 'AdvancedProjectile::AdvancedProjectile',
    defaultName: 'Bullet',
    presets: {},
    icon: 'projetil',
  },
  {
    id: 'orbit',
    name: { en: 'Orbit', pt_BR: 'Órbita' },
    category: movements,
    type: 'EllipseMovement::EllipseMovement',
    defaultName: 'Orbit',
    presets: {},
    icon: 'orbita',
  },
  {
    id: 'turret',
    name: { en: 'Turret', pt_BR: 'Canhão' },
    category: movements,
    type: 'Turret::Turret',
    defaultName: 'Turret',
    presets: {},
    icon: 'canhao',
  },
  {
    id: 'flash',
    name: { en: 'Flash', pt_BR: 'Piscar' },
    category: general,
    type: 'Flash::Flash',
    defaultName: 'Flash',
    presets: {},
    icon: 'piscar',
  },
  {
    id: 'pin',
    name: { en: 'Pin', pt_BR: 'Fixar' },
    category: general,
    type: 'Sticker::Sticker',
    defaultName: 'Pin',
    presets: {},
    icon: 'fixar',
  },
  {
    id: 'wrap',
    name: { en: 'Wrap', pt_BR: 'Dar a volta' },
    category: general,
    type: 'ScreenWrap::ScreenWrap',
    defaultName: 'Wrap',
    presets: {},
    icon: 'dar-a-volta',
  },
  {
    id: 'bound-to-layout',
    name: { en: 'Bound to layout', pt_BR: 'Restrito ao layout' },
    category: general,
    type: 'StayOnScreen::StayOnScreen',
    defaultName: 'BoundToLayout',
    presets: {},
    icon: 'restrito-ao-layout',
  },
  {
    id: 'scroll-to',
    name: { en: 'Scroll To', pt_BR: 'Centrar em' },
    category: general,
    type: 'SmoothCamera::SmoothCamera',
    defaultName: 'ScrollTo',
    presets: {},
    icon: 'centrar-em',
  },
  // No port yet (nothing close enough in GDevelop or the reviewed store):
  // Sine, Rotate, MoveTo, Follow, Tile movement, Custom, Fade, Timer
  // (GDevelop has object timers built in), Line of sight (raycast conditions).
];

export const getC3Behavior = (id: ?string): ?C3Behavior =>
  id ? C3_BEHAVIORS.find(behavior => behavior.id === id) : null;

export const c3Label = (
  label: {| en: string, pt_BR: string |},
  language: string
): string => (language.replace('-', '_') === 'pt_BR' ? label.pt_BR : label.en);
