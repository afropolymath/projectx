var browserify = require('browserify'),
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  del = require('del'),
  uglify = require('gulp-uglify'),
  nodemon = require('gulp-nodemon'),
  bower = require('gulp-bower'),
  babel = require("gulp-babel"),
  buffer = require('vinyl-buffer'),
  concat = require('gulp-concat'),
  karma = require('gulp-karma'),
  gutil = require('gulp-util'),
  jade = require('gulp-jade'),
  path = require('path'),
  protractor = require('gulp-protractor').protractor,
  source = require('vinyl-source-stream'),
  stringify = require('stringify'),
  exit = require('gulp-exit'),
  shell = require('gulp-shell');

var paths = {
  public: 'public/**',
  jade: ['views/partials/**/*.jade'],
  styles: ['client/scss/*.scss'],
  scripts: ['client/**/**/*.js'],
  staticFiles: [
    '!client/**/*.+(scss|css|js|jade)',
    'client/**/*.*'
  ],
  clientTests: [
    'public/lib/angular/angular.js',
    'public/lib/angular-mocks/angular-mocks.js',
    'public/js/index.js',
    'public/views/**/*.html',
    'test/client/**/*.js']
};

gulp.task('sass', function() {
  return gulp.src('client/scss/app.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/css'));
});

gulp.task('jade', function() {
  gulp.src(paths.jade)
    .pipe(jade())
    .pipe(gulp.dest('./public/partials/'));
});

gulp.task('browserify', function() {
  var b = browserify();
  b.add('./client/app.js');
  return b.bundle()
    .on('success', gutil.log.bind(gutil, 'Browserify Rebundled'))
    .on('error', gutil.log.bind(gutil, 'Browserify Error: in browserify gulp task'))
    .pipe(source('index.js'))
    .pipe(gulp.dest('./public/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('watch', function() {
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.styles, ['sass']);
  gulp.watch(paths.scripts, ['browserify']);
});

gulp.task('nodemon', function () {
  nodemon({
    script: 'server-es6.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' },
    ignore: ['public/**','client/**','node_modules/**']
  })
  .on('restart', ['jade','sass'], function () {
    console.log('Server restarted!');
  });
});

gulp.task('test', function() {

});

gulp.task('es5ify', function() {
  return gulp.src("server-es6.js")
    .pipe(babel())
    .pipe(rename('server.js'))
    .pipe(gulp.dest("./"));
});

gulp.task('bower', function() {
  return bower();
});

gulp.task('default', ['build', 'watch', 'nodemon']);

gulp.task('build', ['jade', 'sass', 'browserify']);
