import { run, Logger } from '../src';

import * as rimraf from 'rimraf';
import { join } from 'path';

const testDir = join(__dirname, 'logger-generated');
process.chdir(__dirname);

fdescribe('Custom logger', async () => {
  const LoggerMock = jest.fn<Logger>(() => ({
    info: jest.fn(),
    warn: jest.fn(),
  }));

  const logger = new LoggerMock();

  afterEach(() => {
    rimraf.sync(testDir);
  });

  test('info is called', async () => {
    // Run valid schematic
    await run({
      logger,
      collection: '@schematics/angular',
      schematic: 'workspace',
      schematicOptions: {
        name: 'workspace',
        version: '6.0.0',
        newProjectRoot: 'projects',
      },
      directory: testDir,
    });

    expect(logger.info).toHaveBeenCalled();
  });

  test('warn is called', async () => {
    // Run schematic that will throw an error
    await run({
      logger,
      schematic: 'angular-json',
      directory: testDir,
      schematicOptions: {
        name: 'projects'
      }
    });

    expect(run({
      logger,
      schematic: 'angular-json',
      directory: testDir,
      schematicOptions: {
        name: 'projects'
      }
    })).rejects.toBeInstanceOf(Object);

    expect(logger.warn).toHaveBeenCalled();
  });

});
