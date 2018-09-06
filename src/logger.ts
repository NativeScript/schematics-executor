export interface Logger {
  info(str?: any, ...args: any[]): void;
  warn(str?: any, ...args: any[]): void;
}