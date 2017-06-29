const mkdirp = require('mkdirp');

const args = process.argv;

mkdirp(`src/themes/${args[2]}`, function(err) {
    if (err) return console.error(err);
    console.log('dir(s) created');
    // write files
})