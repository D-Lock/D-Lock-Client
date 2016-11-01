(function() {
  'use strict';

  angular.module('DLock-Home').
  controller('SettingsController', ['$scope', '$state', '$window', 'AuthenticationService', SettingsController]);

  function SettingsController($scope, $state, $window, Authentication) {
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
  }
})();
