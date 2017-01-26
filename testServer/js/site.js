function removeKeysFromStack(stack) {
    return Object.keys(stack).map(function (x) {
        return stack[x];
    });
}
function setParserResultInScope($scope, parserResult) {
    var parserErrors = [];
    if (parserResult.parserErrors) {
        parserErrors = parserResult.parserErrors;
        delete parserResult.parserErrors;
    }
    setEditorErrors(parserErrors);
    $scope.parserOutput = parserResult;
    $scope.parserErrors = parserErrors;
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
        setParserResultInScope($scope, parserResult);
        $scope.parserLog = parser.parserDebugger;
    } catch (error) {
        $scope.parserLog = parser.parserDebugger;
        $scope.parserOutput = null;
        $scope.parserErrorOutput = {
            message: error.message,
            traceMessages: parser.traceMessages
        };
    }
}

// Define the `testServerApp` module
var testServerApp = angular
    .module('sparqlTestApp', ['ngCookies'])
    .config(function ($sceProvider) {
        $sceProvider.enabled(false);
    });;

testServerApp.directive("collapsible", ["$timeout", function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            $timeout(function () {
                element.collapsible();
            });
        }
    };
}]);

var editor;

function setEditorErrors(errors) {
    var model = editor.getModel();
    var markers = errors.map(function (error) {
        return {
            severity: monaco.Severity.Error,
            code: null,
            source: null,
            startLineNumber: error.yylocStart.last_line,
            startColumn: error.yylocStart.last_column,
            endLineNumber: error.yylocEnd.last_line,
            endColumn: error.yylocEnd.last_column,
            message: error.type,
        }
    });

    monaco.editor.setModelMarkers(model, 'sparql', markers);
}

function initMonacoEditor(text, $scope) {
    require.config({ paths: { 'vs': 'node_modules/monaco-editor/min/vs' } });
    require(['vs/editor/editor.main'], function () {
        monaco.languages.register({ id: 'sparql' });
        editor = monaco.editor.create(document.getElementById('queryEditorContainer'), {
            value: text,
            language: 'sparql'
        });

        editor.onDidChangeModelContent(function (e) {
            $scope.$apply(function () {
                $scope.queryInput = editor.getValue();
                if($scope.interactive) {
                    $scope.runNewParserClick();
                }
            });
        });

    });
}


// Define the `PhoneListController` controller on the `testServerApp` module
testServerApp
    .controller('SparqlTestController', ['$scope', '$cookies', function SparqlTestController($scope, $cookies) {
        $scope.getItemSetReferences = getItemSetReferences;
        $scope.interactive = false;
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
        $scope.parserErrors = [];
        $scope.queryInput = $cookies.get('queryInput');
        $scope.parserVisualiser = $scope.showParserStates ? new parserVisualiser(new ERSParser()) : {};

        initMonacoEditor($scope.queryInput, $scope);

        $scope.runNewParserClick = function () {
            var parser = new ERSParser();
            runParser(parser, $scope, true);
        };

        $scope.runOriginalParserClick = function () {
            var parser = new sparqljs.Parser();
            runParser(parser, $scope, false);
        };


        $scope.$watch('queryInput', function (newValue, oldValue) {
            $cookies.put('queryInput', newValue);
        });

        $scope.showCheckBoxChanged = function () {
            $cookies.put('showLexerOutput', $scope.showLexerOutput);
            $cookies.put('showParserOutput', $scope.showParserOutput);
            $cookies.put('showParserLog', $scope.showParserLog);
            $cookies.put('showStack', $scope.showStack);
            $cookies.put('showParserStates', $scope.showParserStates);
        }
    }]);