// @flow
import { type I18n as I18nType } from '@lingui/core';
import { t } from '@lingui/macro';

import * as React from 'react';
import {
  type TreeViewItemContent,
  type TreeItemProps,
  layersRootFolderId,
} from '.';
// c3: Tooltip and Radio no longer used (the row shows the layer index).
import { type HTMLDataset } from '../Utils/HTMLDataset';
import VisibilityIcon from '../UI/CustomSvgIcons/Visibility';
import VisibilityOffIcon from '../UI/CustomSvgIcons/VisibilityOff';
import LockIcon from '../UI/CustomSvgIcons/Lock';
import LockOpenIcon from '../UI/CustomSvgIcons/LockOpen';
import { addC3DefaultLightsToLayer } from '../Utils/C3Layers'; // c3

export type LayerTreeViewItemProps = {|
  ...TreeItemProps,
  layersContainer: gdLayersContainer,
  chosenLayer: string,
  onChooseLayer: (layerName: string) => void,
  onSelectLayer: (layer: gdLayer | null) => void,
  onEditLayer: (layer: ?gdLayer) => void,
  onDeleteLayer: (layer: gdLayer) => void,
  onLayersModified: () => void,
  onRenameLayer: (oldName: string, newName: string) => void,
  triggerOnLayersModified: () => void,
|};

export const getLayerTreeViewItemId = (layer: gdLayer): string => {
  // Pointers are used because they stay the same even when the names are
  // changed.
  return `layer-${layer.ptr}`;
};

export class LayerTreeViewItemContent implements TreeViewItemContent {
  layer: gdLayer;
  props: LayerTreeViewItemProps;

  constructor(layer: gdLayer, props: LayerTreeViewItemProps) {
    this.layer = layer;
    this.props = props;
  }

  isDescendantOf(itemContent: TreeViewItemContent): boolean {
    return itemContent.getId() === layersRootFolderId;
  }

  getRootId(): string {
    // This is not actually a parent, but it's useful to check where layers
    // can be dropped.
    return layersRootFolderId;
  }

  getName(i18n: I18nType): string | React.Node {
    return this._isBaseLayer() ? i18n._(t`Base layer`) : this.layer.getName();
  }

  _isBaseLayer(): any {
    return !this.layer.getName();
  }

  getId(): string {
    return getLayerTreeViewItemId(this.layer);
  }

  getHtmlId(nodeIndex: number): ?string {
    // This index is not reversed with `_getRevertedIndex`
    return `layer-${this.props.layersContainer.getLayerPosition(
      this.layer.getName()
    )}`;
  }

  getDataSet(): ?HTMLDataset {
    return {
      scene: this.layer.getName(),
    };
  }

  getThumbnail(): ?string {
    return null;
  }

  onClick(): void {
    this.props.onSelectLayer(this.layer);
    // c3: the selected row is the active layer, as in Construct.
    this.props.onChooseLayer(this.layer.getName());
  }

  rename(newName: string): void {
    if (!newName) {
      return;
    }
    const oldName = this.layer.getName();
    if (oldName === newName) {
      return;
    }
    this.props.onRenameLayer(oldName, newName);
  }

  edit(): void {
    this.props.onEditLayer(this.layer);
    this.props.onSelectLayer(null);
  }

  _isVisible(): boolean {
    return this.layer.getVisibility();
  }

  _isLocked(): boolean {
    return this.layer.isLocked();
  }

  _setVisibility(visible: boolean): void {
    this.layer.setVisibility(visible);
    this.props.triggerOnLayersModified();
  }

  _setLocked(isLocked: boolean): void {
    this.layer.setLocked(isLocked);
    this.props.triggerOnLayersModified();
  }

