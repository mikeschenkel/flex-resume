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

  del([dirPath]).then(paths => {
    console.log('deleted dir(s):');
    console.dir(paths);
  });
} else {
  console.error('!-- Theme name not found -- try npm run theme:remove {name}');
}
