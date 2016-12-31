(function() {
  'use strict';

  angular.module('DLock-Home').
  controller('ForgotController', ['$scope', '$state', 'AuthenticationService', ForgotController]);

  function ForgotController($scope, $state, Authentication) {
    $scope.forgotCreds = {
      email: ""
    };

    $scope.errorText = undefined;

    $scope.forgot = function(){
    	Authentication.forgot($scope.forgotCreds.email)
      .then(function(user){
        $state.go('index.login');
      })
      .catch(function(error) {
        console.error(error.message);
      	$scope.errorText = error.message;
      });
    }
  }
})();
