(function() {
  'use strict';

  angular.module('DLock-Home', ['DLock-Authentication', 'DLock-Files']).
  controller('HomeController', ['$scope', 'AuthenticationService', HomeController]);

  function HomeController($scope, Authentication) {
    $scope.user = Authentication.user;
    $scope.logOut = Authentication.logOut;
  }
})();
