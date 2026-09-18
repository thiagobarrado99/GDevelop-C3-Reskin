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
