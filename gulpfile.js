'use strict';

const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const gulpLoadPlugins = require('gulp-load-plugins');

let wiredep = require('wiredep').stream;

const plugins = gulpLoadPlugins();
const sassRoot = 'src/scss/';
const cssRoot = 'dist/css/';

const angular = 'dist/app/**/*.js';
const angularOrder = [
  'dist/app/DLock.js', 
  'dist/app/config.js', 
  'dist/app/modules.js', 
  angular
];
const outputAngular = 'dist/js/build/';

const views = 'views/**/*.jade';
const viewsRoot = 'views/';

const outputViews = 'dist/views/**/*.html';
const outputViewsRoot = 'dist/views/';

function handleError(err) {
  console.log(err.toString());
}

// ############################################################################################
// ############################################################################################

gulp.task('clean:styles', (cb) => {
  del([
    '**/.sass-cache/**',
  ], cb);
});
gulp.task('build-views', () => {
  return gulp.src(views)
    .pipe(plugins.jade())
    .pipe(gulp.dest(outputViewsRoot))
});

gulp.task('build-sass', () => {
  return gulp.src(sassRoot+'/d-lock.scss')
    .pipe(plugins.plumber())
    .pipe(plugins.notify('Compile Sass File: <%= file.relative %>...'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.autoprefixer('last 10 versions'))
    .pipe(plugins.sass({
      style: 'compressed'
    })).on('error', handleError)
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(cssRoot))
    .pipe(plugins.filter("**/*.css"))
    .pipe(plugins.livereload());
});

gulp.task('package-angular', () => {
  return gulp.src(angularOrder)
    .pipe(plugins.concat('dlock.js'))
    .pipe(gulp.dest(outputAngular));
});

// ############################################################################################
// ############################################################################################

gulp.task('watch', () => {
  plugins.notify('Sass/Views/Angular Watch is Active...');
  plugins.livereload.listen();
  gulp.watch(sassRoot+'/**/*.scss', ['build-sass']);
  gulp.watch(views, ['build-views']);
  gulp.watch(angular, ['package-angular']);
});

// ############################################################################################
// ############################################################################################

gulp.task('default', ['build-sass', 'package-angular', 'build-views', 'watch'], () => {
  gutil.log('Transposing Sass...');
});

gulp.task('clean', ['clean:styles']);
