var fs = require('fs');
var lazypipe = require('lazypipe');
var replace = require('gulp-replace');
var escapeStringRegexp = require('escape-string-regexp'); 

function makeParserDebuggable() {
    var changesDefinitionFile = __dirname + '/changesDefinition.json';
    var changesDefinition = JSON.parse(fs.readFileSync(changesDefinitionFile).toString());

    var changesPipe = new lazypipe();

    changesDefinition.forEach(function (changeName) {
        var replaceAnchorFile = __dirname + '/changes/' + changeName + 'Anchor.txt';
        var replaceChangeFile = __dirname + '/changes/' + changeName + 'Change.txt';
        var replaceAnchor = fs.readFileSync(replaceAnchorFile).toString();
        var replaceChange = fs.readFileSync(replaceChangeFile).toString();
        changesPipe = changesPipe.pipe(replace, new RegExp(escapeStringRegexp(replaceAnchor), "m"), replaceChange);
    });

    return changesPipe();
}

module.exports = makeParserDebuggable;