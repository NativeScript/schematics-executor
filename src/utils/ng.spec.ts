import { getProjectName } from './ng';
import * as mock from 'mock-fs';
import { join } from 'path';

afterEach(async () => {
  mock.restore();
});

test('returns the default project name when the workspace object is valid', () => {
  const expected = 'random';
  const workspace = {
    defaultProject: expected,
  };
  const ngJson = join(__dirname, 'angular.json');
  mock({ [ngJson]: toBuffer(workspace) });

  const actual = getProjectName(__dirname);
  expect(actual).toEqual(expected);
});

test('returns the default project name when the workspace object is valid and in parent directory', () => {
  const expected = 'random';
  const workspace = {
    defaultProject: expected,
  };
  const ngJson = join(__dirname, '..', 'angular.json');
  mock({ [ngJson]: toBuffer(workspace) });

  const actual = getProjectName(__dirname);
  expect(actual).toEqual(expected);
});

test('returns undefined if there is no configuration file', () => {
  mock('/', {});
  expect(getProjectName(__dirname)).toBeUndefined();
});

test('returns undefined if there is no default project specified', () => {
  const workspace = {};
  const ngJson = join(__dirname, 'angular.json');
  mock({ [ngJson]: toBuffer(workspace) });

  expect(getProjectName(__dirname)).toBeUndefined();
});

test('returns undefined if the file is corrupted', () => {
  const ngJson = join(__dirname, 'angular.json');
  mock({ [ngJson]: Buffer.from('corrupted json') });

  expect(getProjectName(__dirname)).toBeUndefined();
});

const toBuffer = (obj: Object) => Buffer.from(JSON.stringify(obj));