  // c3: Construct's "Add layer above/below" context entries.
  _insertLayer(i18n: I18nType, offset: number): void {
    const { layersContainer } = this.props;
    let n = 1;
    while (layersContainer.hasLayerNamed(`${i18n._(t`Layer`)} ${n}`)) n++;
    const name = `${i18n._(t`Layer`)} ${n}`;
    layersContainer.insertNewLayer(
      name,
      layersContainer.getLayerPosition(this.layer.getName()) + offset
    );
    addC3DefaultLightsToLayer(
      this.props.project,
      layersContainer.getLayer(name)
    );
    this.props.triggerOnLayersModified();
    this.props.forceUpdateList();
  }

  getRightButton(i18n: I18nType): any {
    return [
      {
        icon: this._isVisible() ? <VisibilityIcon /> : <VisibilityOffIcon />,
        label: i18n._(t`Visible`),
        click: () => this._setVisibility(!this._isVisible()),
        id: 'layer-visibility',
      },
      {
        icon:
          this._isLocked() || !this._isVisible() ? (
            <LockIcon />
          ) : (
            <LockOpenIcon />
          ),
        label: i18n._(t`Locked`),
        enabled: this._isVisible(),
        click: () => this._setLocked(!this._isLocked()),
        id: 'layer-lock',
      },
    ];
  }

  buildMenuTemplate(i18n: I18nType, index: number): any {
    return [
      {
        label: i18n._(t`Rename`),
        click: () => this.props.editName(this.getId()),
        accelerator: 'F2',
        enabled: !this._isBaseLayer(),
      },
      {
        label: i18n._(t`Delete`),
        click: () => this.delete(),
        accelerator: 'Backspace',
        enabled: !this._isBaseLayer(),
      },
      {
        type: 'separator',
      },
      {
        label: i18n._(t`Open layer editor`),
        click: () => {
          this.props.onEditLayer(this.layer);
          this.props.onSelectLayer(null);
        },
      },
      // c3
      {
        label: i18n._(t`Add layer above`),
        click: () => this._insertLayer(i18n, 1),
      },
      {
        label: i18n._(t`Add layer below`),
        click: () => this._insertLayer(i18n, 0),
      },
      {
        type: 'separator',
      },
      {
        type: 'checkbox',
        label: i18n._(t`Visible`),
        checked: this._isVisible(),
        click: () => this._setVisibility(!this._isVisible()),
      },
      {
        type: 'checkbox',
        label: i18n._(t`Locked`),
        enabled: this._isVisible(),
        checked: this._isLocked() || !this._isVisible(),
        click: () => this._setLocked(!this._isLocked()),
      },
    ];
  }

  _isChosenLayer(): boolean {
    return this.layer.getName() === this.props.chosenLayer;
  }

  renderRightComponent(i18n: I18nType): ?React.Node {
    // c3: Construct shows the layer index (0 = bottom) instead of a radio.
    return (
      <span
        className="c3-layer-index"
        id={`layer-selected-${this._isChosenLayer() ? 'checked' : 'unchecked'}`}
      >
        {this.props.layersContainer.getLayerPosition(this.layer.getName())}
      </span>
    );
  }

  delete(): void {
    this.props.onDeleteLayer(this.layer);
  }

  getIndex(): number {
    return this._getRevertedIndex(
      this.props.layersContainer.getLayerPosition(this.layer.getName())
    );
  }

  _getRevertedIndex(index: number): number {
    return this.props.layersContainer.getLayersCount() - 1 - index;
  }

  moveAt(destinationIndex: number): void {
    const originIndex = this.getIndex();
    if (destinationIndex !== originIndex) {
      this.props.layersContainer.moveLayer(
        this._getRevertedIndex(originIndex),
        // When moving the item down, it must not be counted.
        this._getRevertedIndex(
          destinationIndex + (destinationIndex <= originIndex ? 0 : -1)
        )
      );
      this._onProjectItemModified();
    }
  }

  _onProjectItemModified() {
    if (this.props.unsavedChanges)
      this.props.unsavedChanges.triggerUnsavedChanges();
    this.props.forceUpdate();
  }
}
