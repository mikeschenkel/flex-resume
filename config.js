'use strict';

const settings = {
  theme: 'basic',
  outputFilename: 'resume.pdf'
};

const path = require('path');
const paths = {
  src: 'src/',
  dist: 'dist/',
  themes: 'themes/',
  assets: 'assets/',
  data: 'resume.json',
  inputFile: 'resume.handlebars'
};
paths.themeDir = [
  path.join(__dirname, paths.src, paths.themes, settings.theme, '/')
];
paths.srcFiles = [
  paths.themeDir + paths.assets + '**/'
];
paths.templateFiles = [
  path.join(__dirname, paths.src, paths.data),
  paths.themeDir + '**/(*.handlebars)'
];
paths.scssFiles = paths.srcFiles.map((path) => {
  return path + '*.scss';
});
paths.imgFiles = paths.srcFiles.map((path) => {
  return path + '*(*.png|*.jpg|*.jpeg|*.gif|*.svg)';
});
paths.jsFiles = paths.srcFiles.map((path) => {
  return path + '*.js';
});
paths.inputData = path.join(__dirname, paths.src, paths.data);
paths.inputFile = paths.themeDir + paths.inputFile;

const handlebarsConfig = {
  ignorePartials: true,
  batch: [paths.themeDir + 'partials']
};

const sassConfig = {
  includePaths: [paths.assets + 'css/']
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
  settings: settings
};
