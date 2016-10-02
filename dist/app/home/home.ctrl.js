(function() {
  'use strict';

  angular.module('DLock-Home', ['DLock-Authentication', 'DLock-Files', 'DLock-Utilities']).
  controller('HomeController', ['SERVER_URL', '$scope', '$state', '$window', 'AuthenticationService', 'FileService', HomeController]);

  function HomeController(SERVER_URL, $scope, $state, $window, Authentication, FileService) {
    $scope.loggedIn = Authentication.loggedIn;
    $scope.user = Authentication.user;
    $scope.logOut = Authentication.logOut;
    $scope.logIn = function() {
      $state.go('login');
    };

    $scope.upload = function() {
      var file = document.getElementById('fileInput').files[0];
      FileService.sendFile(file);
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
        FileService.authenticateUser({
          email: $scope.user.email,
          mac: Authentication.macAddress
        });
      });
    }
  }
})();
