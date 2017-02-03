import * as fs from 'fs';

var ERSParser = require('../../ERSParser/bin/ERSParser');

var input = fs.readFileSync(__dirname + "/input.txt", "utf8");
var parser = new ERSParser();
var result = parser.parse(input);

console.log(JSON.stringify(result));
console.log('End');