'use strict';

// Include depenencies (A-Z)
const mkdirp = require('mkdirp');
const ncp = require('ncp').ncp;
const path = require('path');

// Shared configuration
const config = require('../config');
const args = process.argv;

// Process input and write output to disk
if (args.length > 2) {
  const dirPath = path.resolve(config.paths.src, config.paths.themes, args[2]);

  mkdirp(dirPath, (err) => {
    if (err) throw err;
    console.log('dir(s) created at: ' + dirPath);
    const blankTheme = path.join(__dirname, 'themes/blank');
    ncp(blankTheme, dirPath, (err) => {
      if (err) throw err;
      console.log('created blank theme at:' + dirPath);
    });
  });
} else {
  console.error('!-- Theme name not found -- try npm run theme:new {name}');
}
