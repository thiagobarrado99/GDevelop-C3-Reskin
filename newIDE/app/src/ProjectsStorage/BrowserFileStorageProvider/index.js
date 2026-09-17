// @flow
import { t } from '@lingui/macro';
import * as React from 'react';
import Computer from '../../UI/CustomSvgIcons/Computer';
import { type StorageProvider, type FileMetadata } from '../index';
import { initializeZipJs } from '../../Utils/Zip.js';
import DownloadFileStorageProvider from '../DownloadFileStorageProvider';

// c3: on the web app, "Open" shows a file picker like Construct 3 does, instead
// of a list of cloud projects. A project is a .json, or the .zip made by
// "Download a copy" (game.json + assets, inlined as data URLs so they survive
// the next download). Projects stay in memory; saving is a download.

const openedProjects: Map<string, Object> = new Map();

const mimeTypes: { [string]: string } = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  aac: 'audio/aac',
  mp4: 'video/mp4',
  ttf: 'font/ttf',
  otf: 'font/otf',
  woff: 'font/woff',
  woff2: 'font/woff2',
  json: 'application/json',
};
const mimeOf = (filename: string): string => {
  const extension =
    filename
      .toLowerCase()
      .split('.')
      .pop() || '';
  return mimeTypes[extension] || 'application/octet-stream';
};

const pickFile = (): Promise<?File> =>
  new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.zip';
    input.onchange = () => resolve(input.files && input.files[0]);
    input.addEventListener('cancel', () => resolve(null));
    input.click();
  });

const readZip = async (file: File): Promise<Object> => {
  const zipJs = await initializeZipJs();
  const entries: Array<ZipJs$Entry> = await new Promise((resolve, reject) =>
    zipJs.createReader(
      // $FlowFixMe[invalid-constructor]
      new zipJs.BlobReader(file),
      reader => reader.getEntries(resolve),
      reject
    )
  );
  const read = (entry: ZipJs$Entry, writer: ZipJs$Writer): Promise<any> =>
    new Promise(resolve => entry.getData(writer, resolve));
  const projectEntry =
    entries.find(({ filename }) => filename === 'game.json') ||
    entries.find(
      ({ filename }) => filename.endsWith('.json') && !filename.includes('/')
    );
  if (!projectEntry) throw new Error('No game.json found in the archive.');
  // $FlowFixMe[invalid-constructor]
  const content = JSON.parse(await read(projectEntry, new zipJs.TextWriter()));
  const resources = (content.resources && content.resources.resources) || [];
  for (const resource of resources) {
    const entry = entries.find(({ filename }) => filename === resource.file);
    if (entry) {
      resource.file = await read(
        entry,
        // $FlowFixMe[invalid-constructor]
        new zipJs.Data64URIWriter(mimeOf(entry.filename))
      );
    }
  }
  return content;
};

export default ({
  internalName: 'BrowserFile',
  name: t`Local file`,
  renderIcon: props => <Computer fontSize={props.size} />,
  createOperations: options => ({
    ...DownloadFileStorageProvider.createOperations(options),
    onOpenWithPicker: async (): Promise<?FileMetadata> => {
      const file = await pickFile();
      if (!file) return null;
      const content = /\.zip$/i.test(file.name)
        ? await readZip(file)
        : JSON.parse(await file.text());
      openedProjects.set(file.name, content);
      return {
        fileIdentifier: file.name,
        name: file.name.replace(/\.(json|zip)$/i, ''),
        lastModifiedDate: file.lastModified,
      };
    },
    onOpen: async (fileMetadata: FileMetadata) => {
      const content = openedProjects.get(fileMetadata.fileIdentifier);
      if (!content) throw new Error('Use "Open" and pick the file again.');
      return { content };
    },
  }),
}: StorageProvider);
