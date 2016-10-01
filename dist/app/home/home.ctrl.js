(function() {
  'use strict';

  angular.module('DLock-Home', ['DLock-Authentication', 'DLock-Files']).
  controller('HomeController', ['$scope', '$state', 'AuthenticationService', HomeController]);

  function HomeController($scope, $state, Authentication) {
    $scope.loggedIn = Authentication.loggedIn;
    $scope.user = Authentication.user;
    $scope.logOut = Authentication.logOut;
    $scope.logIn = function() {
      $state.go('login');
    };
  }
})();
