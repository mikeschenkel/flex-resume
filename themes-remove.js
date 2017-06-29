const del = require('del');
const path = require('path');

const config = require('./config');
const argv = process.argv;

const dirPath = path.join(__dirname, config.paths.src, config.paths.themes, argv[2]);

del([dirPath]).then(paths => {
    console.log('deleted dir(s):')
    console.dir(paths);
})