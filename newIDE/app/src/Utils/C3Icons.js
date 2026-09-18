// @flow
// c3: the flat Construct-style icons in public/res/c3-icons (local files, see
// CLAUDE.md "Icons"), keyed by GDevelop behaviour / object type. They are
// applied through a wrapper of libGD's `getIconFilename`, so every call site
// (lists, panels, event sheet rows) picks them up without changes.
import { C3_BEHAVIORS } from './C3Behaviors';
import { C3_OBJECTS } from './C3Objects';

export const c3BehaviorIcon = (slug: string): string =>
  `res/c3-icons/behaviors/${slug}.png`;
export const c3ObjectIcon = (slug: string): string =>
  `res/c3-icons/objects/${slug}.png`;

// Types with no tile of their own borrow the closest tile's icon.
const behaviorSlugs: { [string]: string } = {
  'Physics3D::Physics3DBehavior': 'fisica',
  'PhysicsBehavior::PhysicsBehavior': 'fisica',
  'PathfindingBehavior::PathfindingObstacleBehavior': 'explorador-de-rotas',
  // GDevelop-only behaviours (community extensions), drawn by the user.
  'SpriteSheet::HorizontalSpriteSheetAnimator':
    'animador-de-folha-de-sprites-horizontal',
  'DrawPathfinding::DrawPathfinding': 'pintor-de-caminhos',
  'FPS::FPSDisplayer': 'exibidor-de-fps',
  'SpriteSheet::VerticalSpriteSheetAnimator':
    'animador-de-folha-de-sprites-vertical',
  'SpriteSheet::JSONSpriteSheetAnimator': 'animador-de-folha-de-sprite-json',
  'ScrollableViewport::ScrollableViewport': 'viewport-rolavel',
  'SmoothCamera::SmoothPlatformerCamera': 'camera-suave-do-plataforma',
  'Parallax::VerticalTiledSpriteParallax':
    'paralaxe-vertical-para-um-sprite-tiled',
  'Parallax::HorizontalTiledSpriteParallax':
    'paralaxe-horizontal-para-um-sprite-tiled',
  'ThirdPersonCamera::ThirdPersonCamera': 'camera-de-terceira-pessoa',
  'ThreeDFlip::ThreeDFlip': 'giro-3d',
  'MarchingSquares::MarchingSquaresBehavior': 'pintor-de-quadrados-marchantes',
  'Sway::Sway': 'balancar',
  'Flash::FlashOpacity': 'opacidade-esfumacada-desvanecer-suavemente',
  'DepthEffect::DepthEffect_Sprite': 'efeito-de-profundidade',
  'ShakeObject::ShakeObject_PositionAngle': 'agitar-objeto-posicao-angulo',
  'ShockWaveEffect::StarShockWave': 'ondas-de-choque-estelares',
  'ShakeObject3D::ShakeModel3D': 'agitar-3d',
  'Flash::FlashEffect': 'efeito-de-flash',
  'ShockWaveEffect::EllipseShockWave': 'onda-de-choque-de-elipse',
  'TweenIntoView::TweenIntoView': 'mover-para-a-visualizacao',
  'ShakeObject::ShakeObject_PositionAngleScale':
    'agitar-objeto-posicao-angulo-escala',
  'Billboard::Billboard': 'painel',
  'ShadowClones::ShadowCloneEmitter': 'shadow-clone-emitter',
  'Flash::FlashColor': 'tonificacao-de-cor-em-flash',
  'FlashTransitionPainter::FlashTransitionPainter':
    'pintor-de-efeito-e-transicao-de-flash',
  'YSort::YSort': 'ysort',
  'RollingCounter::RollingCounter': 'contador-rolante',
  'SpriteMultitouchJoystick::PlatformerMultitouchMapper':
    'mapeador-de-controlador-multitouch-para-plataforma-de-personagem',
  'Gamepads::PlatformerGamepadMapper': 'mapeador-de-controle-de-plataforma',
  'SpriteMultitouchJoystick::TopDownMultitouchMapper':
    'mapeador-de-controlador-multitouch-para-visao-de-cima',
  'Gamepads::TopDownGamepadMapper': 'mapeador-de-gamepad-de-cima-para-baixo',
  'PhysicsCharacter3DKeyMapper::Platformer3DKeyboardMapper':
    'mapeador-de-teclado-de-plataforma-3d',
  'SpriteMultitouchJoystick::Platformer3DMultitouchMapper':
    'mapeador-de-controlador-multitouch-para-plataforma-3d-de-personagem',
  'Gamepads::Platformer3DGamepadMapper':
    'mapeador-de-controle-de-plataforma-3d',
  'PhysicsCharacter3DKeyMapper::Shooter3DKeyboardMapper':
    'mapeador-de-teclado-de-atirador-3d',
  'SpriteMultitouchJoystick::Shooter3DMultitouchMapper':
    'mapeador-de-controlador-multitouch-para-atirador-3d',
  'Gamepads::Shooter3DGamepadMapper':
    'mapeador-de-controle-de-plataforma-3d-gamepads',
  'MousePointerLock::FirstPersonPointerMapper':
    'mapeador-de-mouse-de-camera-em-primeira-pessoa',
  'SpriteMultitouchJoystick::FirstPersonMultitouchMapper':
    'mapeador-de-controlador-multitouch-para-camera-de-primeira-pessoa',
  'Gamepads::FirstPersonGamepadMapper':
    'mapeador-de-controle-de-camera-em-primeira-pessoa',
  'PhysicsCar3DKeyMapper::PhysicsCar3DKeyboardMapper': '3d-car-keyboard-mapper',
  'SpriteMultitouchJoystick::PhysicsCar3DMultitouchMapper':
    '3d-car-multitouch-controller-mapper',
  'Gamepads::PhysicsCar3DGamepadMapper': '3d-car-gamepad-mapper',
  'BehaviorRemapper::RemapForPlatformer': 'mapeador-de-teclado-de-plataforma',
  'MouseHelper::cursor': 'cursor',
  'KonamiCode::KonamiCode': 'codigo-konami',
  'PinchGesture::Pichable': 'objeto-ajustavel-com-pinca',
  'BehaviorRemapper::RemapForTopdown': 'remapeador-de-teclado-top-down',
  'SpriteMultitouchJoystick::MultitouchButton': 'botao-multitouch',
  'RepeatEveryXSeconds::RepeatTimer': 'repetir-a-cada-x-segundos',
  'DraggableSliderControl::DraggableSliderControl':
    'controle-deslizante-arrastavel',
  'ToggleSwitch::ToggleSwitch': 'interruptor-de-alternancia',
  'ButtonStates::ButtonFSM': 'estados-de-botao',
  'ButtonStates::ButtonScaleTween': 'tween-de-escala-do-botao',
  'Checkbox::Checkbox': 'caixa-de-selecao',
  'CursorType::CursorHover': 'cursor-customizado-quando-hover',
  'ButtonStates::ButtonColorTintTween': 'tween-de-tonalidade-de-cor-do-botao',
  'ButtonStates::ButtonAnimationName': 'animacao-do-botao',
  'CancellableDraggable::CancellableDraggable': 'objeto-arrastavel-cancelavel',
  'ButtonStates::ButtonObjectEffectTween': 'tween-de-efeito-de-objeto-de-botao',
  'ButtonStates::ButtonObjectEffects': 'efeitos-do-objeto-de-botao',
  'AutoTyping::AutoTyping': 'digitando-texto-automaticamente',
  'Health::Health': 'saude',
  'FireBullet::FireBullet': 'disparar-balas',
  'ObjectSpawner::ObjectSpawner': 'gerador-de-objetos',
  'IdleTracker::IdleTracker': 'rastreador-ocioso',
  'ObjectStack::ObjectStack': 'pilha-de-objetos',
  'LinkTools::LinkPathFinding': 'localizacao-do-caminho-do-link',
  'FireBullet::FireBullet3D': 'disparo-de-bala-3d',
  'IsOnScreen::InOnScreen': 'esta-na-tela',
  'Physics3D::PhysicsCharacter3D': 'personagem-de-fisica-3d',
  'NavMeshPathfinding::NavMeshCharacterBehavior':
    'personagem-de-navegacao-baseado-em-navmesh',
  'NavMeshPathfinding::NavMeshObstacleBehavior':
    'piso-obstaculo-para-navegacao-baseado-em-navmesh',
  'PixelPerfectMovement::PixelPerfectTopDownMovement':
    'movimento-perfeitamente-alinhado-com-pixels-grandes',
  'AdvancedJump::AdvancedJump': 'tempo-de-coyote-e-pulo-no-ar',
  'PhysicsEllipseMovement3D::PhysicsEllipseMovement3D': 'movimento-eliptico-3d',
  'AdvancedJump::DiveDash': 'mergulho-rapido',
  'CurvedMovement::TweenPathMovement':
    'movimento-em-uma-curva-baseado-na-duracao',
  'AdvancedJump::WallJump': 'pulo-na-parede',
  'ScreenWrap::ScreenWrapPhysics': 'envolver-a-tela-objetos-fisicos',
  'PlatformerCharacterAnimator::PlatformerCharacterAnimator':
    'animador-de-personagem-de-plataforma',
  'SpeedRestrictions::MaxMovementSpeed_Forces':
    'impor-velocidade-maxima-de-movimento',
  'PlatformerTrajectory::PlatformerEvaluator':
    'avaliador-de-trajetoria-do-platformer',
  'AdvancedJump::HorizontalDash': 'deslocamento-horizontal',
  'TimedBackAndForthMovement::TimedBackAndForthMirroredMovement':
    'movimento-de-vai-e-vem-temporizado',
  'AdvancedJump::PlatformerConfigurationStack':
    'pilha-de-configuracao-de-personagem-de-plataforma',
  'TopDownMovementAnimator::TopDownMovementAnimator':
    'top-down-movement-animator',
  'BoidsMovement::BoidsMovement': 'movimento-de-boids',
  'OrbitingObjects::OrbitingObjectEmitter': 'orbiting-object-emitter',
  'PhysicsCar::PhysicsCar': 'carro-fisico',
  'SpeedRestrictions::MaxRotationSpeed_Physics':
    'impor-velocidade-maxima-de-rotacao-fisica',
  'SpeedRestrictions::MaxMovementSpeed_Physics':
    'impor-velocidade-maxima-de-movimento-fisica',
  'RectangleMovement::RectangleMovement': 'movimento-retangular',
  'PhysicsCharacter3DAnimator::PhysicsCharacter3DAnimator':
    'animador-de-personagem-fisico-3d',
  'LinearMovement::LinearMovement': 'movimento-linear',
  'PixelPerfectMovement::PixelPerfectPlatformerCharacter':
    'personagem-de-plataforma-perfeitamente-alinhado-com-pixels-grandes',
  'LinearMovement::LinearMovementByAngle': 'movimento-linear-por-angulo',
  'FaceForward::FaceForward': 'virar-para-frente',
  'AnimatedBackAndForthMovement::AnimatedBackAndForthMirroredMovement':
    'movimento-para-tras-e-para-frente-espelhado',
  'AdvancedJump3D::AdvancedJump3D': 'tempo-do-coiote-e-pulo-no-ar-para-3d',
  'DraggablePhysics::DraggablePhysics': 'arrastavel-para-objetos-fisicos',
  'CurvedMovement::SpeedPathMovement':
    'movimento-em-uma-curva-baseado-na-velocidade',
  'Bounce::Bounce': 'saltitar',
  'Boomerang::Boomerang': 'bumerangue',
  'Multiplayer::MultiplayerObjectBehavior': 'objeto-multiplayer',
};
// The first tile of a shared type wins (Solid before Jump-thru, Persist
// before No save).
C3_BEHAVIORS.forEach(tile => {
  if (!behaviorSlugs[tile.type]) behaviorSlugs[tile.type] = tile.icon;
});

