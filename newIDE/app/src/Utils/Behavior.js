// @flow
import newNameGenerator from './NewNameGenerator';
import Window from './Window';
import { C3_BEHAVIORS } from './C3Behaviors'; // c3

const gd: libGDevelop = global.gd;

export const hasBehaviorWithType = (object: gdObject, type: string): number =>
  object
    .getAllBehaviorNames()
    .toJSArray()
    .filter(
      behaviorName => object.getBehavior(behaviorName).getTypeName() === type
    ).length;

export const addBehaviorToObject = (
  project: gdProject,
  object: gdObject,
  type: string,
  defaultName: string,
  shouldSkipExistingBehaviorSilently: boolean,
  presets?: { [string]: string } // c3: property values set right after adding
): boolean => {
  if (hasBehaviorWithType(object, type)) {
    if (shouldSkipExistingBehaviorSilently) {
      return false;
    }
    const answer = Window.showConfirmDialog(
      "There is already a behavior of this type attached to the object. It's possible to add this behavior again, but it's unusual and may not always be supported properly. Are you sure you want to add this behavior again?"
    );

    if (!answer) return false;
  }

  // c3: every path that adds a behaviour with GDevelop's default name (events
  // sheet, AI, required behaviours) gets the Construct tile's name and presets.
  const c3Tile = C3_BEHAVIORS.find(tile => tile.type === type);
  const gdDefaultName = gd.MetadataProvider.getBehaviorMetadata(
    project.getCurrentPlatform(),
    type
  ).getDefaultName();
  if (c3Tile && defaultName === gdDefaultName) {
    defaultName = c3Tile.defaultName;
    if (!presets) presets = c3Tile.presets;
  }
  const behaviorNamesBefore = object.getAllBehaviorNames().toJSArray();

  const name = newNameGenerator(defaultName, name =>
    object.hasBehaviorNamed(name)
  );
  gd.WholeProjectRefactorer.addBehaviorAndRequiredBehaviors(
    project,
    object,
    type,
    name
  );

  // Show the behavior properties in the editor by default, when just added.
  object.getBehavior(name).setFolded(false);
  if (presets) {
    // c3: a Construct tile may be a GDevelop behaviour with fixed settings.
    const behavior = object.getBehavior(name);
    for (const property of Object.keys(presets))
      behavior.updateProperty(property, presets[property]);
  }
  // c3: required behaviours added along get their tile name too.
  object
    .getAllBehaviorNames()
    .toJSArray()
    .filter(
      behaviorName =>
        behaviorName !== name && !behaviorNamesBefore.includes(behaviorName)
    )
    .forEach(behaviorName => {
      const tile = C3_BEHAVIORS.find(
        tile => tile.type === object.getBehavior(behaviorName).getTypeName()
      );
      if (!tile || tile.defaultName === behaviorName) return;
      const newName = newNameGenerator(tile.defaultName, name =>
        object.hasBehaviorNamed(name)
      );
      object.renameBehavior(behaviorName, newName);
    });

  return true;
};

export const listObjectBehaviorsTypes = (object: gdObject): Array<string> =>
  object
    .getAllBehaviorNames()
    .toJSArray()
    .map(behaviorName => object.getBehavior(behaviorName).getTypeName());

export const listObjectsBehaviorsTypes = (
  objects: Array<gdObject>
): Array<string> =>
  objects.length === 0
    ? []
    : objects[0]
        .getAllBehaviorNames()
        .toJSArray()
        .filter(behaviorName =>
          objects.every(object => object.hasBehaviorNamed(behaviorName))
        )
        .map(behaviorName =>
          objects[0].getBehavior(behaviorName).getTypeName()
        );

export const getAllVisibleBehaviorNames = (
  objects: Array<gdObject>
): Array<string> =>
  objects.length === 0
    ? []
    : objects[0]
        .getAllBehaviorNames()
        .toJSArray()
        .filter(
          behaviorName =>
            // As for now, any default behavior is hidden,
            // it avoids to get behavior metadata to check the "hidden" flag.
            !objects[0].getBehavior(behaviorName).isDefaultBehavior() &&
            (objects.length === 1 ||
              objects.every(object => object.hasBehaviorNamed(behaviorName)))
        );
