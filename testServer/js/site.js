function editorSettingItem(name, title) {
    this.name = name;
    this.title = title;
}

function editorSettings() {
    this.itemsDefinitions = [];
    this.items = {};
}

editorSettings.prototype.registerItem = function (settingsItem) {
    this.itemsDefinitions.push(settingsItem);
    this.items[settingsItem.name] = false;
    return this;
}

editorSettings.prototype.loadFromCookies = function ($cookies) {
    this.itemsDefinitions.forEach(function (itemDefinition) {
        var itemName = itemDefinition.name;
        var itemValue = $cookies.get('settings.' + itemName) == 'true';
        this.items[itemName] = itemValue;
    }, this);
}

editorSettings.prototype.saveToCookies = function ($cookies) {
    for (var itemName in this.items) {
        $cookies.put('settings.' + itemName, this.items[itemName]);
    }
}


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
            tracedParserErrors: parser.tracedParserErrors
        };
        if (parser.tracedParserErrors.length > 0) {
            var haltParserError = parser.tracedParserErrors[parser.tracedParserErrors.length - 1];
            var editorError = {
                type: 'unnexpected ' + haltParserError.problemToken,
                yylocStart: {
                    last_line: haltParserError.loc.first_line,
                    last_column: haltParserError.loc.first_column,
                    first_line: -1,
                    first_column: -1
                },
                yylocEnd: {
                    first_line: -1,
                    first_column: -1,
                    last_line: haltParserError.loc.last_line,
                    last_column: haltParserError.loc.last_column,
                }
            };
            setEditorErrors([editorError]);
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
                if ($scope.settings.items.interactiveMode) {
                    $scope.runNewParserClick();
                }
            });
        });

    });
}

testServerApp.component('editorsettings', {
    templateUrl: 'views/settings.html',
    bindings: { data: "=" },
    controller: ['$cookies', function ($cookies) {
        this.checkBoxChanged = function () {
            this.data.saveToCookies($cookies);
        }
    }]
});

// Define the `PhoneListController` controller on the `testServerApp` module
testServerApp
    .controller('SparqlTestController', ['$scope', '$cookies', function SparqlTestController($scope, $cookies) {
        $scope.getItemSetReferences = getItemSetReferences;

        $scope.settings = (new editorSettings())
            .registerItem(new editorSettingItem('showLexerOutput', 'Show lexer output'))
            .registerItem(new editorSettingItem('showParserOutput', 'Show parser output'))
            .registerItem(new editorSettingItem('showParserLog', 'Show parser log'))
            .registerItem(new editorSettingItem('showParserStates', 'Show parser states'))
            .registerItem(new editorSettingItem('showStack', 'Show parser stack'))
            .registerItem(new editorSettingItem('interactiveMode', 'Interactive mode'));
        $scope.settings.loadFromCookies($cookies);

        $scope.parserLog = null;
        $scope.lexerOutput = null;
        $scope.parserOutput = null;
        $scope.parserErrorOutput = null;
        $scope.lexerErrorOutput = null;
        $scope.parserErrors = [];
        $scope.queryInput = $cookies.get('queryInput');
        $scope.parserVisualiser = $scope.settings.items.showParserStates ? new parserVisualiser(new ERSParser()) : {};

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
    }]);