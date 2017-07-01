'use strict';

// Include depenencies (A-Z)
const exec = require('child_process').exec;
const path = require('path');
const http =  require('http');
const url = require('url');

const config = require('../config');
const githubLink = process.argv[2];


if (process.argv.length > 2) {
  // verify if the argument is a github link
  if (githubLink.indexOf('github.com') < 0)
    return console.error('Error: The passed argument is not a github link');

  // verify if the link excist
  urlCheck(githubLink, excist => {
    if(!excist) return console.error('Error: the passed link does not excist');

    const dirName = githubLink.substring(
      githubLink.lastIndexOf('/')+1, githubLink.indexOf('.git')
    );
    const endPath = path.resolve(config.paths.src, config.paths.themes);

    // git clone the theme from the github link
    execProcess(`git clone ${githubLink} ${path.join(endPath, dirName)}`, (err, response) => {
      if (err) throw err;
      console.log(response);
    })
  });
} else {
  console.error('Error: No github link was specified.');
  console.log('Try: `npm run theme:instal {github-link}`');
}

function urlCheck(URL, callback) {
  const options = {
    method: 'HEAD',
    host: url.parse(URL).host,
    path: url.parse(URL).path
  }

  const req = http.request(options, (res) => {
    callback(res.statusCode > 200 && res.statusCode < 400);
  });
  req.end();
}

function execProcess(command, callback) {
  const child = exec(command, (err, stdout, stderr) => {
    if (err)
      return callback(new Error(err), null);
    else if (typeof stderr != "string")
      return callback(new Error(stderr), null);

    return callback(null, stdout);
  })
}

