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

function ERSParserError(message, hash) {
  var hashLoc = hash.loc;
  this.originalMessage = message;
  this.loc = {
    first_line: hashLoc.first_line,
    first_column: hashLoc.first_column,
    last_line: hashLoc.last_line,
    last_column: hashLoc.last_column
  };

  this.expected = hash.reallyExpected;
  this.problemToken = hash.token;
}

function updateHaltParserErrorLoc(parserErrors, last_line, last_column) {
  if (parserErrors.length < 1) {
    return;
  }
  var parserErrorLoc = parserErrors[parserErrors.length - 1].loc;
  parserErrorLoc.first_line = parserErrorLoc.last_line;
  parserErrorLoc.first_column = parserErrorLoc.last_column;
  parserErrorLoc.last_line = last_line;
  parserErrorLoc.last_column = last_column;
}

function ERSParser(prefixes, baseIRI) {
  var prefixesCopy = {};
  for (var prefix in prefixes || {}) {
    prefixesCopy[prefix] = prefixes[prefix];
  }

  var parser = new Parser();

  parser.tracedParserErrors = [];
  parser.trace = function (message, hash) {
    this.tracedParserErrors.push(new ERSParserError(message, hash));
  }

  parser.parse = function () {
    Parser.resetParserErrors();
    Parser.base = baseIRI || '';
    Parser.prefixes = Object.create(prefixesCopy);
    try {
      var res = Parser.prototype.parse.apply(parser, arguments);
    }
    catch (e) {
      var lines = arguments[0].split(/\r?\n/gm);
      updateHaltParserErrorLoc(parser.tracedParserErrors,
        lines.length,
        lines[lines.length - 1].length + 1);
      throw e;
    }
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