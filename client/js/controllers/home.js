angular.module('projectx.controllers')
.controller('HomeCtrl', ['$scope', 'Transactions', function($scope, Transactions){
  $scope.transactions = Transactions.list();
  $scope.transactions.$loaded(function() {
    console.log("Loaded"); 
  })
}]);