(function() {
  'use strict';

  angular.module('DLock-Files', ['DLock-Configuration', 'DLock-Authentication', 'firebase']).
  service('FileService', ['FIREBASE_CONFIG', FileService]);

  function FileService(FIREBASE_CONFIG) {
    var service = {};

    return service;
  }
})();
