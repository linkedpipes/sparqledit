var gulp = require('gulp');
var clean = require('gulp-clean')
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('clean', function () {
    return gulp.src(['bin'], { read: false })
        .pipe(clean());
});

gulp.task('copyTxt', ['clean'], function () {
    gulp.src('src/**/*.txt')
        .pipe(gulp.dest('bin'));
});

gulp.task('compile', ['clean', 'copyTxt'], function () {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('bin'));
});

gulp.task('build', ['compile'], function () {

});