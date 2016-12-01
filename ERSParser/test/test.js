var fs = require('fs');
var chai = require('chai');
var fileUtils = require('./fileUtils');
var ERSParser = require('../src/ERSParser');

var testfolder = __dirname + "\\queries";



// Parses a JSON object, restoring `undefined` values
parseJSON = function parseJSON(string) {
    var object = JSON.parse(string);
    return /"\{undefined\}"/.test(string) ? restoreUndefined(object) : object;
}

// Recursively replace values of "{undefined}" by `undefined`
function restoreUndefined(object) {
    for (var key in object) {
        var item = object[key];
        if (typeof item === 'object')
            object[key] = restoreUndefined(item);
        else if (item === '{undefined}')
            object[key] = undefined;
    }
    return object;
}

function runParser(queryFilePath) {
    var input = fs.readFileSync(queryFilePath, "utf8");
    var parser = new ERSParser();
    // TODO: should reset automatically! 
    parser._resetBlanks();
    var result = parser.parse(input);
    return result;
}

function testQuery(queryFolder, queryFileName) {
    var queryPath = queryFolder + "\\" + queryFileName;
    if (!queryPath.match(/.sparql$/)) {
        return;
    }
    it("shoud parser query " + queryFileName, function () {
        var result = runParser(queryPath);
        var expectedResultFileName = queryFolder + "\\" + queryFileName.replace('.sparql', '.json');
        if (fs.existsSync(expectedResultFileName)) {
            var expectedResultSerialized = fs.readFileSync(expectedResultFileName);
            var expectedResult = parseJSON(expectedResultSerialized);
            chai.expect(result).to.deep.equal(expectedResult);
        }
    });
}

function testFolder(folder) {
    folder.folders.forEach(function (subfolder) {
        describe("parse all queries in folder" + subfolder.path.relative, function () {
            testFolder(subfolder);
        });
    });

    folder.files.forEach(function (file) {
        testQuery(folder.path.getAbsolutePath(), file);
    });
}

describe("Parser should", function () {
    var filesTree = fileUtils.getFilesTree(testfolder);
    testFolder(filesTree);
});
