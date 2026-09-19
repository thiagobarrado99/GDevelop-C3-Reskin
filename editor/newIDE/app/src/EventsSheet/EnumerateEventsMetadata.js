// @flow

import flatten from 'lodash/flatten';
import { mapFor } from '../Utils/MapFor';
const gd: libGDevelop = global.gd;

export type EventMetadata = {|
  type: string,
  fullName: string,
  description: string,
|};

// c3: Construct's "Add..." order - event, comment, group, include, then loops.
const c3Order = [
  'BuiltinCommonInstructions::Standard',
  'BuiltinCommonInstructions::Comment',
  'BuiltinCommonInstructions::Group',
  'BuiltinCommonInstructions::Link',
];
const c3Rank = (type: string) => {
  const index = c3Order.indexOf(type);
  return index === -1 ? c3Order.length : index;
};

export const enumerateEventsMetadata = (): Array<EventMetadata> => {
  const allExtensions = gd
    .asPlatform(gd.JsPlatform.get())
    .getAllPlatformExtensions();

  return flatten(
    mapFor(0, allExtensions.size(), i => {
      const extension = allExtensions.at(i);
      const extensionEvents = extension.getAllEvents();

      // c3: event-based only, no JavaScript code events.
      return extensionEvents
        .keys()
        .toJSArray()
        .filter(type => type !== 'BuiltinAsync::Async')
        .filter(type => type !== 'BuiltinCommonInstructions::JsCode')
        .map(type => {
          const metadata = extensionEvents.get(type);
          return {
            type,
            fullName: metadata.getFullName(),
            description: metadata.getDescription(),
          };
        });
    })
  ).sort((a, b) => c3Rank(a.type) - c3Rank(b.type)); // c3
};
