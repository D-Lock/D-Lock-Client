(function() {
  'use strict';

  angular.module('DLock-Home').
  controller('NavController', ['$scope', 'AuthenticationService', NavController]);

  function NavController($scope, AuthenticationService) {
    $scope.user = null;
    $scope.loggedIn = false;
    
    $scope.$watch(function() {
      return AuthenticationService.user;
    }, function(user) {
      $scope.user = user;
      $scope.loggedIn = AuthenticationService.loggedIn;
    });
  }
})();
