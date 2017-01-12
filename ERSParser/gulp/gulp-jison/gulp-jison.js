var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var Generator = require('jison').Generator;
var escapeStringRegexp = require('escape-string-regexp');

const PLUGIN_NAME = 'gulp-jison';

var parserAnchorPart = 'performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {';

function addItemSetToParser(parserGenerator, parserCode) {

    var itemSets = parserGenerator.states._items.map(function(state, i) {
        var rules = state._items.map(function(rule) {
            return rule.toString();
        });

        return {
            Id: i,
            Rules: rules,
            Transitions: state.edges
        };
    });


    var itemSetJson = JSON.stringify(itemSets);
    return parserCode.replace(new RegExp(escapeStringRegexp(parserAnchorPart), 'm'), 'itemSets:' + itemSetJson + ',' + parserAnchorPart.replace(/\$/g,'$$$$'));
}

module.exports = function(options) {
    options = options || {};

    return through.obj(function(file, enc, callback) {
        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported'));
            return callback();
        }

        if (file.isBuffer()) {
            try {
                var generator = new Generator(file.contents.toString(), options);
                var parserCode = addItemSetToParser(generator, generator.generate());
                var buffer = new Buffer(parserCode);
                file.contents = buffer;
                file.path = gutil.replaceExtension(file.path, ".js");
                this.push(file);
            } catch (error) {
                this.emit('error', new PluginError(PLUGIN_NAME, error));
            }
            return callback();
        }
    });
};
