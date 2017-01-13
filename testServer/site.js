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

function createAllStackCollection(stack) {
    var body = '';
    stack.forEach(function (stackItem, index) {
        if ((index % 2) == 0) {
            body += '<li class="collection-item">' + formatParserState(stackItem) + '</li>';
        }
        else {
            body += '<li class="collection-item"><div class="collapsible-header">' + safeStringify(stackItem) + '</div></li>';
        }
    });

    return '<ul class="collection collapsible" data-collapsible="expandable">' + body + '</ul>';
}

function formatPrereduceLoc(locList) {
    var result = '';
    locList.forEach(function (loc) {
        result += '[' + loc.first_line + ':' + loc.first_column + '-' + loc.last_line + ':' + loc.last_column + ']  ';
    });
    return result;
}

function formatParserState(state) {
    var header = '<div class="collapsible-header orange lighten-4">' + state.Id + '</div>';
    var body = '';
    body += '<li class="collection-item">Rules: <ul class="collection">'
    state.Rules.forEach(function (stackItem) {
        body += '<li class="collection-item">' + stackItem + '</li>';
    });
    body += '</ul></li>';

    body += '<li class="collection-item">Transitions: <ul class="collection">'

    var transitions = state.Transitions;
    for (var property in transitions) {
        body += '<li class="collection-item">' + property + ' -> ' + transitions[property] + '</li>';
    }
    body += '</ul></li>';

    return header + '<div class="collapsible-body" style="color:black;"><ul class="collection">' + body + '</ul></div>';
}

function formatPopStackStep(step) {
    var header = '<b>Pop stack ' + step.state + '</b>';
    var body = '<li class="collection-item">Depth: "' + step.depth + '"</li>'
        + '<li class="collection-item">Lookahead: Normal (' + step.symbol + ') Error(' + step.preErrorSymbol + ')</li>'
        + '<li class="collection-item">Error: "' + safeStringify(step.error) + '"</li>'
        + '<li class="collection-item">Unwind symbols number: "' + safeStringify(step.stack) + '"</li>'
        + '<li class="collection-item">Unwind symbols: "' + safeStringify(step.stackNamed) + '"</li>'
        + '<li class="collection-item">Unwind values: "' + safeStringify(step.vstack) + '"</li>';;

    return '<li><div class="collapsible-header yellow lighten-4">' + header + '</div>'
        + '<div class="collapsible-body"><ul class="collection">' + body + '</ul></div>'
        + '</li>';
}

function formatReduceStep(step) {
    var header = '<b>Reduce</b>: [' + step.nonterminal + ']' + ' ' + step.state; //+ safeStringify(step.text);

    var body = '<li class="collection-item">Prereduce: ' + safeStringify(step.prereduce) + '</li>'
        + '<li class="collection-item">Lookahead: Normal (' + step.symbol + ') Error(' + step.preErrorSymbol + ')</li>'
        + '<li class="collection-item">Prereduce loc: ' + formatPrereduceLoc(step.prereduceLoc) + '</li>'
        + '<li class="collection-item">Productions: ' + safeStringify(step.productions) + '</li>'
        + '<li class="collection-item">Result: ' + safeStringify(step.result) + '</li>'
        + '<li class="collection-item">Stack: ' + createStackCollection(removeKeysFromStack(step.stack)) + '</li>'
        + '<li class="collection-item" ng-show="showStack">Stack: ' + createAllStackCollection(step.allstack) + '</li>'

    return '<li><div class="collapsible-header indigo lighten-4">' + header + '</div>'
        + '<div class="collapsible-body indigo lighten-5"><ul class="collection">' + body + '</ul></div></li>';
}

function formatShiftStep(step) {
    var header = '<b>Shift</b>: ' + ' [' + step.terminal + ']' + ' ' + step.state;
    var body = '<li class="collection-item">Value: "' + step.text + '"</li>'
        + '<li class="collection-item">Lookahead: Normal (' + step.symbol + ') Error(' + step.preErrorSymbol + ')</li>'
        + '<li class="collection-item">Stack: ' + createStackCollection(removeKeysFromStack(step.stack)) + '</li>'
        + '<li class="collection-item">Stack: ' + createAllStackCollection(step.allstack) + '</li>';

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
            case 'popStack':
                return formatPopStackStep(step);
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
            message: error.message,
            traceMessages: parser.traceMessages
        };
    }
}

// Define the `phonecatApp` module
var phonecatApp = angular
    .module('sparqlTestApp', ['ngCookies', 'ui.materialize'])
    .config(function ($sceProvider) {
        $sceProvider.enabled(false);
    });;

// Define the `PhoneListController` controller on the `phonecatApp` module
phonecatApp
    .controller('SparqlTestController', ['$scope', '$cookies', function SparqlTestController($scope, $cookies) {
        $scope.getItemSetReferences = getItemSetReferences;

        $scope.showLexerOutput = $cookies.get('showLexerOutput') == 'true';
        $scope.showParserOutput = $cookies.get('showParserOutput') == 'true';
        $scope.showParserLog = $cookies.get('showParserLog') == 'true';
        $scope.showStack = $cookies.get('showStack') == 'true';
        $scope.showParserStates = $cookies.get('showParserStates') == 'true';

        $scope.parserLog = null;
        $scope.lexerOutput = null;
        $scope.parserOutput = null;
        $scope.parserErrorOutput = null;
        $scope.lexerErrorOutput = null;
        $scope.queryInput = $cookies.get('queryInput');
        $scope.parserVisualiser = $scope.showParserStates ? new parserVisualiser(new ERSParser()) : {};

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
            $cookies.put('showStack', $scope.showStack);
            $cookies.put('showParserStates', $scope.showParserStates);
        }
    }]);