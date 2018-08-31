import { findUp } from './find-up';
import { join } from 'path';

test('finds a file in the current directory', () => 
  expect(findUp('find-up.ts', __dirname)).toBe(join(__dirname, 'find-up.ts'))
);

test('find a file in parent directory', () =>
  expect(findUp('find-up.ts', join(__dirname, 'random', 'nested', 'dir')))
    .toBe(join(__dirname, 'find-up.ts'))
);

test('find when multiple files are specified', () => {
  expect(findUp(['find-up.ts', 'find-up.json'], __dirname)).toBe(join(__dirname, 'find-up.ts'))
});

test('returns null when there is no such file', () =>
  expect(findUp('__random__.ts', __dirname))
    .toBeNull()
);

