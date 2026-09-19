// @flow
// c3: outlines every instance of the objects selected in the project bar, so
// an object type picked in the "Object types" section is easy to spot in the
// open layout (the instances are not selected - only shown).
import * as PIXI from 'pixi.js-legacy';
import transformRect from '../Utils/TransformRect';
import { type InstanceMeasurer } from './InstancesRenderer';
import Rectangle from '../Utils/Rectangle';

const gd: libGDevelop = global.gd;

// Construct's object cyan (see --c3-object-label-color).
const OUTLINE_COLOR = 0x00b1cc;

export default class C3ObjectInstancesHighlight {
  instances: gdInitialInstancesContainer;
  instanceMeasurer: InstanceMeasurer;
  toCanvasCoordinates: (x: number, y: number) => [number, number];
  // $FlowFixMe[value-as-type]
  graphics: PIXI.Graphics;
  instancesFunctor: gdInitialInstanceJSFunctor;
  _objectNames: Set<string> = new Set();
  _temporaryRectangle: Rectangle = new Rectangle();

  constructor({
    instances,
    instanceMeasurer,
    toCanvasCoordinates,
  }: {
    instances: gdInitialInstancesContainer,
    instanceMeasurer: InstanceMeasurer,
    toCanvasCoordinates: (x: number, y: number) => [number, number],
  }) {
    this.instances = instances;
    this.instanceMeasurer = instanceMeasurer;
    this.toCanvasCoordinates = toCanvasCoordinates;
    this.graphics = new PIXI.Graphics();

    // $FlowFixMe[invalid-constructor] - JSFunctor is a class-like.
    this.instancesFunctor = new gd.InitialInstanceJSFunctor();
    // $FlowFixMe[cannot-write]
    this.instancesFunctor.invoke = instancePtr => {
      const instance: gdInitialInstance = gd.wrapPointer(
        // $FlowFixMe[incompatible-type]
        instancePtr,
        gd.InitialInstance
      );
      if (!this._objectNames.has(instance.getObjectName())) return;
      const rectangle = transformRect(
        this.toCanvasCoordinates,
        this.instanceMeasurer.getInstanceAABB(
          instance,
          this._temporaryRectangle
        )
      );
      this.graphics.drawRect(
        rectangle.left,
        rectangle.top,
        rectangle.width(),
        rectangle.height()
      );
    };
  }

  setObjectNames(objectNames: Array<string>) {
    this._objectNames = new Set(objectNames);
  }

  // $FlowFixMe[value-as-type]
  getPixiObject(): PIXI.Container {
    return this.graphics;
  }

  render() {
    this.graphics.clear();
    if (this._objectNames.size === 0) return;
    this.graphics.lineStyle(2, OUTLINE_COLOR, 1);
    this.graphics.beginFill(OUTLINE_COLOR, 0.12);
    // $FlowFixMe[incompatible-type]
    this.instances.iterateOverInstances(this.instancesFunctor);
    this.graphics.endFill();
  }

  delete() {
    this.instancesFunctor.delete();
  }
}
