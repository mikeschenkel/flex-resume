const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const ncp = require('ncp').ncp;

const args = process.argv;
const config = require('./config');

const dirPath = path.join(__dirname, config.paths.src, config.paths.themes, args[2]);

mkdirp(dirPath, function(err) {
    if (err) throw err;
    console.log('dir(s) created');
    var blankTheme = path.join(__dirname, config.paths.src, config.paths.themes, 'blank');
    ncp(blankTheme, dirPath, function (err) {
        if (err) throw err;
        console.log('created blank theme');
    })
})