import { Logger } from './logger';

export interface ExecutionOptions {
  logger?: Logger;
  collection?: string;
  schematic: string;
  schematicOptions?: object;
  directory: string;
}