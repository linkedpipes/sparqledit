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
    } catch (error) {
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
    }]);