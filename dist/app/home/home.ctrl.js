(function() {
  'use strict';

  angular.module('DLock-Home').
  controller('HomeController', ['$scope', '$state', '$window', 'AuthenticationService', 'FileService', 'md5', HomeController]);

  function HomeController($scope, $state, $window, Authentication, FileService, MD5) {
    $scope.files = {};
    $scope.selectedDirectory = undefined;

    $scope.loggedIn = Authentication.loggedIn;
    $scope.user = Authentication.user;
    $scope.online = false;

    $scope.upload = function() {
      var file = document.getElementById('fileUpload').files[0];
      FileService.sendFile(file, $scope);
    };

    var authenticate = function() {
      Authentication.onlineAddresses.on('value', checkOnlineMACS);
      FileService.getFiles($scope.user.uid, function(filesObj) {
        createFileTree(filesObj);
      });
      $scope.userAvatar = "https://www.gravatar.com/avatar/" + MD5.createHash($scope.user.email.toLowerCase());
    };

    if(Authentication.loggedIn) {
      authenticate();
    }

    $scope.isDirectory = function(file) {
      return file.isArray;
    }

    function createFileTree(filesObj) {
      var files = filesObj.val();
      if(files === null) {
        $scope.files = undefined;
        $scope.$apply();
        return;
      }

      //Map all the hashes inside the file objects
      files = Object.keys(files).map(function(key) {
        var file = files[key];
        file.hash = key;
        return file;
      });

      var recurse = function(parent, path, file) {
        var slash = path.indexOf('/');
        if(slash !== -1) {
          //The name of the directory
          var dir = path.substr(0, slash);

          //The new path within the directory
          var newPath = path.substr(slash + 1);

          //Create the new directory
          if(!(dir in parent)) {
            parent[dir] = [];
          }
          return recurse(parent[dir], newPath, file);
        }

        parent[path] = file;
      };

      $scope.files.length = 0;
      for(var i = 0; i < files.length; i++) {
        recurse($scope.files, files[i].path, files[i]);
      }
      $scope.$apply();
    };

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
