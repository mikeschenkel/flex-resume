'use strict';

const browserSync = require('browser-sync');
const data = require('gulp-data');
const del = require('del');
const gulp = require('gulp');
const handlebars = require('gulp-hb');
const htmlmin = require('gulp-htmlmin');
const pdf = require('gulp-html-pdf');
const rename = require('gulp-rename');
const requireUncached = require('require-uncached');
const sass = require('gulp-sass');

const config = require('./config.js');
const paths = config.paths;
const settings = config.settings;

function zeroFill(i) {
  return (i < 10 ? '0' : '') + i;
}

function dateTimeStamp() {
  const currentDate = new Date();
  const day = zeroFill(currentDate.getDate());
  const month = zeroFill(currentDate.getMonth() + 1);
  const year = currentDate.getFullYear();
  const hours = zeroFill(currentDate.getHours());
  const minutes = zeroFill(currentDate.getMinutes());

  return `-${year}-${month}-${day}_${hours}${minutes}`;
}

function buildHandlebars() {
  return gulp.src(paths.inputFile)
    .pipe(data(() => {
      return requireUncached(paths.inputData);
    }))
    .pipe(handlebars(config.handlebars))
    .pipe(htmlmin(config.htmlmin))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(paths.dist));
}
exports.buildHandlebars = buildHandlebars;

function moveAssets() {
  return gulp.src(paths.assetFiles)
    .pipe(gulp.dest(paths.dist));
}
exports.moveAssets = moveAssets;

function buildStyles() {
  return gulp.src(paths.scssFiles)
    .pipe(sass(config.sass).on('error', sass.logError))
    .pipe(gulp.dest(paths.dist + paths.css))
    .pipe(browserSync.stream());
}
exports.buildStyles = buildStyles;

function watch() {
  gulp.watch(paths.templateFiles, buildHandlebars);
  gulp.watch(paths.assetFiles, moveAssets);
  gulp.watch(paths.scssFiles, buildStyles);
  gulp.watch(paths.dist + '*.html').on('all', browserSync.reload);
}
exports.watch = watch;

function serve() {
  browserSync.init(config.browserSync);
}
exports.serve = serve;

function clean() {
  return del(paths.dist);
}
exports.clean = clean;

function buildPDF() {
  return gulp.src(paths.dist + 'index.html')
    .pipe(pdf(config.pdf))
    .pipe(rename({
      basename: settings.outputFilename + dateTimeStamp(),
      extname: '.pdf'
    }))
    .pipe(gulp.dest(settings.outputDestination));
}
exports.buildPDF = buildPDF;

const build = gulp.series(clean, gulp.parallel(buildHandlebars, buildStyles, moveAssets));
const dev = gulp.series(build, gulp.parallel(serve, watch));

gulp.task('dev', dev);
gulp.task('build', build);
