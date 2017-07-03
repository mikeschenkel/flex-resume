'use strict';

// Include depenencies (A-Z)
const del = require('del');
const exec = require('child_process').exec;
const fs = require('fs');
const http =  require('http');
const path = require('path');
const readline = require('readline');
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

    // Check if a dir with the name of {themName} already exists
    dirCheck(endPath, (err, exist) => {
      if (err) throw err;
      if (exist) {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        prompt(rl, 'Do you want to replace the directory? y/n ', (err, replace) => {
          if (err) {
            console.error(err.message);
            return rl.close();
          }
          if (!replace) {
            return rl.close();
          }
          del([endPath]).then(() => {
            installTheme(endPath);
          });
          rl.close();
        });
      } else {
        installTheme(endPath);
      }
    });
  });
} else {
  console.error('Error: No github link was specified.');
  console.log('Try: `npm run theme:instal {github-link}`');
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

// Check if the dir at {dirPath} exists.
function dirCheck(dirPath, callback) {
  fs.access(dirPath, err => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Dir does not exist
        return callback(null, false);
      }
      return callback(err);
    } else {
      // Dir exists
      return callback(null, true);
    }
  });
}

// Prompting the user
function prompt(rl, text, callback) {
  rl.question(text, (answer) => {
    if (answer === 'y' || answer === 'yes') {
      return callback(null, true);
    } else if (answer === 'n' || answer === 'no') {
      return callback(null, false);
    }
    return callback({ message: 'Error: Input is not valid' });
  });
}

// Install the theme from github by git cloning.
function installTheme(endPath) {
  execProcess(`git clone ${githubLink} ${endPath}`, err => {
    if (err) return console.error('Error: Failed to start child process');

    // Check if cloned stuff is a supported theme, if not: remove it
    isSupported(endPath, (err, supported) => {
      if (err) throw err;
      if (!supported) {
        // Not supported, so remove dir
        del([endPath]).then(console.log('Error: Unsupported theme - Theme has been removed.'));
      } else {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        prompt(rl, '\nDo you want to set this theme as used theme in the config.js file? y/n ', (err, set) => {
          if (err) {
            console.error(err.message);
            return rl.close();
          }
          if (set) {
            // Get the theme name from new theme package.json file and set it in config.json
            getThemeName(endPath, (name) => {
              fs.readFile(path.resolve('config.js'), 'utf-8', (err, data) => {
                if (err) throw err;
                const newData = data.replace(/theme: '.*?'/, `theme: '${name}'`);

                fs.writeFile(path.resolve('config.js'), newData, 'utf-8', err => {
                  if (err) throw err;
                });
              });
            });
          }
          rl.close();
        });

      }
    });
  });
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

// Get the theme name from the local package.json file
function getThemeName(dirPath, next) {
  fs.readFile(path.resolve(dirPath, 'package.json'), (err, data) => {
    if (err) throw err;
    const name = JSON.parse(data).name;
    next(name);
  });
}

