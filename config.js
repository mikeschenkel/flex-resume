'use strict';

// User Settings
const userSettings = {
  theme: 'basic',
  data: 'resume.json',
  outputFilename: 'resume.pdf'
};

const path = require('path');
const paths = {
  src: 'src/',
  dist: 'dist/',
  themes: 'themes/',
  assets: 'assets/',
  css: 'css/',
  scss: 'scss/',
  inputFile: 'resume.handlebars'
};
paths.themeDir = path.join(__dirname, paths.src, paths.themes, userSettings.theme, '/');
paths.templateFiles = [
  path.join(__dirname, paths.src, userSettings.data),
  paths.themeDir + '**/(*.handlebars|*.hbs)'
];
paths.srcFiles = paths.themeDir + paths.assets;
paths.scssFiles = paths.srcFiles + paths.scss + '**/*.scss';
paths.assetFiles = [
  paths.srcFiles + '**/*',
  '!' + paths.srcFiles + paths.scss,
  '!' + paths.scssFiles
];
paths.inputData = path.join(__dirname, paths.src, userSettings.data);
paths.inputFile = paths.themeDir + paths.inputFile;

const handlebarsConfig = {
  partials: paths.themeDir + 'partials/**/*(*.handlebars|*.hbs)',
  helpers: paths.themeDir + 'helpers/**/*.js'
};

const sassConfig = {
  includePaths: [paths.assets + paths.scss]
};

const browserSyncConfig = {
  server: paths.dist
};

const htmlminConfig = {
  removeComments: true,
  collapseWhitespace: true,
  preserveLineBreaks: true
};

const basePath = path.join('file://', __dirname, paths.dist);
const pdfConfig = {
  base: basePath,
  format: 'A4',
  orientation: 'portrait',
  type: 'pdf',
  border: {
    'top': '1cm',
    'right': '1cm',
    'bottom': '1cm',
    'left': '1cm'
  }
};

module.exports = {
  browserSync: browserSyncConfig,
  htmlmin: htmlminConfig,
  pdf: pdfConfig,
  handlebars: handlebarsConfig,
  sass: sassConfig,
  paths: paths,
  settings: userSettings
};
