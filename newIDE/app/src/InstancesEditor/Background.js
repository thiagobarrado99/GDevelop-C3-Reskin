// @flow
import * as PIXI from 'pixi.js-legacy';
import transformRect from '../Utils/TransformRect';
import { rgbToHexNumber } from '../Utils/ColorTransformer';
import Rectangle from '../Utils/Rectangle';

type Props = {
  width: number,
  height: number,
  layout: gdLayout | null,
  project: gdProject, // c3
  toCanvasCoordinates: (x: number, y: number) => [number, number], // c3
};

// c3: Construct's canvas - dark surround outside the layout frame.
const SURROUND_COLOR = 0x1f1f1f;

export default class Background {
  // $FlowFixMe[value-as-type]
  _checkeredBackground: PIXI.TilingSprite;
  // $FlowFixMe[value-as-type]
  _container: PIXI.Container;
  // $FlowFixMe[value-as-type]
  _surround: PIXI.Graphics;
  _layoutRectangle: Rectangle = new Rectangle();
  width: number;
  height: number;
  layout: gdLayout | null;
  project: gdProject;
  toCanvasCoordinates: (x: number, y: number) => [number, number];

  constructor({ width, height, layout, project, toCanvasCoordinates }: Props) {
    this.width = width;
    this.height = height;
    this.layout = layout;
    this.project = project;
    this.toCanvasCoordinates = toCanvasCoordinates;
    this._checkeredBackground = new PIXI.TilingSprite(
      new PIXI.Texture(PIXI.Texture.from('res/transparentback.png')),
      width,
      height
    );
    this._checkeredBackground.tint = 0x444444;
    this._checkeredBackground.visible = !layout;
    this._surround = new PIXI.Graphics();
    this._surround.visible = !!layout;
    this._container = new PIXI.Container();
    this._container.addChild(this._checkeredBackground);
    this._container.addChild(this._surround);
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this._checkeredBackground.width = width;
    this._checkeredBackground.height = height;
  }

  // $FlowFixMe[value-as-type]
  getPixiObject(): PIXI.Container {
    return this._container;
  }

  render() {
    const { layout } = this;
    if (!layout) return;
    this._layoutRectangle.set({
      left: 0,
      top: 0,
      right: this.project.getGameResolutionWidth(),
      bottom: this.project.getGameResolutionHeight(),
    });
    const frame = transformRect(
      this.toCanvasCoordinates,
      this._layoutRectangle
    );
    this._surround.clear();
    this._surround.beginFill(SURROUND_COLOR);
    this._surround.drawRect(0, 0, this.width, this.height);
    this._surround.endFill();
    this._surround.beginFill(
      rgbToHexNumber(
        layout.getBackgroundColorRed(),
        layout.getBackgroundColorGreen(),
        layout.getBackgroundColorBlue()
      )
    );
    this._surround.drawRect(
      frame.left,
      frame.top,
      frame.width(),
      frame.height()
    );
    this._surround.endFill();
  }
}
