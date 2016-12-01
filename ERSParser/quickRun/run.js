var fs = require("fs");
var ERSParser = require("../src/ERSParser");
var input = fs.readFileSync(__dirname + "\\input.txt", "utf8");

var parser = new ERSParser();
// console.log(parser.showTerminals(input);)

var result = parser.parse(input);

console.log(JSON.stringify(result, 4, '    '));
console.log('End');