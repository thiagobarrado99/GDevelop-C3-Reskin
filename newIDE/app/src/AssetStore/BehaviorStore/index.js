// @flow
import { type I18n as I18nType } from '@lingui/core';
import * as React from 'react';
import semverGreaterThan from 'semver/functions/gt';
import semverValid from 'semver/functions/valid';
import SearchBar from '../../UI/SearchBar';
import {
  getBreakingChanges,
  isCompatibleWithGDevelopVersion,
} from '../../Utils/Extension/ExtensionCompatibilityChecker.js';
import { type BehaviorShortHeader } from '../../Utils/GDevelopServices/Extension';
import { BehaviorStoreContext } from './BehaviorStoreContext';
import { ListSearchResults } from '../../UI/Search/ListSearchResults';
import { BehaviorListItem, isBehaviorUsable } from './BehaviorListItem';
import C3TileGrid from '../../UI/C3TileGrid'; // c3
import { translateExtensionCategory } from '../../Utils/Extension/ExtensionCategories'; // c3
import { C3_EXTENSIONS } from '../../Utils/C3Extensions'; // c3
import { c3BehaviorIcon, getC3BehaviorIconFilename } from '../../Utils/C3Icons'; // c3
import {
  C3_BEHAVIORS,
  C3_BEHAVIOR_CATEGORIES,
  c3Label,
  type C3Behavior,
} from '../../Utils/C3Behaviors'; // c3
import { type SearchMatch } from '../../UI/Search/UseSearchStructuredItem';
import { sendExtensionAddedToProject } from '../../Utils/Analytics/EventSender';
import useDismissableTutorialMessage from '../../Hints/useDismissableTutorialMessage';
import { t } from '@lingui/macro';
import { ColumnStackLayout } from '../../UI/Layout';
import { Column, Line } from '../../UI/Grid';
import PreferencesContext from '../../MainFrame/Preferences/PreferencesContext';
import { ResponsiveLineStackLayout } from '../../UI/Layout';
import SearchBarSelectField from '../../UI/SearchBarSelectField';
import SelectOption from '../../UI/SelectOption';
import ElementWithMenu from '../../UI/Menu/ElementWithMenu';
import IconButton from '../../UI/IconButton';
import ThreeDotsMenu from '../../UI/CustomSvgIcons/ThreeDotsMenu';
import useAlertDialog from '../../UI/Alert/useAlertDialog';
import ExtensionInstallDialog from '../ExtensionStore/ExtensionInstallDialog';
import { getIDEVersion } from '../../Version';
import InAppTutorialContext from '../../InAppTutorial/InAppTutorialContext';

export const useExtensionUpdateAlertDialog = (): ((
  project: gdProject,
  behaviorShortHeader: BehaviorShortHeader
) => Promise<boolean>) => {
  const { showConfirmation } = useAlertDialog();
  const { currentlyRunningInAppTutorial } = React.useContext(
    InAppTutorialContext
  );
  return async (
    project: gdProject,
    behaviorShortHeader: BehaviorShortHeader
  ): Promise<boolean> => {
    if (currentlyRunningInAppTutorial) {
      return false;
    }
    return await showConfirmation({
      title: t`Extension update`,
      message:
        behaviorShortHeader.tier === 'reviewed'
          ? // Reviewed extensions are closely watched
            // and any breaking change will be added to the extension metadata.
            t`This behavior can be updated with new features and fixes.${'\n\n'}Do you want to update it now ?`
          : // Experimental extensions are checked as much as possible
            // but we can't ensure every breaking changes will be added to the extension metadata.
            t`This behavior can be updated. You may have to do some adaptations to make sure your game still works.${'\n\n'}Do you want to update it now ?`,
      confirmButtonLabel: t`Update the extension`,
      dismissButtonLabel: t`Skip the update`,
    });
  };
};

type Props = {|
  i18n: I18nType, // c3
  isInstalling: boolean,
  project: gdProject,
  objectType: string,
  objectBehaviorsTypes: Array<string>,
  isChildObject: boolean,
  installedBehaviorMetadataList: Array<BehaviorShortHeader>,
  deprecatedBehaviorMetadataList: Array<BehaviorShortHeader>,
  onInstall: (behaviorShortHeader: BehaviorShortHeader) => Promise<boolean>,
  onChoose: (behaviorType: string, c3TileId?: string) => void, // c3: tile id carries presets
  shouldCheckCapabilityBehaviors: boolean,
|};

