var gulp = require('gulp');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var mocha = require('gulp-mocha');
var clean = require('gulp-clean');
var jison = require('gulp-jison');
var rename = require('gulp-rename');
browserify = require('gulp-browserify')

gulp.task('clean', function() {
    return gulp.src(['generatedParser','bin'], { read: false })
        .pipe(clean());
});

gulp.task('buildParser', ['clean'], function() {
    var pipeResult = gulp.src('.\\src\\parser.jison')
        .pipe(jison({ type: "slr" }))
        .pipe(rename('parserModule.js'))
        .pipe(gulp.dest('.\\generatedParser'));
    return pipeResult;
});

gulp.task('build', ['buildParser','browserify'], function() {
});

gulp.task('test', ['build'], function() {
    return gulp.src('test/*.js', { read: false })
        .pipe(mocha({ reporter: 'progress' }));
})

gulp.task('browserify',['clean','buildParser'], function() {
    gulp.src(['src/ERSParser.js'])
        .pipe(browserify({standalone:'ERSParser'}))
        .pipe(gulp.dest('./bin'))
});

gulp.task('default', function() {
    console.log('There is no default action');
});
