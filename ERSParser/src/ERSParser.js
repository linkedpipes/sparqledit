var Parser = require('../generatedParser/parserModule').Parser;

function showTerminals(parser, input) {
  var lexer = Object.create(parser.lexer);
  lexer.setInput(input);
  var token = lexer.lex();
  var result = "";
  while (token != 1) {
    var terminal = parser.terminals_[token];
    result += " " + (terminal === undefined ? "undefined" : terminal.toString());
    token = lexer.lex();
  }
  return result;
}

function ERSParser(prefixes, baseIRI) {

  var prefixesCopy = {};
  for (var prefix in prefixes || {}) {
    prefixesCopy[prefix] = prefixes[prefix];
  }

  var parser = new Parser();
  parser.parse = function () {
    Parser.base = baseIRI || '';
    Parser.prefixes = Object.create(prefixesCopy);
    var res = Parser.prototype.parse.apply(parser, arguments);
    return res;
  };

  parser._resetBlanks = Parser._resetBlanks;
  // TODO: do not print terminals, but return them
  parser.showTerminals = function (input) {
    return showTerminals(parser, input)
  }
  return parser;
}

module.exports = ERSParser;