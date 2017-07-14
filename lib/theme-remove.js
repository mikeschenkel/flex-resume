'use strict';

// Include depenencies (A-Z)
const chalk = require('chalk');
const del = require('del');
const path = require('path');

// Shared configuration
const config = require('../config.js');
const args = process.argv;

// Process input and write output to disk
if (args.length > 2) {
  console.log(chalk`Preparing to uninstall {cyan ${args[2]}}`);
  const dirPath = path.resolve(config.paths.src, config.paths.themes, args[2]);
  console.log(chalk`  |- Checking destination...  {green OK!}`);
  console.log(chalk`  |- Removing ${args[2]} theme...  {green OK!}`);
  console.log('\r  \'- ' + chalk.green('SUCCESS!') + '\n');
  del([dirPath]).then(
    console.log(chalk`{red Removed:} {underline ${dirPath}}`)
  );
} else {
  console.error(chalk`{red ERROR} No theme name was specified`);
  console.log(chalk`{yellow HINT} {green Try running} {cyan npm run theme:remove <theme-name>}`);
}
