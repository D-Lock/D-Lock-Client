(function() {
  'use strict';

  angular.module('DLock-Files', ['DLock-Configuration', 'DLock-Authentication', 'firebase', 'btford.socket-io']).
  service('FileService', ['FIREBASE_CONFIG', 'FileSocket', FileService]);

  function FileService(FIREBASE_CONFIG, FileSocket) {
    var service = {};
    service.isConnected = false;
    service.isAuthenticated = false;

    FileSocket.on('connect', function(ev, data) {
      service.isConnected = true;
    });

    FileSocket.on('disconnect', function(ev, data) {
      service.isConnected = false;
    });
    
    service.authenticateUser = function(user) {
      FileSocket.emit('user.info', user);
      service.isAuthenticated = true;
    }

    service.sendFiles = function() {

    }

    return service;
  }
})();
