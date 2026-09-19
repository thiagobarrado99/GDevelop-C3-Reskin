// @flow
// c3: a new Sprite starts like Construct's - one animation with one blank
// 250x250 frame - and the image editor opens on it right away.
import { c3Label, getC3Language } from './C3Language';
import newNameGenerator from './NewNameGenerator';

const gd: libGDevelop = global.gd;

// public/res/empty_sprite.png inlined, so it works on the web and desktop
// builds alike (a data: URL resource lives inside the project file).
const BLANK_SPRITE_DATA_URL =
  'data:image/png;base64,' +
  'iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAABCElEQVR42u3BAQEAAACCIP' +
  '+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwadG3AAG0ZAN8AAAAAElF' +
  'TkSuQmCC';

const pendingFirstEdit: Set<number> = new Set();

export const addBlankAnimation = (project: gdProject, object: gdObject) => {
  const resourcesManager = project.getResourcesManager();
  const resourceName = newNameGenerator(object.getName() + '.png', name =>
    resourcesManager.hasResource(name)
  );
  const resource = new gd.ImageResource();
  resource.setName(resourceName);
  resource.setFile(BLANK_SPRITE_DATA_URL);
  resourcesManager.addResource(resource);
  resource.delete();

  const animation = new gd.Animation();
  animation.setName(
    c3Label({ en: 'Animation 1', pt_BR: 'Animação 1' }, getC3Language())
  );
  animation.setDirectionsCount(1);
  const sprite = new gd.Sprite();
  sprite.setImageName(resourceName);
  animation.getDirection(0).addSprite(sprite);
  sprite.delete();
  gd.asSpriteConfiguration(object.getConfiguration())
    .getAnimations()
    .addAnimation(animation);
  animation.delete();

  pendingFirstEdit.add(object.ptr);
};

// True once, right after `addBlankAnimation`: the editor opens the image
// editor on the blank frame.
export const takeFirstEdit = (object: ?gdObject): boolean =>
  !!object && pendingFirstEdit.delete(object.ptr);
