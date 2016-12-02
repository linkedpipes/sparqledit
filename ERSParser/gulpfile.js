var gulp = require('gulp');
var _ = require('underscore');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var mocha = require('gulp-mocha');
var clean = require('gulp-clean');
var jison = require('gulp-jison');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var simpleGit = require('simple-git');

var allowedPathsToCommitOutOfMaster = ['src/parser.jison', 'test/queries'];

gulp.task('clean', function () {
    return gulp.src(['generatedParser', 'bin'], { read: false })
        .pipe(clean());
});

gulp.task('buildParser', ['clean'], function () {
    var pipeResult = gulp.src('.\\src\\parser.jison')
        .pipe(jison({ type: "slr" }))
        .pipe(rename('parserModule.js'))
        .pipe(gulp.dest('.\\generatedParser'));
    return pipeResult;
});

gulp.task('build', ['buildParser', 'browserify'], function () {
});

gulp.task('test', ['build'], function () {
    return gulp.src('test/*.js', { read: false })
        .pipe(mocha({ reporter: 'progress' }));
})

gulp.task('browserify', ['clean', 'buildParser'], function () {
    gulp.src(['src/ERSParser.js'])
        .pipe(browserify({ standalone: 'ERSParser' }))
        .pipe(gulp.dest('./bin'))
});

gulp.task('default', function () {
    console.log('There is no default action');
});

gulp.task('precommit', function () {
    var git = simpleGit('..');
    var branch;
    var diffSummary;
    var neco = git.branchLocal(function (err, summary) {
        branch = summary.current;
        console.log();
    })
        .diffSummary(['--cached'], function (err, summary) {
            diffSummary = summary;
        })
        .then(function () {
            if (branch == "master") {
                return;
            }
            var files = diffSummary.files;
            for (var i = 0; i < files.length; i++) {
                var currentFilePath = files[i].file;
                var result = _(allowedPathsToCommitOutOfMaster).any(function (allowedPath) {
                    return currentFilePath.match(allowedPath);
                });
                if (!result) {
                    console.log("Warning: you probably did not want commit",'\033[31m', currentFilePath, '\x1b[0m');
                }
            }
        });
});
