var gulp = require('gulp');
var yuidoc = require('gulp-yuidoc');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var notify = require("gulp-notify");
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var streamify = require('gulp-streamify');

var MODULE_NOM = "paper-animate";

var exports = {};
var sourceDir = "src/";
var distDir = "dist";

// used for uglify, order matters
var files = [
    "animation.js",
    "tween.js",
    "frameManager.js",
    "prophooks.js",
    "easing.js",
    "effects.js",
    "export.js"
];
files = files.map(function(file) { return sourceDir+file;});

var yuidocOptions = require('./yuidoc.json');


gulp.task('yuidoc', function() {
    gulp.src("./src/*.js")
      .pipe(yuidoc.parser(yuidocOptions))
      .pipe(yuidoc.reporter())
      .pipe(yuidoc.generator())
      .pipe(gulp.dest('./doc'));
});

gulp.task('build-' + MODULE_NOM + '-dev', function () {
  process.env.NODE_ENV = "development";
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: sourceDir + "export.js",
    debug: false
  });

  return b.bundle()
    .pipe(source('' + MODULE_NOM + '.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(distDir))
        .pipe(notify("" + MODULE_NOM + "-dev OK"));
});
gulp.task('build-' + MODULE_NOM + '', function () {
  process.env.NODE_ENV = "production";
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: sourceDir + "export.js",
    debug: true
  });

  return b.bundle()
    .pipe(source('' + MODULE_NOM + '.min.js'))
    .pipe(buffer())
        .pipe(uglify())
    .pipe(gulp.dest(distDir))
        .pipe(notify("" + MODULE_NOM + " OK"));
});
gulp.task('build-' + MODULE_NOM + '-browser', function () {
  process.env.NODE_ENV = "production";
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: sourceDir + "export-browser.js",
    debug: true
  });

  return b.bundle()
    .pipe(source('' + MODULE_NOM + '-browser.min.js'))
    .pipe(buffer())
        .pipe(uglify())
    .pipe(gulp.dest(distDir))
        .pipe(notify("" + MODULE_NOM + " OK"));
});
gulp.task('watch-' + MODULE_NOM + '', function() {   
    var watcher = gulp.watch(files, ["build-" + MODULE_NOM + "-dev"]);
});
module.exports = exports;
