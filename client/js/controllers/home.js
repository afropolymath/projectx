angular.module('projectx.controllers')
.controller('HomeCtrl', ['$scope', 'Transactions', function($scope, Transactions){
  $scope.transactions = Transactions.list();
  
  $scope.selectedIndex = null;

  $scope.transactions.$loaded(function() {
    console.log("Loaded"); 
  })

  $scope.show = function($index) {
    $scope.selectedIndex = $index;
  };

  $scope.isSelected = function($index) {
    return $scope.selectedIndex === $index;
  };

  $scope.confirmTransaction = function($key, $historyKey) {
    var transaction = $scope.transactions.$getRecord($key);
    transaction.status = true;
    transaction.history[$historyKey].verified = true;
    $scope.transactions.$save(transaction).then(function() {
      console.log("Updated");
    })
  };

}]);