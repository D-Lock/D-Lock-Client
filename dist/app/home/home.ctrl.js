(function() {
  'use strict';

  angular.module('DLock-Home').
  controller('HomeController', ['$scope', '$state', '$window', 'AuthenticationService', 'FileService', 'md5', HomeController]);

  function HomeController($scope, $state, $window, Authentication, FileService, MD5) {
    $scope.files = {};
    $scope.selectedFile = undefined;

    $scope.loggedIn = Authentication.loggedIn;
    $scope.user = Authentication.user;
    $scope.online = false;

    $scope.upload = function() {
      var file = document.getElementById('fileUpload').files[0];
      FileService.sendFile(file, $scope);
    };

    $scope.selectFile = function(newFile) {
      $scope.selectedFile = newFile;
    };

    var authenticate = function() {
      Authentication.onlineAddresses.on('value', checkOnlineMACS);
      FileService.getFiles($scope.user.uid, function(filesObj) {
        $scope.files = filesObj;
        $scope.$apply();
      });
      $scope.userAvatar = "https://www.gravatar.com/avatar/" + MD5.createHash($scope.user.email.toLowerCase());
    };

    if(Authentication.loggedIn) {
      authenticate();
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
