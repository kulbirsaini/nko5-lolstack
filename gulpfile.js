'use strict';

const del     = require('del');
const eslint  = require('gulp-eslint');
const gulp    = require('gulp');
const webpack = require('webpack-stream');

const webpackConfig = require('./webpack.config');


const files = {
  src: [
    '*.js',
    'app/**/*.js',
    'scripts/*.js',
    'web/**/*.js',
    'web/**/*.jsx'
  ],
  webpack: [
    'web/**/*.js',
    'web/**/*.scss',
    'web/**/*.jsx'
  ]
};


gulp.task('dev-env', function() {
  process.env.NODE_ENV = 'development';
});

gulp.task('eslint', ['dev-env'], function() {
  return gulp.src(files.src)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('clean', function() {
  del(['dist/*']);
});

gulp.task('webpack', ['dev-env', 'clean'], function() {
  return gulp.src(['web/**/*.js'])
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/'));
});

gulp.task('watch', ['dev-env', 'eslint'], function () {
  gulp.watch(files.src, ['eslint']);
});

gulp.task('default', ['watch']);
