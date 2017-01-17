function removeKeysFromStack(stack) {
    return Object.keys(stack).map(function (x) {
        return stack[x];
    });
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



// Define the `PhoneListController` controller on the `testServerApp` module
testServerApp
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