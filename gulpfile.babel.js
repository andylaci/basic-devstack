'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';
import sass from 'gulp-sass';
import urlAdjuster from 'gulp-css-url-adjuster';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import cleanCss from 'gulp-clean-css';
import babel from 'gulp-babel';

const ASSETS_PATH = './assets/';
const DIST_PATH = './build/';
const ASSETS_PREFIX = '../assets/';
const LIB_PATH = './lib/';

gulp.task('css', function () {
  gulp.src([ASSETS_PATH + 'css/index.scss'])
    .pipe(sass())
    .pipe(urlAdjuster({
      prepend: ASSETS_PREFIX
    }))
    .pipe(gulp.dest(DIST_PATH + 'css/'))
    .pipe(browserSync.stream());
});

gulp.task('js', function () {
  gulp.src([
      ASSETS_PATH + 'js/lib/contest-list.js',
      ASSETS_PATH + 'js/index.js'
    ])
    .pipe(concat('index.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(DIST_PATH + 'js/'))
    .pipe(browserSync.stream());
});

gulp.task('build', function () {
  gulp.start(['js', 'css']);
});

gulp.task('watch', function () {
  gulp.start(['js', 'css']);
  gulp.watch(ASSETS_PATH + 'css/**/*.scss', ['css']);
  gulp.watch(ASSETS_PATH + 'js/**/*.js', ['js']);
});

gulp.task('lib', function () {
  gulp.src([
      LIB_PATH + "jquery/dist/react.min.js",
      LIB_PATH + "jquery/dist/react-dom.min.js",
      LIB_PATH + "jquery/dist/jquery.min.js",
      LIB_PATH + 'bootstrap/dist/js/bootstrap.min.css'
    ])
    .pipe(concat('lib.js'))
    .pipe(uglify())
    .pipe(gulp.dest(DIST_PATH + 'js/'));

  gulp.src([
      LIB_PATH + 'bootstrap/dist/css/bootstrap.min.css'
    ])
    .pipe(concat('lib.css'))
    .pipe(cleanCss())
    .pipe(gulp.dest(DIST_PATH + 'css/'));

});


gulp.task('serve', function () {
  browserSync.init({
    files: ['./**/*.html'],
    server: {
      baseDir: "./"
    },
    port: 2000
  });

  gulp.start('watch');
});

gulp.task('default', ['serve']);