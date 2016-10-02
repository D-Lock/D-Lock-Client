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

    service.requestFile = function(hash) {
      FileSocket.emit('request.file', hash);
    };

    FileSocket.on('request.part', function(params) {
      fs.readFile(partsDir + params.fileName, function(err, data) {
        if (err) return console.error(err);
        service.sendPart(params.hash, params.userId, params.fileName, partsDir + params.fileName);
      });
    });

    service.sendFile = function(file) {
      file.params = {
        mode: 'upload'
      };
      delivery.send(file);
    };

    service.sendPart = function(hash, userId, fileName, filePath) {
      var part = {
        name: fileName,
        path: filePath,
        params: {
          mode: 'part',
          hash: hash
        }
      };
      delivery.send(part);
    };

    delivery.on('receive.success', function(file) {
      if(file.params.mode === "download") {
        fs.writeFile($window.home + "/Downloads/" + file.name, file.buffer, function(err) {
          if (err) return console.error(err);
        });
      } else if (file.params.mode === "part") {
        mkdir(partsDir, function(err) {
          if (err) return console.error(err);

          fs.writeFile(partsDir + file.name, file.buffer, function(err) {
            if (err) return console.error(err);
          });
        });
      }
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

    FileSocket.on('request.part', function(fileName) {

    });
    
    service.authenticateUser = function(user) {
      FileSocket.emit('user.info', user);
      service.isAuthenticated = true;
    }

    return service;
  }
})();
