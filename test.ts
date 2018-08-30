#!/usr/bin/env node

import { run } from '.';

(async function() {
    const options = {
        schematic: 'angular-json',
        schematicOptions: { name: 'random' },
        directory: process.cwd()
    }
    await run(options);
    console.log('Finished!');
})();