const objectSlugs: { [string]: string } = {
  'BBText::BBText': 'texto',
  'TextEntryObject::TextEntry': 'entrada-de-texto',
  'TileMap::TileMap': 'mosaico',
  'TileMap::CollisionMask': 'mosaico',
  'SpineObject::SpineObject': 'sprite',
  // GDevelop-only objects, drawn by the user.
  'ParticleEmitter3D::ParticleEmitter3D': 'emissor-de-particulas-3d',
  'Light3D::SpotLight3D': 'luz-direcional-3d',
  'Light3D::PointLight3D': 'luz-pontual-3d',
  'SpriteMultitouchJoystick::SpriteMultitouchJoystick': 'joystick-multitouch',
  'PanelSpriteButton::PanelSpriteButton': 'botao-rotulado',
  'PanelSpriteContinuousBar::PanelSpriteContinuousBar':
    'barra-de-recurso-continua',
  'TiledUnitsBar::TiledUnitsBar': 'barra-de-recurso-unidades-separadas',
  'PanelSpriteSlider::PanelSpriteSlider': 'controle-deslizante',
  'SpriteToggleSwitch::SpriteToggleSwitch': 'interruptor-de-alternancia',
  'LeaderboardDialog::LeaderboardDialog': 'dialogo-de-fim-de-jogo',
  'ScoreCounter::ScoreCounter': 'contador-de-pontuacao-animado',
  'TwoChoicesDialogBoxes::TwoChoicesDialogBox': 'two-choices-dialog-box',
  'CollapsibleVolumeControl::CollapsibleVolumeControl':
    'configuracoes-de-volume',
  'StarRatingBar::StarRatingBar': 'barra-de-avaliacao-de-estrelas',
  'PlayerAvatar::PlayerAvatar': 'avatar-multiplayer',
  'MultiplayerCustomLobbies::CustomLobbies':
    'salas-de-espera-personalizadas-para-multijogador',
};
C3_OBJECTS.forEach(tile => {
  if (!objectSlugs[tile.type]) objectSlugs[tile.type] = tile.icon;
});

export const getC3BehaviorIconFilename = (type: string): ?string =>
  behaviorSlugs[type] ? c3BehaviorIcon(behaviorSlugs[type]) : null;
export const getC3ObjectIconFilename = (type: string): ?string =>
  objectSlugs[type] ? c3ObjectIcon(objectSlugs[type]) : null;

// Called once after libGD is loaded (src/index.js).
export const applyC3Icons = (gd: any) => {
  const wrap = (prototype: any, getIcon: string => ?string) => {
    const original = prototype.getIconFilename;
    // $FlowFixMe[missing-this-annot]
    prototype.getIconFilename = function() {
      return getIcon(this.getName()) || original.call(this);
    };
  };
  wrap(gd.BehaviorMetadata.prototype, getC3BehaviorIconFilename);
  wrap(gd.ObjectMetadata.prototype, getC3ObjectIconFilename);
};
