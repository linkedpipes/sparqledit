// Define the `phonecatApp` module
var phonecatApp = angular.module('sparqlTestApp', []);

// Define the `PhoneListController` controller on the `phonecatApp` module
phonecatApp.controller('SparqlTestController', function SparqlTestController($scope,$http) {
    $scope.textOutput = "hello";
    $scope.codeClick = function () {
        $http.get('test').success(function (data) {
            console.log("success!");
            $scope.textOutput = data;
        })
    };
});