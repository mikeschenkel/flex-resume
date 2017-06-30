'use strict';

// Include depenencies (A-Z)
const browserSync = require('browser-sync');
const data = require('gulp-data');
const del = require('del');
const gulp = require('gulp');
const handlebars = require('gulp-compile-handlebars');
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
  return gulp.src(paths.inputFilename)
    .pipe(data(() => {
      return requireUncached(paths.inputData);
    }))
    .pipe(handlebars(null, config.handlebars))
    .pipe(htmlmin(config.htmlmin))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('css', () => {
  return gulp.src(paths.scssFiles)
    .pipe(sass(config.sass).on('error', sass.logError))
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
});

gulp.task('img', () => {
  return gulp.src(paths.imgFiles)
    .pipe(gulp.dest(paths.dist));
});

gulp.task('js', () => {
  return gulp.src(paths.jsFiles)
    .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', ['handlebars', 'css', 'img', 'js'], () => {
  watch(paths.templateFiles, () => { gulp.start(['handlebars']); });
  watch(paths.scssFiles, () => { gulp.start(['css']); });
  watch(paths.imgFiles, () => { gulp.start(['img']); });
  watch(paths.jsFiles, () => { gulp.start(['js']); });
  watch(paths.dist + '*.html').on('change', browserSync.reload);
});

gulp.task('serve', ['watch'], () => {
  browserSync.init(config.browserSync);
});

gulp.task('clean', () => {
  return del(paths.dist + '**/*');
});

gulp.task('build', ['handlebars', 'css', 'img', 'js'], () => {
  return gulp.src(paths.dist + 'index.html')
    .pipe(pdf(config.pdf))
    .pipe(rename(settings.outputFilename))
    .pipe(gulp.dest(paths.dist));
});
