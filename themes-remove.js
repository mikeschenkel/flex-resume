const del = require('del');
const path = require('path');

const config = require('./config');
const args = process.argv;

const dirPath = path.join(__dirname, config.paths.src, config.paths.themes, args[2]);

del([dirPath]).then(paths => {
  console.log('deleted dir(s):')
  console.dir(paths);
});
