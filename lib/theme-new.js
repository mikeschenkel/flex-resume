'use strict';

// Include depenencies (A-Z)
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const ncp = require('ncp').ncp;
const path = require('path');

// Shared configuration
const config = require('../config.js');
const args = process.argv;

// Process input and write output to disk
if (args.length > 2) {
  console.log(chalk`Preparing to install {cyan ${args[2]}}`);
  const dirPath = path.resolve(config.paths.src, config.paths.themes, args[2]);

  mkdirp(dirPath, (err) => {
    if (err) throw err;
    const blankTheme = path.join(__dirname, 'themes/blank');
    ncp(blankTheme, dirPath, (err) => {
      if (err) throw err;
      console.log(chalk`  |- Creating ${args[2]} theme...  {green OK!}`);
      console.log('\r  \'- ' + chalk.green('SUCCESS!') + '\n');
      console.log(chalk`{red Touched:} {underline ${dirPath}}`);
    });
  });
} else {
  console.error(chalk`{red ERROR} No theme name was specified`);
  console.log(chalk`{yellow HINT} {green Try running} {cyan npm run theme:new <theme-name>}`);
}
