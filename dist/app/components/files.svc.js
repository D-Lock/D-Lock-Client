(function() {
  'use strict';

  angular.module('DLock-Files', ['DLock-Configuration', 'DLock-Authentication', 'firebase', 'btford.socket-io']).
  service('FileService', ['FILES_REF', 'PART_DIR', 'FirebaseService', '$window', 'FileSocket', FileService]);

  function FileService(FILES_REF, PART_DIR, FirebaseService, $window, FileSocket) {
    var db = firebase.database();
    var service = {};
    service.isConnected = false;
    service.isAuthenticated = false;

    var DeliveryClient = $window.deliveryClient;
    var fs = $window.fs;
    var mkdir = $window.mkdir;
    var partsDir = $window.home + PART_DIR;

    var delivery = new DeliveryClient(FileSocket);

    service.getFiles = function(uid, cb) {
      db.ref(FILES_REF).child(uid).on('value', cb);
    };

    service.sendFile = function(file) {
      file.params = {
        mode: 'upload'
      };
      delivery.send(file);
    };

    delivery.on('receive.start', function() {
      console.log('started receiving');
    });

    delivery.on('receive.success', function(file) {
      mkdir(partsDir, function(err) {
        if (err) return console.error(err);

        fs.writeFile(partsDir + file.name, file.buffer, function(err) {
          if (err) return console.error(err);
        });
      });
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
