// @flow
// c3: Construct layers have no lights. A new layer only gets GDevelop's two
// default 3D lights when the project already holds a 3D object, and their
// names follow the UI language.
import { addDefaultLightToLayer } from '../ProjectCreation/CreateProject';
import { getC3Language } from './C3Language';

const gd: libGDevelop = global.gd;

const has3DObjects = (
  project: gdProject,
  objects: gdObjectsContainer
): boolean => {
  for (let i = 0; i < objects.getObjectsCount(); i++) {
    const metadata = gd.MetadataProvider.getObjectMetadata(
      project.getCurrentPlatform(),
      objects.getObjectAt(i).getType()
    );
    if (metadata.isRenderedIn3D()) return true;
  }
  return false;
};

export const projectHas3DObjects = (project: gdProject): boolean => {
  if (has3DObjects(project, project.getObjects())) return true;
  for (let i = 0; i < project.getLayoutsCount(); i++) {
    if (has3DObjects(project, project.getLayoutAt(i).getObjects())) return true;
  }
  return false;
};

const lightNames: { [string]: { [string]: string } } = {
  '3D Sun Light': { pt_BR: 'Luz do sol 3D' },
  '3D Ambient Hemisphere Light': { pt_BR: 'Luz ambiente 3D' },
};

export const addC3DefaultLightsToLayer = (
  project: gdProject,
  layer: gdLayer
): void => {
  if (!projectHas3DObjects(project)) return;
  addDefaultLightToLayer(layer);
  const language = getC3Language();
  const effects = layer.getEffects();
  Object.keys(lightNames).forEach(name => {
    const translated = lightNames[name][language];
    if (translated) effects.getEffect(name).setName(translated);
  });
};

export const addC3DefaultLightsToAllLayers = (
  project: gdProject,
  layout: gdLayout
): void => {
  for (let i = 0; i < layout.getLayersCount(); i++) {
    addC3DefaultLightsToLayer(project, layout.getLayerAt(i));
  }
};
