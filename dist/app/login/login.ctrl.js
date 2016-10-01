(function() {
  'use strict';

  angular.module('DLock-Home').
  controller('LoginController', ['$scope', '$state', '$window', 'AuthenticationService', LoginController]);

  function LoginController($scope, $state, $window, Authentication) {
    $scope.loginCreds = {
      email: "example@email.com",
      password: "password"
    };

    $scope.login = function() {
      Authentication.logIn($scope.loginCreds.email, $scope.loginCreds.password)
      .then(function(user){
        $state.go('home');
      })
      .catch(function(error) {
        console.error(error.message);
      });
    };
  }
})();
