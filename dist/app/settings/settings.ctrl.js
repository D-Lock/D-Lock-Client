(function() {
  'use strict';

  angular.module('DLock-Home').
  controller('SettingsController', ['$scope', '$state', '$window', 'AuthenticationService', SettingsController]);

  function SettingsController($scope, $state, $window, Authentication) {
  	$scope.clients = undefined;

    $scope.loggedIn = Authentication.loggedIn;

    if($scope.loggedIn) {
      Authentication.allAddresses.on('value', getClientList);
    }

		function getClientList(onlineObj) {
		  var clientList = onlineObj.val();

		  var clientValues = Object.keys(clientList).map(function(key) {
		    return clientList[key];
		  });
		  $scope.clients = clientValues;
		  $scope.$apply();
		}
  }
})();
