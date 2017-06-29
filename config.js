var settings = {
  theme: 'blank',
  data: 'resume.json',
  inputFilename: 'resume.handlebars',
  outputFilename: 'resume.pdf'
};

var path = require('path');
var paths = {
  src: 'src/',
  dist: 'dist/',
  themes: 'themes/',
  assets: 'assets/'
};
paths.themeDir = [
  path.join(__dirname, paths.src, 'themes/', settings.theme, '/')
];
paths.srcFiles = [
  paths.themeDir + paths.assets + '**/'
];
paths.templateFiles = [
  paths.themeDir + '**/(*.handlebars|*.json)'
];
paths.scssFiles = paths.srcFiles.map(function (path) {
  return path + '*.scss';
});
paths.imgFiles = paths.srcFiles.map(function (path) {
  return path + '*(*.png|*.jpg|*.jpeg|*.gif|*.svg)';
});
paths.jsFiles = paths.srcFiles.map(function (path) {
  return path + '*.js';
});
paths.inputData = path.join(__dirname, paths.src, settings.data);
paths.inputFilename = paths.themeDir + settings.inputFilename;

var handlebarsConfig = {
  ignorePartials: true,
  batch: [paths.themeDir + 'partials']
};

var sassConfig = {
  includePaths: [paths.assets + 'css/']
};

var browserSyncConfig = {
  server: paths.dist
};

var htmlminConfig = {
  removeComments: true,
  collapseWhitespace: true,
  preserveLineBreaks: true
};

var basePath = path.join('file://', __dirname, paths.dist);
var pdfConfig = {
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
