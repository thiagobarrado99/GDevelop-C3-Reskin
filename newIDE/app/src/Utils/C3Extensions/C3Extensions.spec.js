// @flow
// c3: the bundled Assemble3 behaviours (see C3Extensions/index.js) must load
// and generate code without errors.
import {
  loadProjectEventsFunctionsExtensions,
  type EventsFunctionCodeWriter,
} from '../../EventsFunctionsExtensionsLoader';
import { makeFakeI18n } from '../../EditorFunctions/TestHelpers';
import { C3_EXTENSIONS } from './index';

const gd: libGDevelop = global.gd;

describe('C3Extensions', () => {
  Object.keys(C3_EXTENSIONS).forEach(extensionName => {
    it(`${extensionName} loads and generates valid code`, async () => {
      const project = gd.ProjectHelper.createNewGDJSProject();
      const element = gd.Serializer.fromJSObject([
        C3_EXTENSIONS[extensionName],
      ]);
      project.unserializeAndInsertExtensionsFrom(element);
      element.delete();
      expect(project.hasEventsFunctionsExtensionNamed(extensionName)).toBe(
        true
      );

      const generated: Array<string> = [];
      const writer: EventsFunctionCodeWriter = {
        getIncludeFileFor: (functionName: string) => `${functionName}.js`,
        writeFunctionCode: (functionName, code) => {
          generated.push(code);
          return Promise.resolve();
        },
        writeBehaviorCode: (behaviorName, code) => {
          generated.push(code);
          return Promise.resolve();
        },
        writeObjectCode: (objectName, code) => {
          generated.push(code);
          return Promise.resolve();
        },
      };
      // libGD prints expression and diagnostic errors to the console.
      const logged: Array<string> = [];
      const consoleLog = console.log;
      // $FlowFixMe[cannot-write]
      console.log = (...args) => logged.push(args.join(' '));
      try {
        await loadProjectEventsFunctionsExtensions(
          project,
          writer,
          makeFakeI18n()
        );
      } finally {
        // $FlowFixMe[cannot-write]
        console.log = consoleLog;
      }
      expect(
        logged.filter(line => /Error: "|Diagnostics when generating/.test(line))
      ).toEqual([]);
      const code = generated.join('\n');
      expect(code.length).toBeGreaterThan(0);
      expect(code).not.toMatch(/Unknown instruction/);
      expect(code).not.toMatch(/Error during generation/);
      // Properties and parameters must resolve (never fall back to scene variables).
      expect(code).not.toMatch(/runtimeScene\.getVariables\(\)/);
      project.delete();
    });
  });
});
