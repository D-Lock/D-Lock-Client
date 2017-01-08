(function() {
  'use strict';

  angular.module('DLock-Home').
  controller('SplashController', ['SERVER_URL', 'VERSION', '$scope', '$state', 'FileSocket', SplashController]);

  function SplashController(SERVER_URL, VERSION, $scope, $state, FileSocket) {
    $scope.status = "Connecting...";
    $scope.version = VERSION;

    FileSocket.on('connect', function(){
      console.log("Connected to file socket at " + SERVER_URL + "!");
      $state.go('index');
    });
  }
})();
