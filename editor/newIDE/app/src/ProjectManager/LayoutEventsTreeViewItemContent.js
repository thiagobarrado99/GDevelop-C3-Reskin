// @flow
// c3: a layout's own event sheet, listed under "Event sheets" like Construct
// does (renaming/deleting belong to the layout row).
import { type I18n as I18nType } from '@lingui/core';
import { t } from '@lingui/macro';
import * as React from 'react';
import { type TreeViewItemContent, externalEventsRootFolderId } from '.';
import { type SceneTreeViewItemProps } from './SceneTreeViewItemContent';
import { type HTMLDataset } from '../Utils/HTMLDataset';

export const getLayoutEventsTreeViewItemId = (scene: gdLayout): string =>
  `layout-events-${scene.ptr}`;

export class LayoutEventsTreeViewItemContent implements TreeViewItemContent {
  scene: gdLayout;
  props: SceneTreeViewItemProps;

  constructor(scene: gdLayout, props: SceneTreeViewItemProps) {
    this.scene = scene;
    this.props = props;
  }

  isDescendantOf(itemContent: TreeViewItemContent): boolean {
    return itemContent.getId() === externalEventsRootFolderId;
  }

  getRootId(): string {
    return externalEventsRootFolderId;
  }

  getName(): string | React.Node {
    return this.scene.getName();
  }

  getId(): string {
    return getLayoutEventsTreeViewItemId(this.scene);
  }

  getHtmlId(index: number): ?string {
    return `layout-events-item-${index}`;
  }

  getDataSet(): ?HTMLDataset {
    return { 'layout-events': this.scene.getName() };
  }

  getThumbnail(): ?string {
    return 'res/icons_default/external_events_black.svg';
  }

  onClick(): void {
    this.props.onOpenLayout(this.scene.getName(), {
      openEventsEditor: true,
      openSceneEditor: false,
      focusWhenOpened: 'events',
    });
  }

  rename(newName: string): void {}

  edit(): void {}

  buildMenuTemplate(i18n: I18nType, index: number): any {
    return [{ label: i18n._(t`Open`), click: () => this.onClick() }];
  }

  renderRightComponent(i18n: I18nType): ?React.Node {
    return null;
  }

  delete(): void {}

  getIndex(): number {
    return this.props.project.getLayoutPosition(this.scene.getName());
  }

  moveAt(destinationIndex: number): void {}

  copy(): void {}

  cut(): void {}

  paste(): void {}

  getRightButton(i18n: I18nType): any {
    return null;
  }
}
