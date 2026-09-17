// @flow
import * as React from 'react';
import { Trans, t } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { type I18n as I18nType } from '@lingui/core';
import Dialog, { DialogPrimaryButton } from '../UI/Dialog';
import FlatButton from '../UI/FlatButton';
import TextField from '../UI/TextField';
import SelectField from '../UI/SelectField';
import SelectOption from '../UI/SelectOption';
import Checkbox from '../UI/Checkbox';
import Text from '../UI/Text';
import { Line, Spacer } from '../UI/Grid';
import Window from '../Utils/Window';
import { getHelpLink } from '../Utils/HelpLink';
import optionalRequire from '../Utils/OptionalRequire';
import AuthenticatedUserContext from '../Profile/AuthenticatedUserContext';
import PreferencesContext from '../MainFrame/Preferences/PreferencesContext';
import { emptyStorageProvider } from '../ProjectsStorage/ProjectStorageProviders';
import { findEmptyPathInWorkspaceFolder } from '../ProjectsStorage/LocalFileStorageProvider/LocalPathFinder';
import { type StorageProvider } from '../ProjectsStorage';
import { CLOUD_PROJECT_NAME_MAX_LENGTH } from '../Utils/GDevelopServices/Project';
import { type CreateProjectResult } from '../Utils/UseCreateProject';
import { type NewProjectSetup } from './NewProjectSetupDialog';
import { type MessageDescriptor } from '../Utils/i18n/MessageDescriptor.flow';

// c3: the "New project" dialog of Construct 3 - a single label-left form
// (Name, Preset, Viewport size, Orientation, Start with, pixel art) with
// Help bottom-left and Create/Cancel bottom-right. Storage is decided
// silently (preferences, then cloud when logged in, then local file, then
// "don't save now") like Construct does with its default save location.

const electron = optionalRequire('electron');
const remote = optionalRequire('@electron/remote');
const app = remote ? remote.app : null;

type Preset = {|
  id: string,
  label: MessageDescriptor,
  width: number,
  height: number,
|};
const presets: Array<Preset> = [
  { id: 'retro', label: t`Retro style`, width: 320, height: 240 },
  { id: 'sd-4-3', label: t`SD landscape 4:3`, width: 640, height: 480 },
  { id: 'sd-3-4', label: t`SD portrait 3:4`, width: 480, height: 640 },
  { id: 'sd-16-9', label: t`SD landscape 16:9`, width: 854, height: 480 },
  { id: 'sd-9-16', label: t`SD portrait 9:16`, width: 480, height: 854 },
  { id: '720p', label: t`720p landscape`, width: 1280, height: 720 },
  { id: '720p-portrait', label: t`720p portrait`, width: 720, height: 1280 },
  { id: '1080p', label: t`1080p landscape`, width: 1920, height: 1080 },
  { id: '1080p-portrait', label: t`1080p portrait`, width: 1080, height: 1920 },
  { id: '4k', label: t`4K landscape`, width: 3840, height: 2160 },
  { id: '4k-portrait', label: t`4K portrait`, width: 2160, height: 3840 },
];

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const commonRatios = [
  [16, 9],
  [9, 16],
  [4, 3],
  [3, 4],
  [16, 10],
  [10, 16],
  [3, 2],
  [2, 3],
  [21, 9],
  [1, 1],
];
// Nearest common ratio (854x480 is shown as 16:9), exact ratio otherwise.
const ratioLabel = (width: number, height: number): string => {
  if (!width || !height) return '';
  const ratio = width / height;
  const common = commonRatios.find(([w, h]) => Math.abs(ratio - w / h) < 0.01);
  if (common) return `${common[0]}:${common[1]}`;
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
};

const styles = {
  form: {
    display: 'grid',
    gridTemplateColumns: 'minmax(120px, max-content) 1fr',
    columnGap: 16,
    rowGap: 12,
    alignItems: 'center',
  },
  label: { textAlign: 'right' },
  size: { display: 'flex', alignItems: 'center', gap: 8 },
};

const Row = ({
  label,
  children,
}: {|
  label: React.Node,
  children: React.Node,
|}) => (
  <>
    <div style={styles.label}>
      <Text noMargin>{label}</Text>
    </div>
    <div>{children}</div>
  </>
);

type Props = {|
  isProjectOpening?: boolean,
  onClose: () => void,
  onCreateEmptyProject: (
    newProjectSetup: NewProjectSetup
  ) => Promise<CreateProjectResult>,
  storageProviders: Array<StorageProvider>,
|};

