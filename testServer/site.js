// Define the `phonecatApp` module
var phonecatApp = angular.module('sparqlTestApp', ['ngCookies']);

// Define the `PhoneListController` controller on the `phonecatApp` module
phonecatApp
    .controller('SparqlTestController', ['$scope', '$cookies', function SparqlTestController($scope, $cookies) {
        $scope.lexerOutput = null;
        $scope.parserOutput = null;
        $scope.parseErrorOutput = null;
        $scope.lexerErrorOutput = null;
        $scope.queryInput = $cookies.get('queryInput');

        $scope.codeClick = function () {
            $scope.lexerErrorOutput = null;
            $scope.parserErrorOutput = null;
            var parserInput = $scope.queryInput;
            var parser = new ERSParser();

            try {
                $scope.lexerOutput = parser.showTerminals(parserInput);
            }
            catch (error) {
                $scope.lexerOutput = null;
                $scope.lexerErrorOutput = error;
            }

            try {
                var parserResult = parser.parse(parserInput);
                $scope.parserOutput = parserResult;
            } catch (error) {
                $scope.parserOutput = null;
                $scope.parserErrorOutput = error;
            }

        };

        $scope.queryInputChanged = function () {
            $cookies.put('queryInput', $scope.queryInput);
        }
    }]);