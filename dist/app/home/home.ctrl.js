(function() {
  'use strict';

  angular.module('DLock-Home').
  controller('HomeController', ['$scope', '$state', '$window', 'AuthenticationService', 'FileService', 'md5', HomeController]);

  function HomeController($scope, $state, $window, Authentication, FileService, MD5) {
    var hookedOnlineAddresses = false;

    $scope.files = {};
    $scope.selectedFile = undefined;

    $scope.loggedIn = Authentication.loggedIn;
    $scope.user = Authentication.user;
    $scope.online = Authentication.online;

    $scope.userAvatar = "https://www.gravatar.com/avatar/" + 
      MD5.createHash($scope.user.email.toLowerCase());

    $scope.upload = function() {
      var file = document.getElementById('fileUpload').files[0];
      FileService.sendFile(file, $scope);
    };

    $scope.selectFile = function(newFile) {
      $scope.selectedFile = newFile;
    };

    var handleOnline = function(online) {
      if(!online) {
        $scope.files = {};
        $scope.selectedFile = undefined;
        return;
      }

      FileService.getFiles($scope.user.uid, function(filesObj) {
        $scope.files = filesObj;
        $scope.$apply();
      });
    }

    handleOnline($scope.online);
    Authentication.onOnline.push(function(online) {
      handleOnline(online);
    });
  }
})();
