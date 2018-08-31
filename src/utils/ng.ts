import { findUp } from './find-up';
import { readFileSync } from 'fs';

const workspaceFileNames = [
  'angular.json',
  '.angular.json',
];

export function getProjectName(executionPath: string) {
  const workspace = loadWorkspace(executionPath);
  return workspace && workspace.defaultProject;
}

function loadWorkspace(executionPath: string) {
  const workspacePath = findUp(workspaceFileNames, executionPath);

  if (!workspacePath) {
    return {};
  }

  try {
    const buffer = readFileSync(workspacePath);
    const content = buffer.toString();
    const workspace = JSON.parse(content);

    return workspace;
  } catch (_e) {
    return {};
  }
}
