(function() {
  'use strict';

  angular.module('DLock-Home').
  controller('SplashController', ['SERVER_URL', 'VERSION', '$scope', '$state', 'FileSocket', 'UserSettingsService', SplashController]);

  function SplashController(SERVER_URL, VERSION, $scope, $state, FileSocket, UserSettings) {
    $scope.status = "Connecting...";
    $scope.version = VERSION;

    FileSocket.on('connect', function(){
      console.log("Connected to file socket at " + SERVER_URL + "!");

      UserSettings.getFirstRun()
      .then(function(firstRun) {
        // If it's their first time, go to the first-run view
        if(firstRun) {
          $state.go('first.register');
        } else {
          $state.go('index.login');
        }
      });
    });
  }
})();
