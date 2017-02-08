var gulp = require('gulp');
var clean = require('gulp-clean')
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var mocha = require('gulp-mocha')
var tsProject = ts.createProject('tsconfig.json');

gulp.task('clean', function () {
    return gulp.src(['bin'], { read: false })
        .pipe(clean());
});

gulp.task('copyTxt', ['clean'], function () {
    gulp.src('src/**/*.txt')
        .pipe(gulp.dest('bin/src'));
});

gulp.task('compile', ['clean', 'copyTxt'], function () {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js.pipe(sourcemaps.write('.', {
            mapSources: function (sourcePath, file) {
                return '../' + sourcePath;
            }
        }))
        .pipe(gulp.dest('bin'));
});

gulp.task('build', ['compile'], function () {

});

gulp.task('test', ['build'], function () {
    return gulp.src('bin/test/**/*.js', { read: false })
        .pipe(mocha({ reporter: 'progress' }));
});