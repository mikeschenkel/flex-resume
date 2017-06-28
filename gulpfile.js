// include depenencies (a-z)

var browserSync = require('browser-sync');
var data = require('gulp-data');
var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var htmlmin = require('gulp-htmlmin');
var pdf = require('gulp-html-pdf');
var rename = require('gulp-rename');
var requireUncached = require('require-uncached');
var watch = require('gulp-watch');
var path = require('path');

// configure input, output and processors

var inputDir = './src/';
var inputData = 'resume.json';
var inputFilename = 'resume.handlebars';
var outputDir = './dist/';
var outputFilename = 'resume.pdf';
var basePath = path.join(__dirname, '/dist/');

// process input and write output to disk

gulp.task('handlebars', function () {
  return gulp.src(inputDir + inputFilename)
    .pipe(data(function() {
      return requireUncached(inputDir + inputData);
    }))
    .pipe(handlebars(null, {
      ignorePartials: true,
      batch: [inputDir + 'partials']
    }))
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      preserveLineBreaks: true
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(outputDir));
});

gulp.task('css', function () {
  return gulp.src(inputDir + 'css/main.css')
    .pipe(gulp.dest(outputDir + 'css/'))
    .pipe(browserSync.stream());
});

gulp.task('watch', ['handlebars', 'css'], function() {
  watch(inputDir + '**/(*.handlebars|*.json)', function() { gulp.start(['handlebars']); });
  watch(inputDir + '**/*.css', function() { gulp.start(['css']); });
  watch(outputDir + '*.html').on('change', browserSync.reload);
});

gulp.task('serve', ['watch'], function() {
  browserSync.init({
    server: outputDir
  });
});

gulp.task('build', ['handlebars', 'css'], function () {
  return gulp.src(outputDir + 'index.html')
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      preserveLineBreaks: true
    }))
    .pipe(gulp.dest(outputDir))
    .pipe(pdf({
      base: basePath, // Base path that's used to load files (images, css, js) when they aren't referenced using a host
      format: 'A4',
      orientation: 'portrait',
      type: 'pdf',
      border: {
        'top': '1cm',
        'right': '1cm',
        'bottom': '1cm',
        'left': '1cm'
      }
    }))
    .pipe(rename(outputFilename))
    .pipe(gulp.dest(outputDir));
});
