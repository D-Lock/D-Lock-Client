(function() {
  'use strict';

  angular.module('DLock-Home').
  controller('ForgotController', ['$scope', '$state', '$window', 'AuthenticationService', ForgotController]);

  function ForgotController($scope, $state, $window, Authentication) {
    $scope.forgotCreds = {
      email: "",
    };

    $scope.errorText = undefined;

    $scope.forgot = function(){
    	Authentication.forgot($scope.forgotCreds.email)
      .then(function(user){
        $state.go('login');
      })
      .catch(function(error) {
        console.error(error.message);
      	$scope.errorText = error.message;
      });
    }
  }
})();
