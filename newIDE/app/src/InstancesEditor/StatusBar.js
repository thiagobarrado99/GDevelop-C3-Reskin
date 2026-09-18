// @flow
import * as PIXI from 'pixi.js-legacy';
import { type InstancesEditorSettings } from './InstancesEditorSettings'; // c3
import { c3Label, C3_CANVAS_LABELS } from '../Utils/C3Language'; // c3

type Props = {
  getLastCursorSceneCoordinates: () => [number, number] | null,
  getInstancesEditorSettings?: () => InstancesEditorSettings, // c3: Construct's "Mouse · Active layer · Zoom" status bar
  width: number,
  height: number,
};

export default class StatusBar {
  _width: number;
  _height: number;
  _getLastCursorSceneCoordinates: () => [number, number] | null;
  _getInstancesEditorSettings: ?() => InstancesEditorSettings;
  // $FlowFixMe[value-as-type]
  _statusBarContainer: PIXI.Container;
  // $FlowFixMe[value-as-type]
  _statusBarBackground: PIXI.Graphics;
  // $FlowFixMe[value-as-type]
  _statusBarText: PIXI.Text;

  constructor({
    getLastCursorSceneCoordinates,
    getInstancesEditorSettings,
    width,
    height,
  }: Props) {
    this._getLastCursorSceneCoordinates = getLastCursorSceneCoordinates;
    this._getInstancesEditorSettings = getInstancesEditorSettings; // c3
    this._statusBarContainer = new PIXI.Container();
    this._statusBarContainer.alpha = 0.8;
    this._statusBarContainer.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
    this._statusBarBackground = new PIXI.Graphics();
    this._statusBarText = new PIXI.Text('', {
      fontSize: getInstancesEditorSettings ? 12 : 15, // c3
      fill: 0xffffff,
      align: 'left',
    });
    this._statusBarContainer.addChild(this._statusBarBackground);
    this._statusBarContainer.addChild(this._statusBarText);
    this.resize(width, height);
  }

  resize(width: number, height: number) {
    this._width = width;
    this._height = height;
  }

  // $FlowFixMe[value-as-type]
  getPixiObject(): PIXI.Container {
    return this._statusBarContainer;
  }

  render() {
    const textPadding = 5;
    const statusBarPadding = 15;
    const borderRadius = 6;
    const textXPosition = Math.round(
      this._width - statusBarPadding - textPadding - this._statusBarText.width
    );
    const textYPosition = Math.round(
      this._height - textPadding - statusBarPadding - this._statusBarText.height
    );

    const lastCursorSceneCoordinates = this._getLastCursorSceneCoordinates();
    if (!lastCursorSceneCoordinates) return;
    const [x, y] = lastCursorSceneCoordinates;
    // c3: Construct's status bar text.
    const settings = this._getInstancesEditorSettings
      ? this._getInstancesEditorSettings()
      : null;
    this._statusBarText.text = settings
      ? `Mouse: (${x.toFixed(0)}, ${y.toFixed(0)})   ${c3Label(
          C3_CANVAS_LABELS.layer
        )}: ${settings.selectedLayer ||
          c3Label(C3_CANVAS_LABELS.baseLayer)}   Zoom: ${Math.round(
          settings.zoomFactor * 100
        )}%`
      : `${x.toFixed(0)};${y.toFixed(0)}`;
    this._statusBarText.position.x = textXPosition;
    this._statusBarText.position.y = textYPosition;

    const statusBarXPosition =
      this._width -
      statusBarPadding -
      textPadding * 2 -
      this._statusBarText.width;
    const statusBarYPosition =
      this._height -
      statusBarPadding -
      textPadding * 2 -
      this._statusBarText.height;
    const statusBarWidth = this._statusBarText.width + textPadding * 2;
    const statusBarHeight = this._statusBarText.height + textPadding * 2;

    this._statusBarBackground.clear();
    this._statusBarBackground.beginFill(settings ? 0x303030 : 0x000000, 0.8); // c3
    this._statusBarBackground.drawRoundedRect(
      statusBarXPosition,
      statusBarYPosition,
      statusBarWidth,
      statusBarHeight,
      settings ? 2 : borderRadius // c3
    );
    this._statusBarBackground.endFill();
  }
}
