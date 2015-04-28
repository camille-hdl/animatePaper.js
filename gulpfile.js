var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');
var less = require('gulp-less');
var babel = require('gulp-babel');
var addsrc = require('gulp-add-src');

var finalJsName = "app.min.js";
var finalJsDevName = "app.js";
var finalCssName = "styles.css";
var sourceDir = "src/";
var distDir = "public";

// used for uglify, order matters
var jsFiles = [
    "bower_components/paper/dist/paper-core.min.js"
];
var es6Files = [
    sourceDir+"js/app.js"
];
var lessFiles = [
    "vendor/normalize.min.css",
    sourceDir+"less/styles.less"
];



gulp.task('default', function() {
    
});
gulp.task('watch', function() {
    var watcher = gulp.watch(['./src/js/*.js'], ['uglify']);
    watcher.on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    var watcherLess = gulp.watch('./src/less/*.less', ['less']);
    watcherLess.on('change',function(event) {
       console.log('File ' + event.path + ' was ' + event.type + ', running tasks...'); 
   });
});

gulp.task('uglify', function() {
    // create minified file
    gulp.src(es6Files)
        .pipe(babel())
        .pipe(uglify(finalJsName,{
            outSourceMap: true
        }))
        .pipe(addsrc.prepend(jsFiles))
        .pipe(gulp.dest(distDir));
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
        .pipe(gulp.dest(distDir));
});
gulp.task('less',function() {
    gulp.src(lessFiles)
        .pipe(less())
        .pipe(gulp.dest(distDir));
});