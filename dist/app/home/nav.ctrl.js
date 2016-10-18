(function() {
  'use strict';

  angular.module('DLock-Home').
  controller('NavController', ['$scope', '$state', 'AuthenticationService', NavController]);

  function NavController($scope, $state, AuthenticationService) {
    $scope.user = null;
    $scope.loggedIn = false;
    
    $scope.$watch(function() {
      return AuthenticationService.user;
    }, function(user) {
      $scope.user = user;
      $scope.loggedIn = AuthenticationService.loggedIn;
    });

    $scope.logOut = function() {
      AuthenticationService.logOut().then(function() {
        $scope.loggedIn = AuthenticationService.loggedIn;
        $scope.user = AuthenticationService.user;
        $scope.$apply();

        $state.go('index');
      });
    }
  }
})();
