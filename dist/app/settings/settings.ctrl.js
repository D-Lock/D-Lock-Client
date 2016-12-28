(function() {
  'use strict';

  angular.module('DLock-Home').
  controller('SettingsController', ['$scope', '$state', '$window', 'AuthenticationService', 'UserSettingsService', SettingsController]);

  function SettingsController($scope, $state, $window, Authentication, Settings) {
    $scope.clients = [];

    if(Authentication.loggedIn) {
      Authentication.allAddresses.on('value', function(res) {
        saveListToScope(res, 'allClients');
      });

      Authentication.onlineAddresses.on('value', function(res) {
        saveListToScope(res, 'onlineClients');
      });
    }

    function saveListToScope(deviceObj, scopeName) {
      var clientList = deviceObj.val();
      var clientValues = Object.keys(clientList).map(function(key) {
        return clientList[key];
      });
      
      $scope[scopeName] = clientValues;
      if(!$scope.$$phase) {
        $scope.$apply();
      }
    }

    //Load in the settings
    Settings.getDownloadLocation()
    .then(function(value) {
      $scope.downloadLocation = value;
    })
    .catch(function(err) {
      //TODO: Handle error appropriately
      $scope.downloadLocation = err;
    });

    $scope.updateDownloadLocation = function() {
      var file = document.getElementById('downloadLocationUpload').files[0];
      var path = file.path;

      Settings.setDownloadLocation(path)
      .then(function(value) {
        $scope.downloadLocation = value;
      })
      .catch(function(err){
        //TODO: Handle error appropriately
        $scope.downloadLocation = err;
      });
    };
  }
})();
