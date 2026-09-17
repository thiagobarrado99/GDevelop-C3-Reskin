// @flow
import * as React from 'react';
import { Trans } from '@lingui/macro';
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
  card: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    padding: 16,
    marginBottom: 8,
    width: '100%',
    textAlign: 'left',
    boxSizing: 'border-box',
  },
  cardIcon: { flexShrink: 0, marginTop: 2 },
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
    <span>
      <div style={styles.sectionTitle}>
        <Text noMargin>{title}</Text>
      </div>
      <Text noMargin color="secondary" size="body-small">
        {description}
      </Text>
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
            <Text size="section-title" noMargin>
              {APP_NAME}
            </Text>
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
                        <Text noMargin>{header.name}</Text>
                      </div>
                      <div style={styles.clamp}>
                        <Text noMargin color="secondary" size="body-small">
                          {header.shortDescription}
                        </Text>
                      </div>
                    </div>
                  </ButtonBase>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </I18n>
  );
};

export default C3StartPage;
