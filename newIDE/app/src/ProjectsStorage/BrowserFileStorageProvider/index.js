// @flow
import { t } from '@lingui/macro';
import * as React from 'react';
import Computer from '../../UI/CustomSvgIcons/Computer';
import {
  type StorageProvider,
  type FileMetadata,
  type SaveAsLocation,
} from '../index';
import { initializeZipJs } from '../../Utils/Zip.js';
import { serializeToJSObject } from '../../Utils/Serializer';
import DownloadFileStorageProvider from '../DownloadFileStorageProvider';

// c3: on the web app, projects are local files like in Construct 3. With the
// File System Access API (Chrome, Edge) "Open" and "Save as" show the system
// picker and "Save" writes back to the same file after asking permission;
// file handles are kept in IndexedDB so recent projects reopen. Elsewhere
// (Firefox, Safari) "Open" reads a picked file and "Save" downloads a copy.
// A project is a .json, or the .zip made by "Download a copy" (game.json +
// assets, inlined as data URLs so they survive the next save).

const fileSystemAccess: any = window;
const hasFileSystemAccess = !!fileSystemAccess.showSaveFilePicker;

const openedProjects: Map<string, Object> = new Map();
const handles: Map<string, any> = new Map();

const projectFileTypes = [
  {
    description: 'GDevelop project',
    accept: { 'application/json': ['.json'] },
  },
];

// File handles survive a reload when stored in IndexedDB.
const withHandleStore = (mode: string, action: (store: any) => any) =>
  new Promise((resolve, reject) => {
    const request = window.indexedDB.open('c3-browser-files', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('handles');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      try {
        const transaction = request.result.transaction('handles', mode);
        const query = action(transaction.objectStore('handles'));
        transaction.oncomplete = () => resolve(query.result);
        transaction.onerror = () => reject(transaction.error);
      } catch (error) {
        reject(error);
      }
    };
  });
const rememberHandle = (fileIdentifier: string, handle: any) => {
  handles.set(fileIdentifier, handle);
  withHandleStore('readwrite', store =>
    store.put(handle, fileIdentifier)
  ).catch(() => {});
};
const findHandle = async (fileIdentifier: string): Promise<?any> => {
  if (handles.has(fileIdentifier)) return handles.get(fileIdentifier);
  const handle = await withHandleStore('readonly', store =>
    store.get(fileIdentifier)
  ).catch(() => null);
  if (handle) handles.set(fileIdentifier, handle);
  return handle;
};
const ensurePermission = async (handle: any, mode: string) => {
  if ((await handle.queryPermission({ mode })) === 'granted') return;
  if ((await handle.requestPermission({ mode })) !== 'granted')
    throw new Error('Permission to access the file was denied.');
};

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

const pickFileWithInput = (): Promise<?File> =>
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

const readProjectFile = async (file: File): Promise<Object> =>
  /\.zip$/i.test(file.name) ? readZip(file) : JSON.parse(await file.text());

const fileMetadataOf = (file: File): FileMetadata => ({
  fileIdentifier: file.name,
  name: file.name.replace(/\.(json|zip)$/i, ''),
  lastModifiedDate: file.lastModified,
});

const writeProject = async (
  handle: any,
  project: gdProject
): Promise<FileMetadata> => {
  await ensurePermission(handle, 'readwrite');
  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(serializeToJSObject(project), null, 2));
  await writable.close();
  rememberHandle(handle.name, handle);
  return {
    fileIdentifier: handle.name,
    name: handle.name.replace(/\.json$/i, ''),
    lastModifiedDate: Date.now(),
  };
};

const pickSaveHandle = async (project: gdProject): Promise<?any> => {
  try {
    return await fileSystemAccess.showSaveFilePicker({
      suggestedName: project.getName() + '.json',
      types: projectFileTypes,
    });
  } catch (error) {
    if (error.name === 'AbortError') return null; // Cancelled.
    throw error;
  }
};

export default ({
  internalName: 'BrowserFile',
  name: t`Local file`,
  renderIcon: props => <Computer fontSize={props.size} />,
  createOperations: options => ({
    onOpenWithPicker: async (): Promise<?FileMetadata> => {
      let file: ?File = null;
      if (hasFileSystemAccess) {
        try {
          const [handle] = await fileSystemAccess.showOpenFilePicker({
            types: [
              {
                description: 'GDevelop project',
                accept: {
                  'application/json': ['.json'],
                  'application/zip': ['.zip'],
                },
              },
            ],
          });
          file = await handle.getFile();
          // Only a .json can be written back to.
          if (/\.json$/i.test(handle.name)) rememberHandle(handle.name, handle);
        } catch (error) {
          if (error.name === 'AbortError') return null; // Cancelled.
          throw error;
        }
      } else {
        file = await pickFileWithInput();
      }
      if (!file) return null;
      openedProjects.set(file.name, await readProjectFile(file));
      return fileMetadataOf(file);
    },
    onOpen: async (fileMetadata: FileMetadata) => {
      const { fileIdentifier } = fileMetadata;
      let content = openedProjects.get(fileIdentifier);
      if (!content) {
        // Reopened after a reload (recent projects): read the remembered file.
        const handle = hasFileSystemAccess
          ? await findHandle(fileIdentifier)
          : null;
        if (!handle) throw new Error('The file is not accessible anymore.');
        await ensurePermission(handle, 'read');
        content = await readProjectFile(await handle.getFile());
        openedProjects.set(fileIdentifier, content);
      }
      return { content };
    },
    getOpenErrorMessage: () => t`Use "Open" and pick the file again.`,
    getWriteErrorMessage: () =>
      t`The file could not be written. Check the permission you were asked for, or use "Save as".`,
    ...(hasFileSystemAccess
      ? {
          onChooseSaveProjectAsLocation: async ({ project }) => {
            const handle = await pickSaveHandle(project);
            if (!handle) return { saveAsLocation: null, saveAsOptions: null };
            handles.set(handle.name, handle);
            return {
              saveAsLocation: { fileIdentifier: handle.name },
              saveAsOptions: null,
            };
          },
          onSaveProjectAs: async (
            project: gdProject,
            saveAsLocation: ?SaveAsLocation,
            options
          ) => {
            const handle =
              saveAsLocation && saveAsLocation.fileIdentifier
                ? handles.get(saveAsLocation.fileIdentifier)
                : null;
            if (!handle) return { wasSaved: false, fileMetadata: null };
            options.onStartSaving();
            return {
              wasSaved: true,
              fileMetadata: await writeProject(handle, project),
            };
          },
          onSaveProject: async (
            project: gdProject,
            fileMetadata: FileMetadata
          ) => {
            // A project imported from a .zip has no file to write back to:
            // ask for one, like a first save.
            const handle =
              (await findHandle(fileMetadata.fileIdentifier)) ||
              (await pickSaveHandle(project));
            if (!handle) return { wasSaved: false, fileMetadata };
            return {
              wasSaved: true,
              fileMetadata: await writeProject(handle, project),
            };
          },
        }
      : {
          onSaveProjectAs: DownloadFileStorageProvider.createOperations(options)
            .onSaveProjectAs,
        }),
  }),
}: StorageProvider);
