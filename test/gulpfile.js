var pkg = require('../package.json');
var gulp = require('gulp');
var concat = require('gulp-concat');

var devizr  = require('../index')({
  input: './test/node-devizr.json',
  output: './dest/breakpoints.js',
  varname: 'breakpoints',
  verbose: true
});

gulp.task('devizr desktop scripts', function() {
  
  var script = devizr[767]['animation'].script;

  return gulp.src(script.src)
    .pipe(concat(script.out))
    .pipe(gulp.dest(script.dest));
 
});

gulp.task('devizr desktop styles', function() {
  
  var style = devizr[767]['animation'].style;
  
  return gulp.src(style.src)
    .pipe(concat(style.out))
    .pipe(gulp.dest(style.dest));

});

gulp.task('devizr mobile scripts', function() {
  
  var script = devizr[0]['mobilenavigation'].script;
  
  return gulp.src(script.src)
    .pipe(concat(script.out))
    .pipe(gulp.dest(script.dest));

});

gulp.task('default', [
  'devizr desktop scripts',
  'devizr mobile scripts',
	'devizr desktop styles'
]);

