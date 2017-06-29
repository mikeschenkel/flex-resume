// Include depenencies (A-Z)
var browserSync = require('browser-sync');
var data = require('gulp-data');
var del = require('del');
var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var htmlmin = require('gulp-htmlmin');
var path = require('path');
var pdf = require('gulp-html-pdf');
var rename = require('gulp-rename');
var requireUncached = require('require-uncached');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

// Shared configuration
var config = require('./config.js');
var paths = config.paths;
var settings = config.settings;

var inputDir = path.join(__dirname, paths.src);
var inputData = inputDir + settings.data;
var inputFilename = inputDir + settings.inputFilename;

// Process input and write output to disk
gulp.task('handlebars', function () {
  return gulp.src(inputFilename)
    .pipe(data(function() {
      return requireUncached(inputData);
    }))
    .pipe(handlebars(null, config.handlebars))
    .pipe(htmlmin(config.htmlmin))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('css', function () {
  return gulp.src(paths.scssFiles)
    .pipe(sass(config.sass).on('error', sass.logError))
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
});

gulp.task('img', function () {
  return gulp.src(paths.imgFiles)
    .pipe(gulp.dest(paths.dist));
});

gulp.task('js', function () {
  return gulp.src(paths.jsFiles)
    .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', ['handlebars', 'css', 'img', 'js'], function() {
  watch(paths.templateFiles, function() { gulp.start(['handlebars']); });
  watch(paths.scssFiles, function() { gulp.start(['css']); });
  watch(paths.imgFiles, function() { gulp.start(['img']); });
  watch(paths.jsFiles, function() { gulp.start(['js']); });
  watch(paths.dist + '*.html').on('change', browserSync.reload);
});

gulp.task('serve', ['watch'], function() {
  browserSync.init({
    server: paths.dist
  });
});

gulp.task('clean', function () {
  return del(paths.dist + '**/*');
});

gulp.task('build', ['handlebars', 'css', 'img', 'js'], function () {
  return gulp.src(paths.dist + 'index.html')
    .pipe(pdf(config.pdf))
    .pipe(rename(settings.outputFilename))
    .pipe(gulp.dest(paths.dist));
});
