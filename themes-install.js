const mkdirp = require('mkdirp');
const path = require('path');

const args = process.argv;
const config = require('./config');

const dirPath = path.join(__dirname, config.paths.src, config.paths.themes, args[2]);

mkdirp(dirPath, function(err) {
    if (err) throw err;
    console.log('dir(s) created');
    // write files
})