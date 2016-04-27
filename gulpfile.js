'use strict';

var gulp = require('gulp');
var del = require('del');
var path = require('path');
var install = require('gulp-install');
var gulp = require('gulp');
var bowerFiles = require('main-bower-files');
var eventStream = require('event-stream');
var path = require('path');
var del = require('del');
var tslint = require('gulp-tslint');
var sourcemaps = require('gulp-sourcemaps');
var tsc = require("gulp-typescript");
var tsProject = tsc.createProject("tsconfig.json")
var connect = require('gulp-connect');
var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*']
});


var paths = {
    dist: 'dist'
};

var conf = {
    src: 'src',
    dist: paths.dist,
    css: {
        src: 'src/content',
        dist: path.join(paths.dist, 'content')
    },
    ts: {
        app: 'app.ts',
        src: 'src/',
        dist: paths.dist
    },
    html: {
        index: 'src/index.html',
        src: 'src/',
        dist: paths.dist
    }
}

var errorHandler = function(title) {
  'use strict';

    return function(err) {
        util.log(util.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    };
};

gulp.task('clean', function () {
    del([path.join(paths.dist, '/')]);
})

gulp.task('tslint', function() {
    return gulp.src(path.join(conf.ts.src, "**/*.ts"))
        .pipe(tslint())
        .pipe(tslint.report('prose'));
});

gulp.task("compile", ["tslint"], function() {
    gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject))
        .js
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('watch-ts', function () {
    gulp.watch(path.join(conf.ts.src, '/**/*.ts'), ['compile'])
        .on('change', function (e) {
            console.log('TypeScript file ' + e.path + ' has been changed. Compiling.');
        })
        .on('error', errorHandler('watch-ts'));
});

gulp.task('resources', function() {
   gulp.src([path.join(conf.src, '/**/*.*'), '!' + path.join(conf.src,'/**/*.+(ts|css|html)')])
       .pipe(gulp.dest(paths.dist)); 
});

gulp.task('html', function() {
   gulp.src(path.join(conf.html.src, '/**/*.html'))
       .pipe(gulp.dest(paths.dist));
});

gulp.task('watch-html', function () {
    gulp.watch(path.join(conf.html.src, '/**/*.html'), ['html'])
        .on('error', errorHandler('watch-html'));
});

gulp.task('clean:client', function () {
    return del.sync([path.join(paths.dist, '/')]);
});

gulp.task('css', function () {
    gulp.src(path.join(conf.css.src, '/**/*.css'))
        .pipe(gulp.dest(conf.css.dist));
});

gulp.task('watch-css', function () {
    gulp.watch(path.join(conf.css.src, '/**/*.css'), ['css'])
        .on('error', errorHandler('watch-css'));
});


// main tasks
gulp.task('build:client', ['clean:client', 'html', 'css', 'compile', 'resources']);
gulp.task('watch:client', ['watch-ts', 'watch-css', 'watch-html']);
gulp.task('server:client', ['build:client', 'watch:client']);


/**
 * Clean all previous distibution, run server and serve client
 */
gulp.task('default', ['clean', 'server:client'], function () {
  connect.server({
    livereload: true
  });
});

gulp.task('install', function (callback) {
    gulp.src(['./bower.json', './package.json'])
        .pipe(install());
});
