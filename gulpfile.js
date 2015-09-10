var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var del = require('del');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon');

gulp.task('sass', function() {
  return gulp.src('dev/scss/app.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function() {
  gulp.watch(['dev/scss/*.scss'], ['sass']);
});

gulp.task('nodemon', function () {
  nodemon({
    script: 'server.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' }
  })
  .on('restart', function () {
    console.log('Server restarted!')
  });
});

gulp.task('default', ['nodemon', 'watch']);
