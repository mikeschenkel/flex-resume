'use strict';

// Include depenencies (A-Z)
const exec = require('child_process').exec;
const path = require('path');

const config = require('../config');
const githubLink = process.argv[2];

if (process.argv.length > 2) {
  const dirName = githubLink.substr(
    githubLink.lastIndexOf('/'), githubLink.lastIndexOf('.')
  );
  const endPath = path.resolve(config.paths.src, config.paths.themes);

  console.log(dirName);
  console.log(endPath);

  // exec_process(`git clone ${githubLink}`, (err, response) => {
  //   if (err) throw err;
  //   console.log(response);
  // })
} else {
  console.error('Error: No github link was specified.');
  console.log('Try: `npm run theme:instal {github-link}`');
}

function exec_process(command, callback) {
  const child = exec(command, (err, stdout, stderr) => {
    if (err)
      return callback(new Error(err), null);
    else if (typeof stderr != "string")
      return callback(new Error(stderr), null);

    return callback(null, stdout);
  })
}
