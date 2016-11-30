/// <reference path="..\node_modules\@types\node\index.d.ts"/>
var fs = require('fs');
var jison = require("jison");

function runParser(queryFilePath) {
    var bnf = fs.readFileSync("..\\parser.jison", "utf8");
    var input = fs.readFileSync(queryFilePath, "utf8");
    var parser = new jison.Parser(bnf, { type: "lalr" });
    var result = parser.parse(input);
    return result;
}

describe("Parser should", function () {
    it("parse all ok queries", function () {
        var queriesFolder = "queries\\ok";
        var files = fs.readdirSync(queriesFolder);

        for (var i = 0; i < files.length; i++) {
            var currentFileName = files[i];
            var result = runParser(queriesFolder + "\\" + currentFileName);
        }
    });
});
