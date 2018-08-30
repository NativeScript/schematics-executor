import 'symbol-observable';

import { NodeWorkflow } from '@angular-devkit/schematics/tools';
import { NodeJsSyncHost } from '@angular-devkit/core/node';
import { virtualFs, normalize, tags, terminal } from '@angular-devkit/core';
import { UnsuccessfulWorkflowExecution, DryRunEvent } from '@angular-devkit/schematics';

import { ExecutionOptions } from './execution-options';
import { getProjectName } from './utils/ng';

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

    workflow.registry.addSmartDefaultProvider(
      'projectName',
      (_) => getProjectName(directory),
    );

    let loggingQueue: string[] = [];
    let nothingDone = true;
    let error = false;

    workflow.reporter.subscribe((event: DryRunEvent) => {
      nothingDone = false;

      switch (event.kind) {
        case 'error':
          error = true;
          const desc = event.description == 'alreadyExist' ? 'already exists' : 'does not exist.';
          logger.warn(`ERROR! ${event} ${desc}.`);
          break;
        case 'update':
          loggingQueue.push(tags.oneLine`
            ${terminal.white('UPDATE')} ${event} (${event.content.length} bytes)
          `);
          break;
        case 'create':
          loggingQueue.push(tags.oneLine`
            ${terminal.green('CREATE')} ${event} (${event.content.length} bytes)
          `);
          break;
        case 'delete':
          loggingQueue.push(`${terminal.yellow('DELETE')} ${event}`);
          break;
        case 'rename':
          loggingQueue.push(`${terminal.blue('RENAME')} ${event} => ${event.to}`);
          break;
      }
    });

    workflow.lifeCycle.subscribe(event => {
      if (event.kind === 'workflow-end' || event.kind === 'post-tasks-start') {
        if (!error) {
          loggingQueue.forEach(message => logger.info(message));
        }

        loggingQueue = [];
        error = false;
      }
    });

    workflow.execute({
      collection,
      schematic,
      options: schematicOptions,
    })
    .subscribe({
      error(schematicError: Error) {
        const message = schematicError instanceof UnsuccessfulWorkflowExecution ?
        'The Schematic workflow failed. See above.' :
        schematicError.stack || schematicError.message;

        return reject({ message });
      },
      complete() {
        if (nothingDone) {
          logger.info('Nothing to be done.');
        }

        return resolve();
      }
    });
  });
}
