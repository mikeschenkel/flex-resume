// include depenencies (a-z)

var browserSync = require('browser-sync');
var config = require(__dirname + '/config.json');
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

// configure input, output and processors

var inputDir = path.join(__dirname, config.inputDir);
var inputData = config.inputData;
var inputFilename = config.inputFilename;
var outputDir = path.join(__dirname, config.outputDir);
var outputFilename = config.outputFilename;
var basePath = path.join('file://', __dirname, config.outputDir);

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
  return gulp.src(inputDir + 'assets/scss/**/*.scss')
    .pipe(sass({
      includePaths: [inputDir + 'assets/scss/']
    }).on('error', sass.logError))
    .pipe(gulp.dest(outputDir + 'css/'))
    .pipe(browserSync.stream());
});

gulp.task('img', function () {
  return gulp.src(inputDir + 'assets/img/**/*(*.png|*.jpg|*.jpeg|*.gif|*.svg)')
    .pipe(gulp.dest(outputDir + 'img/'));
});

gulp.task('js', function () {
  return gulp.src(inputDir + 'assets/js/**/*.js')
    .pipe(gulp.dest(outputDir + 'js/'));
});

gulp.task('watch', ['handlebars', 'css', 'img', 'js'], function() {
  watch(inputDir + '**/(*.handlebars|*.json)', function() { gulp.start(['handlebars']); });
  watch(inputDir + 'assets/**/*.scss', function() { gulp.start(['css']); });
  watch(inputDir + 'assets/img/**/(*.png|*.jpg|*.jpeg|*.gif|*.svg)', function() { gulp.start(['img']); });
  watch(inputDir + 'assets/js/**/*.js', function() { gulp.start(['js']); });
  watch(outputDir + '*.html').on('change', browserSync.reload);
});

gulp.task('serve', ['watch'], function() {
  browserSync.init({
    server: outputDir
  });
});

gulp.task('clean', function () {
  return del(outputDir + '**/*');
});

gulp.task('build', ['handlebars', 'css', 'img', 'js'], function () {
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