const getBehaviorType = (behaviorShortHeader: BehaviorShortHeader) =>
  behaviorShortHeader.type;

export const BehaviorStore = ({
  i18n,
  isInstalling,
  project,
  objectType,
  objectBehaviorsTypes,
  isChildObject,
  installedBehaviorMetadataList,
  deprecatedBehaviorMetadataList,
  onInstall,
  onChoose,
  shouldCheckCapabilityBehaviors,
}: Props): React.Node => {
  const preferences = React.useContext(PreferencesContext);
  const [
    selectedBehaviorShortHeader,
    setSelectedBehaviorShortHeader,
  ] = React.useState<?BehaviorShortHeader>(null);
  const {
    searchResults,
    error,
    fetchBehaviors,
    searchText,
    setSearchText,
    allCategories,
    chosenCategory,
    setChosenCategory,
    setInstalledBehaviorMetadataList,
  } = React.useContext(BehaviorStoreContext);

  const [showDeprecated, setShowDeprecated] = React.useState(false);

  React.useEffect(
    () => {
      setInstalledBehaviorMetadataList(
        showDeprecated
          ? [
              ...installedBehaviorMetadataList,
              ...deprecatedBehaviorMetadataList,
            ]
          : installedBehaviorMetadataList
      );
    },
    [
      deprecatedBehaviorMetadataList,
      installedBehaviorMetadataList,
      setInstalledBehaviorMetadataList,
      showDeprecated,
    ]
  );

  React.useEffect(
    () => {
      fetchBehaviors();
    },
    [fetchBehaviors]
  );

  const filteredSearchResults = searchResults ? searchResults : null;
  // c3: a header for a tile whose (bundled) extension is not installed yet.
  const getBundledBehaviorHeader = (tile: C3Behavior): ?BehaviorShortHeader => {
    const extensionName = tile.bundledExtension;
    const serializedExtension = extensionName && C3_EXTENSIONS[extensionName];
    if (!extensionName || !serializedExtension) return null;
    const behavior = serializedExtension.eventsBasedBehaviors.find(
      behavior => tile.type === extensionName + '::' + behavior.name
    );
    if (!behavior) return null;
    return (({
      tier: 'reviewed',
      name: behavior.name,
      fullName: behavior.fullName,
      description: behavior.description,
      extensionName,
      version: serializedExtension.version,
      gdevelopVersion: '',
      previewIconUrl: serializedExtension.previewIconUrl,
      category: serializedExtension.category,
      url: 'bundled',
      headerUrl: '',
      tags: [],
      authors: [],
      objectType: behavior.objectType,
      allRequiredBehaviorTypes: [],
      type: tile.type,
    }: any): BehaviorShortHeader);
  };
  // c3: Construct's tiles first, then every other GDevelop behaviour in its
  // own category.
  const c3TileItems: Array<{|
    item: BehaviorShortHeader,
    tile: ?C3Behavior,
  |}> = [];
  if (filteredSearchResults) {
    const items = filteredSearchResults.map(({ item }) => item);
    C3_BEHAVIORS.forEach(tile => {
      const item =
        items.find(item => item.type === tile.type) ||
        getBundledBehaviorHeader(tile);
      if (item) c3TileItems.push({ item, tile });
    });
    items.forEach(item => {
      if (!C3_BEHAVIORS.some(tile => tile.type === item.type))
        c3TileItems.push({ item, tile: null });
    });
  }
  const useC3Grid: boolean = true; // c3: tiles like Construct's add-behaviour dialog

  const getExtensionsMatches = React.useCallback(
    (extensionShortHeader: BehaviorShortHeader): SearchMatch[] => {
      if (!searchResults) return [];
      const extensionMatches = searchResults.find(
        result => result.item.type === extensionShortHeader.type
      );
      return extensionMatches ? extensionMatches.matches : [];
    },
    [searchResults]
  );

  const { DismissableTutorialMessage } = useDismissableTutorialMessage(
    'intro-behaviors-and-functions'
  );

  const showExtensionUpdateConfirmation = useExtensionUpdateAlertDialog();

  const installAndChoose = React.useCallback(
    async (behaviorShortHeader: BehaviorShortHeader, c3TileId?: string) => {
      if (behaviorShortHeader.tier === 'installed') {
        // The extension is not in the repository.
        // It's either built-in or user made.
        // It can't be updated.
        onChoose(behaviorShortHeader.type, c3TileId);
        return;
      }
      const isExtensionAlreadyInstalled =
        behaviorShortHeader.extensionName &&
        project.hasEventsFunctionsExtensionNamed(
          behaviorShortHeader.extensionName
        );
      if (isExtensionAlreadyInstalled) {
        const installedVersion = project
          .getEventsFunctionsExtension(behaviorShortHeader.extensionName)
          .getVersion();
        if (
          !semverValid(behaviorShortHeader.version) ||
          !semverValid(installedVersion)
        ) {
          // Don't try to update the extension if we don't know which one is more recent.
          onChoose(behaviorShortHeader.type, c3TileId);
          return;
        }
        // repository version <= installed version
        if (!semverGreaterThan(behaviorShortHeader.version, installedVersion)) {
          // The extension is already up to date.
          onChoose(behaviorShortHeader.type, c3TileId);
          return;
        }
        if (
          !isCompatibleWithGDevelopVersion(
            getIDEVersion(),
            behaviorShortHeader.gdevelopVersion
          )
        ) {
          // Don't suggest to update the extension if the editor can't understand it.
          onChoose(behaviorShortHeader.type, c3TileId);
          return;
        }
        const breakingChanges = getBreakingChanges(
          installedVersion,
          behaviorShortHeader
        );
        if (breakingChanges && breakingChanges.length > 0) {
          // Don't suggest to update the extension if it would break the project.
          onChoose(behaviorShortHeader.type, c3TileId);
          return;
        }
        const shouldUpdateExtension = await showExtensionUpdateConfirmation(
          project,
          behaviorShortHeader
        );
        if (!shouldUpdateExtension) {
          onChoose(behaviorShortHeader.type, c3TileId);
          return;
        }
      }
      // Behaviors from the store that are not compatible with the editor are
      // greyed out in the list and can't be chosen by users.
      // No need to check `isCompatibleWithGDevelopVersion`.

      if (behaviorShortHeader.url) {
        sendExtensionAddedToProject(behaviorShortHeader.name);
        const wasInstalled = await onInstall(behaviorShortHeader);
        // An errorBox is already displayed by `installExtension`.
        if (wasInstalled) {
          onChoose(behaviorShortHeader.type, c3TileId);
        }
      } else {
        onChoose(behaviorShortHeader.type, c3TileId);
      }
    },
    [project, onChoose, showExtensionUpdateConfirmation, onInstall]
  );

  return (
    <React.Fragment>
      <ColumnStackLayout expand noMargin useFullHeight>
        <ColumnStackLayout noMargin>
          <ResponsiveLineStackLayout noMargin>
            <SearchBarSelectField
              value={chosenCategory}
              onChange={(e, i, value: string) => {
                setChosenCategory(value);
              }}
            >
              <SelectOption value="" label={t`All categories`} />
              {allCategories.map(category => (
                <SelectOption
                  key={category}
                  value={category}
                  label={category}
                />
              ))}
            </SearchBarSelectField>
            <Line expand noMargin>
              <Column expand noMargin>
                <SearchBar
                  id="extension-search-bar"
                  value={searchText}
                  onChange={setSearchText}
                  onRequestSearch={() => {}}
                  placeholder={t`Search behaviors`}
                  autoFocus="desktop"
                />
              </Column>
              <ElementWithMenu
                key="menu"
                element={
                  <IconButton size="small">
                    <ThreeDotsMenu />
                  </IconButton>
                }
                buildMenuTemplate={(i18n: I18nType) => [
                  {
                    label: preferences.values.showExperimentalExtensions
                      ? i18n._(t`Hide experimental behaviors`)
                      : i18n._(t`Show experimental behaviors`),
                    click: () => {
                      preferences.setShowExperimentalExtensions(
                        !preferences.values.showExperimentalExtensions
                      );
                    },
                  },
                  {
                    label: showDeprecated
                      ? i18n._(
                          t`Hide deprecated behaviors (prefer not to use anymore)`
                        )
                      : i18n._(
                          t`Show deprecated behaviors (prefer not to use anymore)`
                        ),
                    click: () => {
                      setShowDeprecated(!showDeprecated);
                    },
                  },
                ]}
              />
            </Line>
          </ResponsiveLineStackLayout>
          {DismissableTutorialMessage}
        </ColumnStackLayout>
        {useC3Grid && filteredSearchResults ? ( // c3: Construct-style tiles
          <C3TileGrid
            colorVariable="--c3-behavior-color"
            categoryOrder={C3_BEHAVIOR_CATEGORIES.map(category =>
              c3Label(category, preferences.values.language)
            )}
            onChoose={id => {
              const tile = C3_BEHAVIORS.find(tile => tile.id === id);
              const type = tile ? tile.type : id;
              const header =
                filteredSearchResults
                  .map(({ item }) => item)
                  .find(item => item.type === type) ||
                (tile ? getBundledBehaviorHeader(tile) : null);
              if (header) installAndChoose(header, tile ? tile.id : undefined);
            }}
            tiles={c3TileItems.map(({ item, tile }) => {
              const usable = isBehaviorUsable({
                objectType,
                objectBehaviorsTypes,
                isChildObject,
                shouldCheckCapabilityBehaviors,
                behaviorShortHeader: item,
                platform: project.getCurrentPlatform(),
              });
              const language = preferences.values.language;
              return {
                id: tile ? tile.id : item.type,
                name: tile ? c3Label(tile.name, language) : item.fullName,
                description: item.description,
                iconUrl: tile
                  ? c3BehaviorIcon(tile.icon)
                  : getC3BehaviorIconFilename(item.type) || item.previewIconUrl,
                category: tile
                  ? c3Label(tile.category, language)
                  : translateExtensionCategory(item.category, i18n),
                enabled:
                  !usable.alreadyAdded &&
                  usable.isObjectCompatible &&
                  usable.isEngineCompatible,
              };
            })}
          />
        ) : (
          <ListSearchResults
            disableAutoTranslate // Search results text highlighting conflicts with dom handling by browser auto-translations features. Disables auto translation to prevent crashes.
            onRetry={fetchBehaviors}
            error={error}
            searchItems={
              filteredSearchResults &&
              filteredSearchResults.map(({ item }) => item)
            }
            getSearchItemUniqueId={getBehaviorType}
            renderSearchItem={(
              behaviorShortHeader: BehaviorShortHeader,
              onHeightComputed
            ): React.Node => (
              <BehaviorListItem
                id={
                  'behavior-item-' + behaviorShortHeader.type.replace(/:/g, '-')
                }
                key={behaviorShortHeader.type}
                objectType={objectType}
                objectBehaviorsTypes={objectBehaviorsTypes}
                isChildObject={isChildObject}
                shouldCheckCapabilityBehaviors={shouldCheckCapabilityBehaviors}
                onHeightComputed={onHeightComputed}
                behaviorShortHeader={behaviorShortHeader}
                matches={getExtensionsMatches(behaviorShortHeader)}
                onChoose={() => {
                  installAndChoose(behaviorShortHeader);
                }}
                onShowDetails={() => {
                  if (behaviorShortHeader.headerUrl) {
                    setSelectedBehaviorShortHeader(behaviorShortHeader);
                  }
                }}
                platform={project.getCurrentPlatform()}
              />
            )}
          />
        )}
      </ColumnStackLayout>
      {!!selectedBehaviorShortHeader && (
        <ExtensionInstallDialog
          project={project}
          isInstalling={isInstalling}
          extensionShortHeader={selectedBehaviorShortHeader}
          onClose={() => setSelectedBehaviorShortHeader(null)}
        />
      )}
    </React.Fragment>
  );
};
