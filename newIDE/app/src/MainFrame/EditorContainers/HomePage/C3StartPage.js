// @flow
import * as React from 'react';
import { Trans, t } from '@lingui/macro';
import { I18n } from '@lingui/react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Text from '../../../UI/Text';
import Window from '../../../Utils/Window';
import { getHelpLink } from '../../../Utils/HelpLink';
import GDevelopThemeContext from '../../../UI/Theme/GDevelopThemeContext';
import { ExampleStoreContext } from '../../../AssetStore/ExampleStore/ExampleStoreContext';
import { isStartingPointExampleShortHeader } from '../../../ProjectCreation/EmptyAndStartingPointProjects';
import { type ExampleShortHeader } from '../../../Utils/GDevelopServices/Example';
import { type FileMetadataAndStorageProviderName } from '../../../ProjectsStorage';
import { useProjectsListFor } from './CreateSection/utils';
import ContextMenu, {
  type ContextMenuInterface,
} from '../../../UI/Menu/ContextMenu';
import PreferencesContext from '../../Preferences/PreferencesContext';
import Book from '../../../UI/CustomSvgIcons/Book';
import School from '../../../UI/CustomSvgIcons/School';
import Lightbulb from '../../../UI/CustomSvgIcons/Lightbulb';
import Forum from '../../../UI/CustomSvgIcons/Forum';
import Discord from '../../../UI/CustomSvgIcons/Discord';
import Play from '../../../UI/CustomSvgIcons/Play';
import Controller from '../../../UI/CustomSvgIcons/Controller';
import Star from '../../../UI/CustomSvgIcons/Star';
import Web from '../../../UI/CustomSvgIcons/Web';
import './C3StartPage.css';
import { APP_NAME } from '../../../Utils/C3Brand';
import { getC3Language } from '../../../Utils/C3Language';

// Construct-style pt-BR names for GDevelop's starting-point examples (by slug).
const C3_EXAMPLE_NAMES: { [string]: string } = {
  'starting-platformer': 'Plataforma',
  'starting-top-down': 'Visão de cima',
  'starting-physics': 'Física',
  'starting-3D-platformer': 'Plataforma 3D',
  'starting-first-person': 'Primeira pessoa 3D',
  'starting-3d-driving': 'Direção 3D',
  'starting-point-and-click': 'Apontar e clicar',
};

// c3: start page laid out like Construct 3 - logo + NEW/OPEN on top, RECENT
// PROJECTS on the left, LEARN / PARTICIPATE / EXPLORE card columns on the
// right and RECOMMENDED EXAMPLES at the bottom.

const styles = {
  root: { flex: 1, minHeight: '100%' },
  page: {
    display: 'grid',
    gridTemplateColumns: 'minmax(260px, 1fr) 2fr',
    gap: 24,
    padding: '16px 32px 32px',
    maxWidth: 1500,
    width: '100%',
    boxSizing: 'border-box',
    margin: '0 auto',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 16 },
  logo: { width: 64, height: 64 },
  bigButtons: { display: 'flex', gap: 8 },
  bigButton: {
    flex: 1,
    height: 44,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#fff',
  },
  columns: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24,
  },
  sectionTitle: { textTransform: 'uppercase', letterSpacing: 1 },
  // Same size for every card whatever the description length.
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // ButtonBase centres its content.
    gap: 16,
    padding: '0 16px',
    marginBottom: 8,
    width: '100%',
    height: 84,
    textAlign: 'left',
    boxSizing: 'border-box',
  },
  cardIcon: { flexShrink: 0, display: 'flex' },
  cardText: { flex: 1, minWidth: 0 },
  cardDescription: {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    height: 32, // Always two lines high, so the title sits at the same place.
  },
  recent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 16,
    padding: '12px 16px',
    marginBottom: 8,
    width: '100%',
    boxSizing: 'border-box',
    textAlign: 'left',
  },
  examples: {
    gridColumn: '2',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24,
  },
  example: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    textAlign: 'left',
    padding: 0,
  },
  thumbnail: { width: '100%', aspectRatio: '16 / 9', objectFit: 'cover' },
  clamp: {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
};

const baseName = (path: string) => path.split(/[/\\]/).pop();

const SectionTitle = ({ children }: {| children: React.Node |}) => (
  <div style={styles.sectionTitle}>
    <Text size="body-small" color="secondary">
      {children}
    </Text>
  </div>
);

