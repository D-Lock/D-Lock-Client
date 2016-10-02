(function() {
  'use strict';

  angular.module('DLock-Home', ['DLock-Authentication', 'DLock-Files', 'DLock-Utilities']).
  controller('HomeController', ['SERVER_URL', '$scope', '$state', '$window', 'AuthenticationService', 'FileService', HomeController]);

  function HomeController(SERVER_URL, $scope, $state, $window, Authentication, FileService) {
    $scope.files = undefined;

    $scope.loggedIn = Authentication.loggedIn;
    $scope.user = Authentication.user;
    $scope.logOut = Authentication.logOut;
    $scope.allConnected = false;

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
      $scope.files = FileService.getFiles($scope.user.uid);
    }

    function checkOnlineMACS(onlineObj) {
      var online = onlineObj.val();
      var onlineValues = Object.keys(online).map(function(key) {
        return online[key];
      });
      //Get the list of total devices
      Authentication.allAddresses.once('value').then(function(allObj) {
        var all = allObj.val();

        var totalValues = Object.keys(all).map(function(key) {
          return all[key];
        });
        if(totalValues.length > onlineValues.length) {
          return $scope.allConnected = false;
        }

        //Ensure that all of the MAC addresses are in the list
        for(var i = 0; i < totalValues.length; i++) {
          if(onlineValues.indexOf(totalValues[i]) === -1) {
            return $scope.allConnected = false;
          }
        }

        console.log("All clients connected");
        console.log("Authenticating to server");
        FileService.authenticateUser({
          id: $scope.user.uid,
          mac: Authentication.macAddress
        });
        $scope.allConnected = true;
      });
    }
  }
})();
