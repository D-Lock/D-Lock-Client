(function() {
  'use strict';

  angular.module('DLock-Home').
  controller('LoginController', ['DEBUG', '$scope', '$state', 'AuthenticationService', 'UserSettingsService', LoginController]);

  function LoginController(DEBUG, $scope, $state, Authentication, UserSettings) {
    $scope.error = "";

    $scope.loginCreds = {
      email: "",
      password: (DEBUG ? "password" : "") // Load debugging password
    };

    // Get the username as previously saved
    UserSettings.getLoginUsername().then(function(val) {
      $scope.loginCreds.email = val;
    });

    $scope.saveCreds = function() {
      UserSettings.setLoginUsername($scope.loginCreds.email);
    };

    $scope.login = function() {     
      Authentication.logIn($scope.loginCreds.email, $scope.loginCreds.password)
      .then(function(){
        $state.go('home');
      })
      .catch(function(error) {
        // Ensure the user is not still logged in
        if(error.message) {
          $scope.error = error.message;
        } else {
          $scope.error = error;
        }
        if(!$scope.$$phase) {
          $scope.$apply();
        }
      });
    };
  }
})();
