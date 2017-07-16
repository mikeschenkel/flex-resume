'use strict';

// Include depenencies (A-Z)
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
const watch = require('gulp-watch');

// Shared configuration
const config = require('./config.js');
const paths = config.paths;
const settings = config.settings;

// Process input and write output to disk
gulp.task('handlebars', () => {
  return gulp.src(paths.inputFile)
    .pipe(data(() => {
      return requireUncached(paths.inputData);
    }))
    .pipe(handlebars(config.handlebars))
    .pipe(htmlmin(config.htmlmin))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('assets', () => {
  return gulp.src(paths.assetFiles)
    .pipe(gulp.dest(paths.dist));
});

gulp.task('scss', () => {
  return gulp.src(paths.scssFiles)
    .pipe(sass(config.sass).on('error', sass.logError))
    .pipe(gulp.dest(paths.dist + paths.css))
    .pipe(browserSync.stream());
});

gulp.task('watch', ['handlebars', 'assets', 'scss'], () => {
  watch(paths.templateFiles, () => { gulp.start(['handlebars']); });
  watch(paths.assetFiles, () => { gulp.start(['assets']); });
  watch(paths.scssFiles, () => { gulp.start(['scss']); });
  watch(paths.dist + '*.html').on('change', browserSync.reload);
});

gulp.task('serve', ['watch'], () => {
  browserSync.init(config.browserSync);
});

gulp.task('clean', () => {
  return del(paths.dist);
});

gulp.task('build', ['handlebars', 'assets', 'scss'], () => {
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

    return '-'+year+'-'+month+'-'+day+'_'+hours+minutes;
  }

  return gulp.src(paths.dist + 'index.html')
    .pipe(pdf(config.pdf))
    .pipe(rename({
      basename: settings.outputFilename + dateTimeStamp(),
      extname: '.pdf'
    }))
    .pipe(gulp.dest(settings.outputDestination));
});
