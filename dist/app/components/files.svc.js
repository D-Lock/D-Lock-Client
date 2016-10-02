(function() {
  'use strict';

  angular.module('DLock-Files', ['DLock-Configuration', 'DLock-Authentication', 'firebase', 'btford.socket-io']).
  service('FileService', ['FirebaseService', '$window', 'FileSocket', FileService]);

  function FileService(FirebaseService, $window, FileSocket) {
    var db = firebase.database();
    var service = {};
    service.isConnected = false;
    service.isAuthenticated = false;

    Delivery = $window.delivery;

    var delivery = new Delivery(FileSocket);

    service.getFiles = function() {
      
    };

    service.sendFile = function(file) {
      delivery.send(file);
    };

    delivery.on('send.success',function(fileUID){
      console.log("file was successfully sent.");
    });

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
