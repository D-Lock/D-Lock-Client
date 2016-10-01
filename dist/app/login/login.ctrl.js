(function() {
  'use strict';

  angular.module('DLock-Home').
  controller('LoginController', ['$scope', '$location', '$window', 'AuthenticationService', LoginController]);

  function LoginController($scope, $location, $window, Authentication) {
    $scope.loginCreds = {
      email: "example@email.com",
      password: "password"
    };

    $scope.login = function() {
      Authentication.logIn($scope.loginCreds.email, $scope.loginCreds.password)
      .then(function(user){
        console.log("Going to home");
        $location.path('/');
      })
      .catch(function(error) {
        console.error(error.message);
      });
    };
  }
})();
