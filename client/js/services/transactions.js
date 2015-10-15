angular.module('projectx.services')
.factory('Transactions', ['$firebaseObject', '$firebaseArray', function($firebaseObject, $firebaseArray){
  
  var rootRef = new Firebase("https://projectexe.firebaseio.com");
  var transactionRef = rootRef.child('transactions');
  
  return {
    list: function() {
      return $firebaseArray(transactionRef)
    },
    get: function(id) {
      return $firebaseObject(transactionRef.child(id))
    }
  }

}])