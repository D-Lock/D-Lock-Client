(function() {
  'use strict';

  angular.module('DLock-Files').
  service('FileCryptoService', ['$crypto', FileCryptoService]);

  function FileCryptoService($crypto) {
    var service = {};
    service.key = "DLockDefaultKey";
    
    service.encrypt = function(fileData) {
      return $crypto.encrypt(fileData, this.key);
    };

    service.decrypt = function(encryptedFileData) {
      return $crypto.decrypt(encryptedFileData, this.key);
    };

    return service;
  }
})();
