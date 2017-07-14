'use strict';

// Include depenencies (A-Z)
const chalk = require('chalk');
const del = require('del');
const exec = require('child_process').exec;
const fs = require('fs');
const http = require('http');
const path = require('path');
const readline = require('readline');
const url = require('url');

// Shared configuration
const config = require('../config.js');
const repoLink = process.argv[2];

if (process.argv.length > 2) {
  // Verify if the passed argument is a Git repository.
  if (repoLink.indexOf('.git') < 0)
    return console.error(chalk`{red ERROR} No .git extension found. The passed argument is not a Git repository`);

  const repoName = repoLink.substr(repoLink.lastIndexOf('/')+1);
  const themeName = repoName.substr(0, repoName.indexOf('-'));

  if (repoName.substr(themeName.length) !== '-resume-theme.git') {
    console.error(chalk`{red ERROR} Repository doesn't fit the naming convention`);
    return console.log(chalk`{yellow HINT} {green Repository must be called} {blue <theme-name>-resume-theme.git}`);
  }

  // Verify if the link exists
  urlCheck(repoLink, exist => {
    if (!exist) return console.error(chalk`{red ERROR} Repository URL doesn't exist.`);

    const endPath = path.join(path.resolve(config.paths.src, config.paths.themes), themeName);

    // Check if a dir with the name of {themeName} already exists
    dirCheck(endPath, (err, exist) => {
      if (err) throw err;
      if (exist) {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        console.log(chalk`{yellow WARNING} Theme {cyan ${themeName}} already exists`);
        prompt(rl, '['+chalk.green('?')+'] Do you want to overwrite it? (y/n) ', (err, replace) => {
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
  console.error(chalk`{red ERROR} No Git repository URL was specified`);
  console.log(chalk`{yellow HINT} {green Try} {cyan npm run theme:install <repository-url>}`);
}

// Verify if the URL exists on the web
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

// Prompt the user
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

// Install theme
function installTheme(endPath) {
  console.log(chalk`Preparing to install {cyan ${repoLink}}`);
  execProcess(`git clone ${repoLink} ${endPath}`, err => {
    if (err) return console.error(chalk`{red ERROR} Failed to start child process`);

    // Check if cloned stuff is a supported theme, if not: remove it
    isSupported(endPath, (err, supported) => {
      if (err) throw err;
      if (!supported) {
        // Not supported, so remove dir
        del([endPath]).then(console.log(chalk`{red ERROR} Unsupported theme - Theme has been removed`));
      } else {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        // Find the package.json file in the themes directory and npm install modules
        // in the root node_modules directory
        console.log('\n' + chalk`Installing node modules in {cyan ${endPath}}`);
        findFilesInDir(endPath, ['package.json'], (err, files) => {
          if (err) throw err;

          if (files.length > 0) {
            const rootDir = path.resolve(__dirname, '../');
            // cd to endPath and install modules in the root node_modules dir, the cd back to root dir
            execProcess(`cd ${endPath} && npm i && cd ${rootDir}`, (err) => {
              if (err) return console.error(chalk`{red ERROR} Failed to npm install in ${endPath}`, err);

              prompt(rl, '\n['+chalk.green('?')+'] Do you want to set this theme as your current theme? (y/n) ', (err, set) => {
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
                        console.log(chalk`{red Touched:} {underline ${path.resolve('config.js')}}`);
                      });
                    });
                  });
                }
                rl.close();
                console.log('\n' + chalk.green('SUCCESS!') + '\n');
                console.log(chalk`{red Touched:} {underline ${endPath}}`);
              });
            });
          }
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
  findFilesInDir(filepath, ['assets', 'partials', 'resume.handlebars', 'package.json'], (err, files) => {
    if (err) return callback(err, null);
    if (files.length < 3)
      return callback(null, false);
    return callback(null, true);
  });
}

function findFilesInDir(dirpath, filesToFind, callback) {
  fs.readdir(dirpath, (err, files) => {
    if (err) return callback(err, null);
    files = files.filter(value => filesToFind.indexOf(value) > -1);
    return callback(null, files);
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
