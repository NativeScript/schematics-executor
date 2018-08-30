import 'symbol-observable';

import { NodeWorkflow } from '@angular-devkit/schematics/tools';
import { NodeJsSyncHost } from '@angular-devkit/core/node';
import { virtualFs, normalize } from '@angular-devkit/core';
import { UnsuccessfulWorkflowExecution } from '@angular-devkit/schematics';

interface Logger {
  info(str?: any, ...args: any[]): void;
  warn(str?: any, ...args: any[]): void;
  error(str?: any, ...args: any[]): void;
}

interface ExecutionOptions {
  logger?: Logger;
  collection?: string;
  schematic: string;
  schematicOptions?: object;
  directory: string;
}

export function run(executionOptions: ExecutionOptions) {
  return new Promise(function(resolve, reject) {
    const {
      logger = console,
      collection = '@nativescript/schematics',
      schematic,
      schematicOptions = {},
      directory,
    } = executionOptions;
    const fsHost = new virtualFs.ScopedHost(new NodeJsSyncHost(), normalize(directory));
    const workflow = new NodeWorkflow(fsHost, {});

    let loggingQueue: string[] = [];
    workflow.lifeCycle.subscribe(event => {
      if (event.kind === 'workflow-end' || event.kind === 'post-tasks-start') {
        loggingQueue.forEach(message => logger.info(message));
        loggingQueue = [];
      }
    });

    workflow.execute({
      collection,
      schematic,
      options: schematicOptions,
    })
    .subscribe({
      error(err: Error) {
        if (err instanceof UnsuccessfulWorkflowExecution) {
          logger.error('The Schematic workflow failed. See above.');
        } else {
          logger.error(err.stack || err.message);
        }

        return reject();
      },
      complete() {
        return resolve();
      }
    });
  });
}
