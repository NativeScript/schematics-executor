import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

import * as rimraf from 'rimraf';

import { run } from '../src';

const testDir = join(__dirname, 'workflow-generated');
process.chdir(__dirname);

beforeAll(() => {
  rimraf.sync(testDir);
});

afterAll(() => {
  rimraf.sync(testDir);
});

describe.only('New web application and ng-add workflow', async () => {
  const project = 'foo';
  const component = 'bar';
  const projectPath = join(testDir, 'projects', project); 
  const componentPath = join(projectPath, 'src', 'app', component);

  test('creates files', async () => {
    console.log('Creating new Angular workspace...');
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
    console.log('Creating web app...');
    await run({
      collection: '@schematics/angular',
      schematic: 'application',
      schematicOptions: {
        name: project,
      },
      directory: testDir,
    });

    expect(existsSync(projectPath)).toBeTruthy();

    console.log('Creating web Angular component...');
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
    console.log('Adding {N} to the web app...');
    await run({
      schematic: 'add-ns',
      schematicOptions: {
        skipInstall: true,
      },
      directory: testDir,
    })
  });

  test('renames files', async () => {
    console.log('Migrating the web component to a shared component...');
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
    console.log('Creating a component with a name that already exists...');
    expect(run({
      schematic: 'component',
      schematicOptions: {
        name: component
      },
      directory: testDir,
    })).rejects.toBeInstanceOf(Object);
  });
});
