// @flow
import { t } from '@lingui/macro';
import { type I18n as I18nType } from '@lingui/core';
import { type MenuItemTemplate } from '../UI/Menu/Menu.flow';
import { type MainMenuCallbacks } from './MainMenu';
import { type FileMetadataAndStorageProviderName } from '../ProjectsStorage';
import Window from '../Utils/Window';
import { getHelpLink } from '../Utils/HelpLink';

// c3: the ☰ menu of Construct 3 - Start page · Project ▸ · View ▸ · Settings
// · Help ▸ · About - shown as a dropdown instead of the project manager drawer.

type Props = {|
  i18n: I18nType,
  project: ?gdProject,
  canSaveProjectAs: boolean,
  previewEnabled: boolean,
  recentProjectFiles: Array<FileMetadataAndStorageProviderName>,
  callbacks: MainMenuCallbacks,
  onLaunchPreview: () => mixed,
  onLaunchDebugPreview: () => mixed,
  onBrowseExamples: () => void,
|};

const link = (label: string, url: string): MenuItemTemplate => ({
  label,
  click: () => Window.openExternalURL(url),
});

export const buildC3MainMenuTemplate = ({
  i18n,
  project,
  canSaveProjectAs,
  previewEnabled,
  recentProjectFiles,
  callbacks,
  onLaunchPreview,
  onLaunchDebugPreview,
  onBrowseExamples,
}: Props): Array<MenuItemTemplate> => [
  { label: i18n._(t`Start page`), click: callbacks.onOpenHomePage },
  {
    label: i18n._(t`Project`),
    submenu: [
      {
        label: i18n._(t`Save`),
        enabled: !!project,
        click: () => {
          callbacks.onSaveProject();
        },
      },
      {
        label: i18n._(t`Save as...`),
        enabled: canSaveProjectAs,
        click: callbacks.onSaveProjectAs,
      },
      {
        label: i18n._(t`Preview`),
        enabled: previewEnabled,
        click: () => {
          onLaunchPreview();
        },
      },
      {
        label: i18n._(t`Debug`),
        enabled: previewEnabled,
        click: () => {
          onLaunchDebugPreview();
        },
      },
      {
        label: i18n._(t`Export`),
        enabled: !!project,
        click: callbacks.onExportProject,
      },
      {
        label: i18n._(t`Close project`),
        enabled: !!project,
        click: () => {
          callbacks.onCloseProject();
        },
      },
      { type: 'separator' },
      { label: i18n._(t`New`), click: callbacks.onCreateProject },
      { label: i18n._(t`Open...`), click: callbacks.onChooseProject },
      {
        label: i18n._(t`Open recent`),
        submenu: recentProjectFiles.length
          ? recentProjectFiles.map(file => ({
              label: file.fileMetadata.name || file.fileMetadata.fileIdentifier,
              click: () => {
                callbacks.onOpenRecentFile(file);
              },
            }))
          : [{ label: i18n._(t`No recent project`), enabled: false }],
      },
    ],
  },
  {
    label: i18n._(t`View`),
    submenu: [
      {
        label: i18n._(t`Project bar`),
        enabled: !!project,
        click: () => callbacks.onOpenProjectManager(true),
      },
      {
        label: i18n._(t`Global search`),
        enabled: !!project,
        click: callbacks.onOpenGlobalSearch,
      },
      { label: i18n._(t`Example browser`), click: onBrowseExamples },
    ],
  },
  {
    label: i18n._(t`Settings`),
    click: () => callbacks.onOpenPreferences(true),
  },
  { label: i18n._(t`Language`), click: () => callbacks.onOpenLanguage(true) },
  {
    label: i18n._(t`Help`),
    submenu: [
      link(i18n._(t`Manual`), getHelpLink('/')),
      link(i18n._(t`Tutorials`), getHelpLink('/tutorials')),
      { type: 'separator' },
      link(i18n._(t`Forum`), 'https://forum.gdevelop.io'),
      link(i18n._(t`Discord`), 'https://discord.gg/gdevelop'),
      link(i18n._(t`GitHub repository`), 'https://github.com/4ian/GDevelop'),
    ],
  },
  { label: i18n._(t`About`), click: () => callbacks.onOpenAbout(true) },
];
