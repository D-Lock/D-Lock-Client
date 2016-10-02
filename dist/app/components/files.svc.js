(function() {
  'use strict';

  angular.module('DLock-Files', ['DLock-Configuration', 'DLock-Authentication', 'firebase', 'btford.socket-io']).
  service('FileService', ['FILES_REF', 'FirebaseService', '$window', 'FileSocket', FileService]);

  function FileService(FILES_REF, FirebaseService, $window, FileSocket) {
    var db = firebase.database();
    var service = {};
    service.isConnected = false;
    service.isAuthenticated = false;

    var DeliveryClient = $window.deliveryClient;
    var DeliveryServer = $window.DeliveryServer;

    var delivery = new DeliveryClient(FileSocket);

    service.getFiles = function(uid, cb) {
      db.ref(FILES_REF).child(uid).once('value').then(function(filesObj) {
        var files = filesObj.val();
        files = Object.keys(files).map(function(key) {
          return files[key];
        });
        cb(files);
      });
    };

    service.sendFile = function(file) {
      delivery.send(file);
    };

    delivery.on('receive.start', function() {
      console.log('started receiving');
    });

    delivery.on('receive.success', function(file) {
      console.log(file.name);
      console.log(file.buffer);
    });

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

    return service;
  }
})();
