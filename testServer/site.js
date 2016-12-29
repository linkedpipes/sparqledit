function safeStringify(obj, arg1, arg2) {
    try {
        return JSON.stringify(obj, arg1, arg2);
    } catch (err) {
        return obj.toString();
    }
}

function removeKeysFromStack(stack) {
    return Object.keys(stack).map(function (x) {
        return stack[x];
    });
}

function createStackCollection(stack) {
    var body = '';
    stack.forEach(function (stackItem) {
        body += '<li class="collection-item">' + safeStringify(stackItem) + '</li>';
    });

    return '<ul class="collection"><li class="collection-item">' + body + '</li></ul>';
}
function formatPrereduceLoc(locList) {
    var result = '';
    locList.forEach(function (loc) {
        result += '[' + loc.first_line + ':' + loc.first_column + '-' + loc.last_line + ':' + loc.last_column + ']  ';
    });
    return result;
}
function formatReduceStep(step) {
    var header = '<b>Reduce</b>: [' + step.nonterminal + ']'; //+ safeStringify(step.text);

    var body = '<li class="collection-item">Prereduce: ' + safeStringify(step.prereduce) + '</li>'
        + '<li class="collection-item">Prereduce loc: ' + formatPrereduceLoc(step.prereduceLoc) + '</li>'
        + '<li class="collection-item">Productions: ' + safeStringify(step.productions) + '</li>'
        + '<li class="collection-item">Result: ' + safeStringify(step.result) + '</li>'
        + '<li class="collection-item">Stack: ' + createStackCollection(removeKeysFromStack(step.stack)) + '</li>';

    return '<li><div class="collapsible-header indigo lighten-4">' + header + '</div>'
        + '<div class="collapsible-body indigo lighten-5"><ul class="collection">' + body + '</ul></div></li>';
}

function formatShiftStep(step) {
    var header = '<b>Shift</b>: ' + ' [' + step.terminal + ']';
    var body = '<li class="collection-item">Value: "' + step.text + '"</li>'
        + '<li class="collection-item">Stack: ' + createStackCollection(removeKeysFromStack(step.stack)) + '</li>';
    return '<li><div class="collapsible-header red lighten-4">' + header + '</div>'
        + '<div class="collapsible-body"><ul class="collection">' + body + '</ul></div>'
        + '</li>';
}

function parserDebuggerToText(parserDebugger) {
    var text = parserDebugger.map(function (step) {
        switch (step.action) {
            case 'reduce':
                return formatReduceStep(step);
            case 'shift':
                return formatShiftStep(step);
            default:
                throw new Error('Unknown step action.');
        }
    }).join('');
    return '<ul class="collapsible" data-collapsible="expandable">' + text + '</ul>';
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
var phonecatApp = angular
    .module('sparqlTestApp', ['ngCookies'])
    .config(function ($sceProvider) {
        $sceProvider.enabled(false);
    });;

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
            // TODO: Evil!
            setTimeout(function () { $('.collapsible').collapsible(); }, 200);
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