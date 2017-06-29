const del = require('del');
const config = require('../config');
const path = require('path');

const args = process.argv;

if (args.length > 2) {
    const dirPath = path.join(__dirname, config.paths.src, config.paths.themes, args[2]);

    del([dirPath]).then(paths => {
        console.log('deleted dir(s):')
        console.dir(paths);
    })
} else {
    console.error("!-- Theme name not found -- try npm run theme:remove {name}")
}
