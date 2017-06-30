'use strict';

// Include depenencies (A-Z)
const del = require('del');
const path = require('path');

// Shared configuration
const config = require('../config');
const args = process.argv;

// Process input and write output to disk
if (args.length > 2) {
  const dirPath = path.resolve(config.paths.src, config.paths.themes, args[2]);

  del([dirPath]).then(() => {
    console.log(`Theme '${args[2]}' was removed.`);
  });
} else {
  console.error('Error: No theme name was specified.');
  console.log('Try: `npm run theme:remove {name}`');
}
