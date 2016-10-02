(function() {
  'use strict';

  angular.module('DLock-Home', ['DLock-Authentication', 'DLock-Files', 'DLock-Utilities', 'angular-md5']).
  controller('HomeController', ['SERVER_URL', '$scope', '$state', '$window', 'AuthenticationService', 'FileService', 'md5', HomeController]);

  function HomeController(SERVER_URL, $scope, $state, $window, Authentication, FileService, MD5) {
    $scope.files = undefined;

    $scope.loggedIn = Authentication.loggedIn;
    $scope.user = Authentication.user;
    $scope.online = false;

    $scope.logIn = function() {
      $state.go('login');
    };

    $scope.logOut = function() {
      Authentication.logOut().then(function() {
        $scope.loggedIn = Authentication.loggedIn;
        $scope.user = Authentication.user;
        $scope.$apply();
      });
    }

    $scope.upload = function() {
      var file = document.getElementById('fileInput').files[0];
      FileService.sendFile(file);
    };

    //Check for online address changes
    if($scope.loggedIn) {
      Authentication.onlineAddresses.on('value', checkOnlineMACS);
      FileService.getFiles($scope.user.uid, function(filesObj) {
        var files = filesObj.val();
        if(files !== null) {
          files = Object.keys(files).map(function(key) {
            var file = files[key];
            file.hash = key;
            return file;
          });
          $scope.files = files;
        } else {
          $scope.files = undefined;
        }
        $scope.$apply();
      });
      $scope.userAvatar = "https://www.gravatar.com/avatar/" + MD5.createHash($scope.user.email.toLowerCase());
    }

    $scope.requestFile = FileService.requestFile;

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
      if(!online) {
        $scope.online = false;
        $scope.$apply();
        return;
      }
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
          $scope.online = false;
          $scope.$apply();
          return;
        }

        //Ensure that all of the MAC addresses are in the list
        console.log(onlineValues, totalValues);
        for(var i = 0; i < totalValues.length; i++) {
          var index = onlineValues.indexOf(totalValues[i]);
          if(index === -1) {
            $scope.online = false;
            $scope.$apply();
            return;
          }

          onlineValues.splice(index, 1);
        }

        if(onlineValues.length !== 0 && totalValues.length !== 0)
        {
          $scope.online = false;
          $scope.$apply();
          return;
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
