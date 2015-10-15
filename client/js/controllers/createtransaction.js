angular.module('projectx.controllers')
.controller('CreateTransactionCtrl', ['$scope', '$state', 'Transactions', function($scope, $state, Transactions){
  var transactions = Transactions.list();
  $scope.create = function() {
    $scope.transaction.status = false;
    $scope.transaction.date = Date.now();
    transactions.$add($scope.transaction);
    $state.go('home');
  };
}]);