(function() {
  'use strict';

  angular.module('DLock-Home', ['DLock-Authentication', 'DLock-Files']).
  controller('HomeController', ['$scope', '$state', 'AuthenticationService', 'FileService', HomeController]);

  function HomeController($scope, $state, Authentication, FileService) {
    $scope.loggedIn = Authentication.loggedIn;
    $scope.user = Authentication.user;
    $scope.logOut = Authentication.logOut;
    $scope.logIn = function() {
      $state.go('login');
    };

    //Check for online address changes
    if($scope.loggedIn) {
      Authentication.onlineAddresses.on('value', checkOnlineMACS);
    }

    function checkOnlineMACS(onlineObj) {
      var online = onlineObj.val();
      //Get the list of total devices
      Authentication.allAddresses.once('value').then(function(allObj) {
        var all = allObj.val();

        if(all.length > online.length) return;

        //Ensure that all of the MAC addresses are in the list
        for(var i = 0; i < all.length; i++) {
          if(online.indexOf(all[i]) === -1) {
            return;
          }
        }

        console.log("All clients connected");
        console.log("Authenticating to server");
        console.log(Authentication.macAddress);
        FileService.authenticateUser({
          email: $scope.user.email,
          mac: Authentication.macAddress
        });
      });
    }
  }
})();
