(function() {
  'use strict';

  angular.module('DLock-Home', ['DLock-Authentication', 'DLock-Files', 'DLock-Utilities', 'angular-md5']).
  controller('HomeController', ['SERVER_URL', '$scope', '$state', '$window', 'AuthenticationService', 'FileService', 'md5', HomeController]);

  function HomeController(SERVER_URL, $scope, $state, $window, Authentication, FileService, MD5) {
    $scope.files = undefined;

    $scope.loggedIn = Authentication.loggedIn;
    $scope.user = Authentication.user;
    $scope.logOut = Authentication.logOut;
    $scope.online = false;

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
      FileService.getFiles($scope.user.uid, function(filesObj) {
        console.log(filesObj);
        var files = filesObj.val();
        files = Object.keys(files).map(function(key) {
          return files[key];
        });
        $scope.files = files;
        $scope.$apply();
      });
      $scope.userAvatar = "https://www.gravatar.com/avatar/" + MD5.createHash($scope.user.email.toLowerCase());
    }

    $scope.humanFileSize = function(bytes) {
      var thresh = 1000;
      if(Math.abs(bytes) < thresh) {
          return bytes + ' B';
      }
      var units = ['kB','MB','GB','TB','PB','EB','ZB','YB'];
      var u = -1;
      do {
          bytes /= thresh;
          ++u;
      } while(Math.abs(bytes) >= thresh && u < units.length - 1);
      return bytes.toFixed(1)+' '+units[u];
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
          return $scope.online = false;
        }

        //Ensure that all of the MAC addresses are in the list
        for(var i = 0; i < totalValues.length; i++) {
          if(onlineValues.indexOf(totalValues[i]) === -1) {
            return $scope.online = false;
          }
        }

        console.log("All clients connected");
        console.log("Authenticating to server");
        FileService.authenticateUser({
          id: $scope.user.uid,
          mac: Authentication.macAddress
        });
        $scope.online = true;
        $scope.$apply();
      });
    }
  }
})();
