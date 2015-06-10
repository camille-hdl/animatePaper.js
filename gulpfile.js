var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');
var less = require('gulp-less');
var babel = require('gulp-babel');
var addsrc = require('gulp-add-src');
var notify = require('gulp-notify');
var path = require('path');

var finalJsName = "app.min.js";
var finalJsDevName = "app.js";
var finalCssName = "styles.css";
var sourceDir = "src/";
var distDir = "dist";

var lessDir = "css/";
var jsDir = "js/";

// used for uglify, order matters
var jsFiles = [
    "bower_components/paper/dist/paper-core.min.js",
    "bower_components/paper-animate/dist/animatePaper.min.js"
];
var es6Files = [
    jsDir+sourceDir+"app.js"
];




gulp.task('default', function() {
    
});
gulp.task('watch', function() {
    var watcher = gulp.watch(['./src/js/*.js'], ['uglify']);
    watcher.on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    var watcherLess = gulp.watch(lessDir+sourceDir+'**/*', ['less']);
});

gulp.task('uglify', function() {
    // create minified file
    gulp.src(es6Files)
        .pipe(babel())
        .pipe(uglify(finalJsName,{
            outSourceMap: true
        }))
        .pipe(addsrc.prepend(jsFiles))
        .pipe(gulp.dest(jsDir+distDir));
    // create non minified file
    gulp.src(es6Files)
        .pipe(babel())
        .pipe(uglify(finalJsDevName,{
            outSourceMap: false,
            compress: false,
            mangle: false,
            output: {
                beautify: true
            }
        }))
        .pipe(addsrc.prepend(jsFiles))
        .pipe(gulp.dest(jsDir+distDir));
});
    

gulp.task('less', function () {
  gulp.src(lessDir+sourceDir+'style.less')
    .pipe(less({ paths: [ path.join(__dirname, 'less', 'includes') ]
  })
  .on('error', function(err) {
    this.emit('end');
  }))
  .on("error", notify.onError(function(error) {
    return "Failed to Compile LESS: " + error.message;
  }))
  .pipe(gulp.dest(lessDir+distDir))
  .pipe(notify("LESS Compiled Successfully :)"));
});

gulp.task('build', function () {
  gulp.src(lessDir+sourceDir+'style.less')
  .pipe(gulp.dest(lessDir+distDir));
});