const C3NewProjectDialog = ({
  isProjectOpening,
  onClose,
  onCreateEmptyProject,
  storageProviders,
}: Props): React.Node => {
  const { authenticated } = React.useContext(AuthenticatedUserContext);
  const { values } = React.useContext(PreferencesContext);
  const [projectName, setProjectName] = React.useState<string>('');
  const [presetId, setPresetId] = React.useState<string>('sd-16-9');
  const [width, setWidth] = React.useState<number>(854);
  const [height, setHeight] = React.useState<number>(480);
  const [orientation, setOrientation] = React.useState<
    'default' | 'portrait' | 'landscape'
  >('landscape');
  const [optimizeForPixelArt, setOptimizeForPixelArt] = React.useState(false);
  const [error, setError] = React.useState<?React.Node>(null);

  const choosePreset = (id: string) => {
    const preset = presets.find(preset => preset.id === id);
    if (!preset) return;
    setPresetId(id);
    setWidth(preset.width);
    setHeight(preset.height);
    setOrientation(preset.width >= preset.height ? 'landscape' : 'portrait');
  };
  const setSize = (newWidth: number, newHeight: number) => {
    setWidth(newWidth);
    setHeight(newHeight);
    const matching = presets.find(
      preset => preset.width === newWidth && preset.height === newHeight
    );
    setPresetId(matching ? matching.id : '');
  };

  const onCreate = async (i18n: I18nType) => {
    if (isProjectOpening) return;
    const name = projectName.trim() || i18n._(t`New project`);
    if (!width || !height) {
      setError(<Trans>Please enter a valid viewport size.</Trans>);
      return;
    }
    const find = (internalName: string) =>
      storageProviders.find(provider => provider.internalName === internalName);
    const preferred = find(values.newProjectsDefaultStorageProviderName || '');
    let storageProvider: StorageProvider =
      (preferred && preferred.internalName !== 'Empty' && preferred) ||
      (authenticated && find('Cloud')) ||
      find('LocalFile') ||
      emptyStorageProvider;
    if (storageProvider.needUserAuthentication && !authenticated) {
      storageProvider = electron
        ? find('LocalFile') || emptyStorageProvider
        : emptyStorageProvider;
    }
    const newProjectsDefaultFolder = app
      ? findEmptyPathInWorkspaceFolder(
          app,
          values.newProjectsDefaultFolder || ''
        )
      : '';
    const saveAsLocation = storageProvider.getProjectLocation
      ? storageProvider.getProjectLocation({
          projectName: name,
          saveAsLocation: null,
          newProjectsDefaultFolder,
        })
      : null;

    await onCreateEmptyProject({
      projectName: name,
      storageProvider,
      saveAsLocation,
      width,
      height,
      orientation,
      optimizeForPixelArt,
      creationSource: 'default',
    });
  };

  return (
    <I18n>
      {({ i18n }) => (
        <Dialog
          title={<Trans>New project</Trans>}
          id="c3-new-project-dialog"
          open
          maxWidth="sm"
          cannotBeDismissed={isProjectOpening}
          onRequestClose={onClose}
          onApply={() => onCreate(i18n)}
          secondaryActions={[
            <FlatButton
              key="help"
              label={<Trans>Help</Trans>}
              onClick={() => Window.openExternalURL(getHelpLink('/'))}
            />,
          ]}
          actions={[
            <DialogPrimaryButton
              key="create"
              primary
              label={<Trans>Create</Trans>}
              disabled={isProjectOpening}
              onClick={() => onCreate(i18n)}
              id="create-project-button"
            />,
            <FlatButton
              key="cancel"
              label={<Trans>Cancel</Trans>}
              disabled={isProjectOpening}
              onClick={onClose}
            />,
          ]}
        >
          <div style={styles.form}>
            <Row label={<Trans>Name</Trans>}>
              <TextField
                margin="none"
                fullWidth
                value={projectName}
                onChange={(e, text) => setProjectName(text)}
                translatableHintText={t`New project`}
                maxLength={CLOUD_PROJECT_NAME_MAX_LENGTH}
                autoFocus="desktop"
                disabled={isProjectOpening}
              />
            </Row>
            <Row label={<Trans>Choose preset</Trans>}>
              <SelectField
                margin="none"
                fullWidth
                value={presetId}
                onChange={(e, i, value) => choosePreset(value)}
                disabled={isProjectOpening}
              >
                {presets.map(preset => (
                  <SelectOption
                    key={preset.id}
                    value={preset.id}
                    label={preset.label}
                  />
                ))}
                {!presetId && <SelectOption value="" label={t`Custom`} />}
              </SelectField>
            </Row>
            <Row label={<Trans>Viewport size</Trans>}>
              <div style={styles.size}>
                <TextField
                  margin="none"
                  type="number"
                  min={1}
                  value={width}
                  onChange={(e, value) => setSize(Number(value) || 0, height)}
                  errorText={error}
                  disabled={isProjectOpening}
                />
                <Text noMargin>x</Text>
                <TextField
                  margin="none"
                  type="number"
                  min={1}
                  value={height}
                  onChange={(e, value) => setSize(width, Number(value) || 0)}
                  disabled={isProjectOpening}
                />
                <Spacer />
                <Text noMargin color="secondary">
                  {ratioLabel(width, height)}
                </Text>
              </div>
            </Row>
            <Row label={<Trans>Orientations</Trans>}>
              <SelectField
                margin="none"
                fullWidth
                value={orientation}
                onChange={(e, i, value) =>
                  setOrientation(
                    value === 'portrait' || value === 'landscape'
                      ? value
                      : 'default'
                  )
                }
                disabled={isProjectOpening}
              >
                <SelectOption value="default" label={t`Any`} />
                <SelectOption value="portrait" label={t`Portrait`} />
                <SelectOption value="landscape" label={t`Landscape`} />
              </SelectField>
            </Row>
            <Row label={<Trans>Start with</Trans>}>
              <SelectField margin="none" fullWidth value="event-sheet" disabled>
                <SelectOption value="event-sheet" label={t`Event sheet`} />
              </SelectField>
            </Row>
            <div />
            <Line noMargin>
              <Checkbox
                checked={optimizeForPixelArt}
                onCheck={(e, checked) => setOptimizeForPixelArt(checked)}
                label={<Trans>Optimize for pixel art</Trans>}
                disabled={isProjectOpening}
              />
            </Line>
          </div>
        </Dialog>
      )}
    </I18n>
  );
};

export default C3NewProjectDialog;
