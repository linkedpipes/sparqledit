function safeStringify(obj, arg1, arg2) {
    try {
        return JSON.stringify(obj, arg1, arg2);
    } catch (err) {
        return obj.toString();
    }
}

function parserDebuggerToText(parserDebugger) {
    var text = parserDebugger.map(function (step) {
        var res = '';
        if (step.action === 'reduce') {
            res += ' --> ';
        }
        res += step.action + ': ' + safeStringify(step.text);
        if (step.action === 'reduce') {
            res += ' (' + step.nonterminal + ' -> ' + JSON.stringify(step.productions) + ')';
        } else if (step.action === 'shift') {
            res += ' (' + step.terminal + ')';
        }
        return res;
    }).join('\n');
    return text;
}



function runParser(parser, $scope, runLexer) {
    $scope.lexerErrorOutput = null;
    $scope.parserErrorOutput = null;
    var parserInput = $scope.queryInput;
    if (runLexer) {
        try {
            $scope.lexerOutput = parser.showTerminals(parserInput);
        }
        catch (error) {
            $scope.lexerOutput = null;
            $scope.lexerErrorOutput = error;
        }
    }

    try {
        var parserResult = parser.parse(parserInput);
        $scope.parserOutput = parserResult;
        $scope.parserLog = parserDebuggerToText(parser.parserDebugger);
    } catch (error) {
        $scope.parserLog = parserDebuggerToText(parser.parserDebugger);
        $scope.parserOutput = null;
        $scope.parserErrorOutput = {
            message: error.message
        };
    }
}

// Define the `phonecatApp` module
var phonecatApp = angular.module('sparqlTestApp', ['ngCookies']);

// Define the `PhoneListController` controller on the `phonecatApp` module
phonecatApp
    .controller('SparqlTestController', ['$scope', '$cookies', function SparqlTestController($scope, $cookies) {
        $scope.showLexerOutput = $cookies.get('showLexerOutput') == 'true';
        $scope.showParserOutput = $cookies.get('showParserOutput') == 'true';
        $scope.showParserLog = $cookies.get('showParserLog') == 'true';
        
        $scope.parserLog = null;
        $scope.lexerOutput = null;
        $scope.parserOutput = null;
        $scope.parserErrorOutput = null;
        $scope.lexerErrorOutput = null;
        $scope.queryInput = $cookies.get('queryInput');

        $scope.runNewParserClick = function () {
            var parser = new ERSParser();
            runParser(parser, $scope, true);
        };

        $scope.runOriginalParserClick = function () {
            var parser = new sparqljs.Parser();
            runParser(parser, $scope, false);
        };


        $scope.queryInputChanged = function () {
            $cookies.put('queryInput', $scope.queryInput);
        }

        $scope.showCheckBoxChanged = function () {
            $cookies.put('showLexerOutput', $scope.showLexerOutput);
            $cookies.put('showParserOutput', $scope.showParserOutput);
            $cookies.put('showParserLog', $scope.showParserLog);
        }
    }]);