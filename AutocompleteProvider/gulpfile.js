var gulp = require('gulp');
var clean = require('gulp-clean');
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var mocha = require('gulp-mocha');
var tsProject = ts.createProject('tsconfig.json');
var mergeStream = require('merge-stream');

gulp.task('clean', function () {
    return gulp.src(['bin'], { read: false })
        .pipe(clean());
});

gulp.task('copyFiles', ['clean'], function () {
    var copySrcStream = gulp.src(['src/**/*', '!**/*.ts'])
        .pipe(gulp.dest('bin/src'));
    var copyTestStream = gulp.src(['test/**/*', '!**/*.ts'])
        .pipe(gulp.dest('bin/test'));
    return mergeStream(copySrcStream, copyTestStream);
});

gulp.task('compile', ['clean', 'copyFiles'], function () {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js.pipe(sourcemaps.write('.', {
            mapSources: function (sourcePath, file) {
                var slashesCount = Array.prototype.filter.call(sourcePath, function (x) { return x == '/'; }).length;
                return '../'.repeat(slashesCount - 1) + sourcePath;
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