(function() {
  'use strict';

  angular.module('DLock-Home').
  controller('RegisterController', ['$scope', '$state', '$window', 'AuthenticationService', RegisterController]);

  function RegisterController($scope, $state, $window, Authentication) {
    $scope.registerCreds = {
      email: "test@test.com",
      password: "password"
    };

    $scope.errorText = undefined;

    $scope.signup = function(){
    	Authentication.register($scope.registerCreds.email, $scope.registerCreds.password)
      .then(function(user){
        $state.go('login');
      })
      .catch(function(error) {
        console.error(error.message);
      	$scope.errorText = error.message;
      });
    }
  }*
})();
