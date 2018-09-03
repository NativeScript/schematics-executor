import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

import * as rimraf from 'rimraf';

import { run } from '../src';

const testDir = join(__dirname, 'generated');
process.chdir(__dirname);

beforeAll(() => {
  rimraf.sync(testDir);
});

afterAll(() => {
  rimraf.sync(testDir);
});

describe('New web application and ng-add workflow', async () => {
  const project = 'foo';
  const component = 'bar';
  const projectPath = join(testDir, 'projects', project); 
  const componentPath = join(projectPath, 'src', 'app', component);

  test('creates files', async () => {
    // Create new Angular workspace
    await run({
      collection: '@schematics/angular',
      schematic: 'workspace',
      schematicOptions: {
        name: 'workspace',
        version: '6.0.0',
        newProjectRoot: 'projects'
      },
      directory: testDir,
    });

    const files = readdirSync(testDir);

    expect(files.length).toEqual(7);
    expect(existsSync(join(testDir, 'angular.json'))).toBeTruthy();
    expect(existsSync(join(testDir, '.gitignore'))).toBeTruthy();
  });

  test('creates directories', async () => {
    // Create new web app inside the workspace
    await run({
      collection: '@schematics/angular',
      schematic: 'application',
      schematicOptions: {
        name: project,
      },
      directory: testDir,
    });

    expect(existsSync(projectPath)).toBeTruthy();

    // Create new web component
    await run({
      collection: '@schematics/angular',
      schematic: 'component',
      schematicOptions: {
        name: component,
      },
      directory: testDir,
    });

    expect(existsSync(componentPath)).toBeTruthy();
  });

  test('edits files', async () => {
    // Add {N} app to the existing web app
    await run({
      schematic: 'add-ns',
      directory: testDir,
    })
  });

  test('renames files', async () => {
    // Migrate the web component to a shared component
    await run({
      schematic: 'migrate-component',
      schematicOptions: {
        name: component
      },
      directory: testDir,
    });

    expect(existsSync(join(componentPath, `${component}.tns.html`)));
  });

  test('schematic error', () => {
    // Try to create a component that already exists
    expect(run({
      schematic: 'component',
      schematicOptions: {
        name: component
      },
      directory: testDir,
    })).rejects.toBeInstanceOf(Error);
  });
});
