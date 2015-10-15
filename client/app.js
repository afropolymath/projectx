'use strict'

angular.module('projectx.controllers', []);
angular.module('projectx.services', []);

require('./js/controllers/home.js');
require('./js/controllers/createtransaction.js');

require('./js/services/transactions.js');

window.ProjectX = angular.module('ProjectX', [
  'ngCookies',
  'ui.router',
  'firebase',
  'projectx.services',
  'projectx.controllers'
]);

ProjectX.config(['$stateProvider','$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/error_404');
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'partials/home.html',
      controller: 'HomeCtrl'
    })
    .state('create-transaction', {
      url: '/create-transaction',
      templateUrl: 'partials/create-transaction.html',
      controller: 'CreateTransactionCtrl'
    });
}]);