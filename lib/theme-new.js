const config = require('../config');
const fs = require('fs');
const mkdirp = require('mkdirp');
const ncp = require('ncp').ncp;
const path = require('path');

const args = process.argv;

if (args.length > 2) {
    const dirPath = path.resolve(config.paths.src, config.paths.themes, args[2]);

    mkdirp(dirPath, function(err) {
        if (err) throw err;
        console.log('dir(s) created at: ' + dirPath);
        var blankTheme = path.join(__dirname, 'blank');
        console.log(blankTheme);
        ncp(blankTheme, dirPath, function (err) {
            if (err) throw err;
            console.log('created blank theme at:' + dirPath);
        })
    })
} else {
    console.error("!-- Theme name not found -- try npm run theme:new {name}")
}
