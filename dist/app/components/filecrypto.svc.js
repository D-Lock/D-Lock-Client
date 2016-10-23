(function() {
  'use strict';

  angular.module('DLock-Files').
  service('FileCryptoService', ['$crypto', FileCryptoService]);

  function FileCryptoService($crypto) {
    var service = {};
    
    service.encrypt = function(fileData, key) {
      return $crypto.encrypt(fileData, key);
    };

    service.decrypt = function(encryptedFileData, key) {
      return $crypto.decrypt(encryptedFileData, key);
    };

    return service;
  }
})();
