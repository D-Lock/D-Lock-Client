(function() {
  'use strict';

  angular.module('DLock-Files').
  service('FileService', ['FILES_REF', 'PART_DIR', '$window', 'UserSettingsService', 'FirebaseService', 'FileSocket', 'FileCryptoService', 'FileDeliveryService', FileService]);

  function FileService(FILES_REF, PART_DIR, $window, UserSettingsService, FirebaseService, FileSocket, FileCrypto, FileDelivery) {
    var db = firebase.database();
    var service = {};
    service.isConnected = false;

    var fs = $window.fs;
    var mkdir = $window.mkdir;
    var partsDir = $window.home + PART_DIR;

    FileDelivery.configure(FileSocket);

    service.getFiles = function(uid, cb) {
      db.ref(FILES_REF).child(uid).on('value', cb);
    };

    service.requestFile = function(hash) {
      FileSocket.emit('request.file', hash);
    };

    FileSocket.on('request.part', function(params) {
      fs.readFile(partsDir + params.fileName, function(err, data) {
        if (err) return console.error(err);
        service.sendPart(params.hash, params.userId, params.fileName, partsDir + params.fileName, data);
      });
    });

    service.sendFile = function(file) {
      FileDelivery.sendFile(file, {});
    };

    service.sendPart = function(hash, userId, fileName, filePath, fileData) {
      var part = {
        name: fileName,
        path: filePath,
      };
      var params = {
        mode: 'part',
        hash: hash
      };
      var base64Data = fileData.toString('base64');
      FileDelivery.sendPart(part, params, base64Data);
    };

    FileDelivery.on('receive.part', function(filePackage) {
      mkdir(partsDir, function(err) {
        if (err) return console.error(err);

        var buffer = new Buffer(filePackage.data, 'base64');
        fs.writeFile(partsDir + filePackage.name, buffer, function(err) {
          if (err) return console.error(err);
        });
      });
    });

    FileDelivery.on('receive.file', function(filePackage) {
      var decrypted = FileCrypto.decrypt(filePackage.data);
      var buffer = new Buffer(decrypted, 'base64');
      UserSettingsService.getDownloadLocation().then(function(loc) {
        fs.writeFile(loc + "/" + filePackage.name, buffer, function(err) {
          if (err) return console.error(err);
        });
      })
    });

    FileDelivery.on('success.file',function(){
      console.log("File was successfully sent.");
    });

    FileSocket.on('connect', function(ev, data) {
      service.isConnected = true;
    });

    FileSocket.on('disconnect', function(ev, data) {
      service.isConnected = false;
    });

    return service;
  }
})();
