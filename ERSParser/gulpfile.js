var gulp = require('gulp');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var mocha = require('gulp-mocha');
var clean = require('gulp-clean');
var jison = require('gulp-jison');
var rename = require('gulp-rename');

gulp.task('clean', function () {
    return gulp.src('generatedParser', { read: false })
        .pipe(clean());
});

gulp.task('build', ['clean'], function () {
    var pipeResult = gulp.src('.\\src\\parser.jison')
        .pipe(jison({ type: "slr" }))
        .pipe(rename('parserModule.js'))
        .pipe(gulp.dest('.\\generatedParser'));
    return pipeResult;
});

gulp.task('test', ['build'], function () {
    return gulp.src('test/*.js', { read: false })
                .pipe(mocha({ reporter: 'progress' })); 
})


gulp.task('default', function () {
    console.log('There is no default action');
});
