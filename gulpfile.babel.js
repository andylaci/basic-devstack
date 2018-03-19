'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';
import sass from 'gulp-sass';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import cleanCss from 'gulp-clean-css';
import fs from 'graceful-fs';

import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import sourcemaps from 'gulp-sourcemaps';
import watchify from 'watchify';
import babelify from 'babelify';
import gutil from 'gulp-util';
import autoprefixer from 'gulp-autoprefixer';

const CONFIG = JSON.parse(fs.readFileSync('./config/gulp.json', 'utf8'));

function absolutePaths(path, list) {
  return list.map(function (item) {
    return path + item;
  })
}

function swallowError(error) {
  console.log(error.toString());
  this.emit('end')
}


// JS -------------------------------------------

var customOpts = {
  entries: [CONFIG.path.js + CONFIG.js.app],
  debug: true
};
var opts = Object.assign({}, watchify.args, customOpts);
var b = (process.env.NODE_ENV == 'production')? browserify(opts).transform("babelify", { presets: ["es2015", "stage-1","react"] }) : watchify(browserify(opts)).transform("babelify", { presets: ["es2015", "react"] });

function bundle() {
  if (process.env.NODE_ENV == 'production') {
    return b.bundle()
      .pipe(source('main.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(CONFIG.path.build + 'js/'));
  }
  return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(CONFIG.path.build + 'js/'))
    .pipe(browserSync.stream());
}

gulp.task('js', bundle);
b.on('update', bundle);
b.on('log', gutil.log);


// CSS ------------------------------------------

gulp.task('css', function () {
  if (process.env.NODE_ENV == 'production') {
    gulp.src(absolutePaths(CONFIG.path.css, CONFIG.css.app))
      .pipe(sass())
      .on('error', swallowError)
      .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(cleanCss())
      .pipe(gulp.dest(CONFIG.path.build + 'css/'));
  } else {
    gulp.src(absolutePaths(CONFIG.path.css, CONFIG.css.app))
      .pipe(sass())
      .on('error', swallowError)
      .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(CONFIG.path.build + 'css/'))
      .pipe(browserSync.stream());
  }
});


gulp.task('build', function () {
  gulp.start(['lib','js', 'css']);
});

gulp.task('watch', function () {
  gulp.start(['js', 'css']);
  gulp.watch(CONFIG.path.css + '**/*.scss', ['css']);
});

gulp.task('lib', function () {
  if (process.env.NODE_ENV == 'production') {
    gulp.src(absolutePaths(CONFIG.path.lib, CONFIG.js.lib))
      .pipe(concat('lib.js'))
      .pipe(uglify())
      .pipe(gulp.dest(CONFIG.path.build + 'js/'));
    gulp.src(absolutePaths(CONFIG.path.lib, CONFIG.css.lib))
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(concat('lib.css'))
      .pipe(cleanCss())
      .pipe(gulp.dest(CONFIG.path.build + 'css/'));
  } else {
    gulp.src(absolutePaths(CONFIG.path.lib, CONFIG.js.lib))
      .pipe(concat('lib.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(CONFIG.path.build + 'js/'));

    gulp.src(absolutePaths(CONFIG.path.lib, CONFIG.css.lib))
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(concat('lib.css'))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(CONFIG.path.build + 'css/'));
  }
});


gulp.task('serve', function () {
  browserSync.init(null, {
    proxy: `http://localhost:3000`,
    files: ["app/**/*.*"],
    browser: "google chrome",
    port: 4141,
    open: false
  });

  gulp.start('watch');
});

gulp.task('default', ['serve']);