(function() {
  'use strict';

  angular.module('DLock-Home').
  controller('LoginController', ['$scope', '$state', '$window', '$q', 'AuthenticationService', LoginController]);

  function LoginController($scope, $state, $window, $q, Authentication) {
    $scope.error = "";
    $scope.loginCreds = {
      email: "redbackthomson@gmail.com",
      password: "password"
    };

    var checkMacAddress = function() {
      return new Promise(function(resolve, reject) {
        Authentication.allAddresses.once('value', function(snapshot) {
          var val = snapshot.val();
          var values = Object.keys(val).map(function(key) {
            return val[key].address;
          });

          if(values.indexOf(Authentication.macAddress) === -1) {
            return reject("This device is not configured with this account.");
          }
          resolve();
        });
      });
    };

    function doAsyncSeries(arr) {
      return arr.reduce(function (promise, item) {
        return promise.then(function(result) {
          return doSomethingAsync(result, item);
        });
      }, $q.when(initialValue));
    }

    $scope.login = function() {
      var loginPromises = [
        Authentication.logIn($scope.loginCreds.email, $scope.loginCreds.password),
        Authentication.setMacAddress()
      ];
      
      $q.all(loginPromises).then(function(user){
        return checkMacAddress();
      })
      .then(function() {
        $state.go('home');
      })
      .catch(function(error) {
        if(error.message) {
          $scope.error = error.message;
        } else {
          $scope.error = error;
        }
      });
    };
  }
})();
