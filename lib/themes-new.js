const config = require('../config');
const fs = require('fs');
const mkdirp = require('mkdirp');
const ncp = require('ncp').ncp;
const path = require('path');

const args = process.argv;

if (args.length > 2) {
    const dirPath = path.join(__dirname, config.paths.src, config.paths.themes, args[2]);

    mkdirp(dirPath, function(err) {
        if (err) throw err;
        console.log('dir(s) created');
        // var blankTheme = path.join(__dirname, config.paths.src, config.paths.themes, 'blank');
        var blankTheme = path.join(args[1], 'blank');
        ncp(blankTheme, dirPath, function (err) {
            if (err) throw err;
            console.log('created blank theme');
        })
    })
} else {
    console.error("!-- Theme name not found -- try npm run theme:new {name}")
}