const Section = ({
  title,
  children,
}: {|
  title: React.Node,
  children: React.Node,
|}) => (
  <div>
    <SectionTitle>{title}</SectionTitle>
    {children}
  </div>
);

const Card = ({
  icon,
  title,
  description,
  onClick,
  background,
}: {|
  icon: React.Node,
  title: React.Node,
  description: React.Node,
  onClick: () => void,
  background: string,
|}) => (
  <ButtonBase onClick={onClick} style={{ ...styles.card, background }}>
    <span style={styles.cardIcon}>{icon}</span>
    <span style={styles.cardText}>
      <div style={styles.sectionTitle}>
        <Text noMargin>{title}</Text>
      </div>
      <div style={styles.cardDescription}>
        <Text noMargin color="secondary" size="body-small">
          {description}
        </Text>
      </div>
    </span>
  </ButtonBase>
);

type Props = {|
  canOpen: boolean,
  onOpenNewProjectSetupDialog: (options?: {|
    browseExamples?: boolean,
  |}) => void,
  onChooseProject: () => void,
  onOpenRecentFile: (file: FileMetadataAndStorageProviderName) => Promise<void>,
  onSelectExampleShortHeader: ExampleShortHeader => void,
|};

const C3StartPage = ({
  canOpen,
  onOpenNewProjectSetupDialog,
  onChooseProject,
  onOpenRecentFile,
  onSelectExampleShortHeader,
}: Props): React.Node => {
  const gdevelopTheme = React.useContext(GDevelopThemeContext);
  const { exampleShortHeaders, fetchExamplesAndFilters } = React.useContext(
    ExampleStoreContext
  );
  const recentFiles = useProjectsListFor(null).slice(0, 8);
  const { removeRecentProjectFile } = React.useContext(PreferencesContext);
  const recentMenu = React.useRef<?ContextMenuInterface>(null);
  const cardBackground = gdevelopTheme.paper.backgroundColor.medium;
  const iconColor = gdevelopTheme.palette.secondary;

  React.useEffect(
    () => {
      if (!exampleShortHeaders) fetchExamplesAndFilters();
    },
    [exampleShortHeaders, fetchExamplesAndFilters]
  );
  const recommended = (exampleShortHeaders || [])
    .filter(
      header =>
        isStartingPointExampleShortHeader(header) &&
        !!header.previewImageUrls[0]
    )
    .slice(0, 3);

  const open = (url: string) => () => Window.openExternalURL(url);
  // c3: the examples API is English-only - pt-BR names for the starting
  // points, no description (it is long and English).
  const isPtBr = getC3Language() === 'pt_BR';
  const exampleName = (header: ExampleShortHeader) =>
    isPtBr ? C3_EXAMPLE_NAMES[header.slug] || header.name : header.name;
  const icon = (Icon: any) => <Icon style={{ color: iconColor }} />;

  return (
    <I18n>
      {({ i18n }) => (
        <div
          className="c3-start-page"
          style={{
            ...styles.root,
            background: gdevelopTheme.palette.canvasColor,
          }}
        >
          <div style={styles.page}>
            <div style={styles.brand}>
              <img src="res/assemble3-icon.png" alt="" style={styles.logo} />
              <Text size="bold-title" noMargin>
                {APP_NAME}
              </Text>
            </div>
            <div style={styles.bigButtons}>
              <ButtonBase
                id="c3-new-project"
                onClick={() => onOpenNewProjectSetupDialog()}
                style={{ ...styles.bigButton, background: cardBackground }}
              >
                <Trans>New</Trans>
              </ButtonBase>
              <ButtonBase
                id="c3-open-project"
                onClick={onChooseProject}
                disabled={!canOpen}
                style={{ ...styles.bigButton, background: cardBackground }}
              >
                <Trans>Open</Trans>
              </ButtonBase>
            </div>

            <Section title={<Trans>Recent projects</Trans>}>
              {recentFiles.length === 0 && (
                <Text color="secondary" size="body-small">
                  <Trans>No recent projects.</Trans>
                </Text>
              )}
              {recentFiles.map(file => (
                <ButtonBase
                  key={
                    file.storageProviderName + file.fileMetadata.fileIdentifier
                  }
                  onClick={() => onOpenRecentFile(file)}
                  onContextMenu={e => {
                    e.preventDefault();
                    if (recentMenu.current)
                      recentMenu.current.open(e.clientX, e.clientY, { file });
                  }}
                  style={{ ...styles.recent, background: cardBackground }}
                >
                  <Text noMargin>
                    {file.fileMetadata.name ||
                      baseName(file.fileMetadata.fileIdentifier)}
                  </Text>
                  <Text noMargin color="secondary" size="body-small">
                    {file.fileMetadata.lastModifiedDate
                      ? i18n.date(
                          new Date(file.fileMetadata.lastModifiedDate),
                          {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          }
                        )
                      : ''}
                  </Text>
                </ButtonBase>
              ))}
            </Section>

            <div style={styles.columns}>
              <Section title={<Trans>Learn</Trans>}>
                <Card
                  icon={icon(School)}
                  title={<Trans>Beginner's guide</Trans>}
                  description={
                    <Trans>Learn how to create your first game!</Trans>
                  }
                  onClick={open(getHelpLink('/tutorials/getting-started'))}
                  background={cardBackground}
                />
                <Card
                  icon={icon(Book)}
                  title={<Trans>Manual</Trans>}
                  description={
                    <Trans>A comprehensive reference of all features</Trans>
                  }
                  onClick={open(getHelpLink('/'))}
                  background={cardBackground}
                />
                <Card
                  icon={icon(Lightbulb)}
                  title={<Trans>Tutorials</Trans>}
                  description={
                    <Trans>Improve your skills with helpful tutorials</Trans>
                  }
                  onClick={open(getHelpLink('/tutorials'))}
                  background={cardBackground}
                />
              </Section>
              <Section title={<Trans>Participate</Trans>}>
                <Card
                  icon={icon(Controller)}
                  title={<Trans>Games</Trans>}
                  description={<Trans>Play games made by the community</Trans>}
                  onClick={open('https://gd.games')}
                  background={cardBackground}
                />
                <Card
                  icon={icon(Discord)}
                  title={<Trans>Discord</Trans>}
                  description={<Trans>Chat with other game creators</Trans>}
                  onClick={open('https://discord.gg/gdevelop')}
                  background={cardBackground}
                />
                <Card
                  icon={icon(Forum)}
                  title={<Trans>Forum</Trans>}
                  description={
                    <Trans>The best place to get help and advice</Trans>
                  }
                  onClick={open('https://forum.gdevelop.io')}
                  background={cardBackground}
                />
              </Section>
              <Section title={<Trans>Explore</Trans>}>
                <Card
                  icon={icon(Play)}
                  title={<Trans>Examples</Trans>}
                  description={
                    <Trans>Open an example to see how it is made</Trans>
                  }
                  onClick={() =>
                    onOpenNewProjectSetupDialog({ browseExamples: true })
                  }
                  background={cardBackground}
                />
                <Card
                  icon={icon(Star)}
                  title={<Trans>What's new</Trans>}
                  description={
                    <Trans>See all the changes in the latest version</Trans>
                  }
                  onClick={open('https://github.com/4ian/GDevelop/releases')}
                  background={cardBackground}
                />
                <Card
                  icon={icon(Web)}
                  title={<Trans>Website</Trans>}
                  description={<Trans>Official GDevelop website</Trans>}
                  onClick={open('https://gdevelop.io')}
                  background={cardBackground}
                />
              </Section>
            </div>

            {recommended.length > 0 && (
              <div style={styles.examples}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <SectionTitle>
                    <Trans>Recommended examples</Trans>
                  </SectionTitle>
                </div>
                {recommended.map(header => (
                  <ButtonBase
                    key={header.id}
                    onClick={() => onSelectExampleShortHeader(header)}
                    style={{ ...styles.example, background: cardBackground }}
                  >
                    <img
                      src={header.previewImageUrls[0]}
                      alt=""
                      style={styles.thumbnail}
                    />
                    <div style={{ padding: 12 }}>
                      <div style={styles.sectionTitle}>
                        <Text noMargin>{exampleName(header)}</Text>
                      </div>
                      {!isPtBr && (
                        <div style={styles.clamp}>
                          <Text noMargin color="secondary" size="body-small">
                            {header.shortDescription}
                          </Text>
                        </div>
                      )}
                    </div>
                  </ButtonBase>
                ))}
              </div>
            )}
          </div>
          <ContextMenu
            ref={recentMenu}
            buildMenuTemplate={(i18n, { file }) => [
              {
                label: i18n._(t`Remove from list`),
                click: () => removeRecentProjectFile(file),
              },
            ]}
          />
        </div>
      )}
    </I18n>
  );
};

export default C3StartPage;
