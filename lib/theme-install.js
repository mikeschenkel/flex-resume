'use strict';

// Include depenencies (A-Z)
const del = require('del');
const exec = require('child_process').exec;
const fs = require('fs');
const http =  require('http');
const path = require('path');
const url = require('url');

// Shared configuration
const config = require('../config');
let githubLink = process.argv[2];

if (process.argv.length > 2) {
  // Verify if the argument is a github link and if it has the .git extension
  if (githubLink.indexOf('github.com') < 0)
    return console.error('Error: The passed argument is not a github link');
  else if (path.extname(githubLink) === '')
    githubLink = githubLink + '.git';
  else if (path.extname(githubLink) !== '.git')
    return console.error('Error: The github link has a unknown extension');

  // Verify if the link exist
  urlCheck(githubLink, exist => {
    if (!exist) return console.error('Error: the passed link does not excist');

    const themeName = githubLink.substring(
      githubLink.lastIndexOf('/')+1, githubLink.indexOf('.git')
    );
    const endPath = path.join(path.resolve(config.paths.src, config.paths.themes), themeName);

    // Git clone the theme from the github link to the correct directory
    execProcess(`git clone ${githubLink} ${endPath}`, err => {
      if (err) return console.error('Failed to start child process');
      // Check if cloned stuff is a supported theme, if not: remove it
      isSupported(endPath, (err, supported) => {
        if (err) throw err;
        if (!supported) {
          // Not supported so remove dir
          del([endPath]).then(console.log('Error: Unsupported theme - Theme has been removed.'));
          // TODO: Or don't remove it but just don't set it in the config file as main theme?
        } else {
          config.settings.theme = themeName;
        }
      });
    });
  });
} else {
  console.error('Error: No github link was specified.');
  console.log('Try: `npm run theme:instal {github-link}`');
}

// Verify if the dir at {filepath} is supported as resume theme
function isSupported(filepath, callback) {
  fs.readdir(filepath, (err, files) => {
    if (err) return callback(err, null);
    const supported = ['assets', 'partials', 'resume.handlebars'];
    if (files.filter(value => supported.indexOf(value) > -1).length < 3) {
      return callback(null, false);
    }
    return callback(null, true);
  });
}

// Verify if the URL exist on the web
function urlCheck(URL, callback) {
  const options = {
    method: 'HEAD',
    host: url.parse(URL).host,
    path: url.parse(URL).path
  };

  const req = http.request(options, (res) => {
    callback(res.statusCode > 200 && res.statusCode < 400);
  });
  req.end();
}

// Execute a child process
function execProcess(command, callback) {
  const child = exec(command);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  child.on('error', err => {
    return callback(err);
  });
  child.on('close', () => {
    return callback(null);
  });
}

