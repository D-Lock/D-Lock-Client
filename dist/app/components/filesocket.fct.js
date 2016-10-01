(function() {
  'use strict';

  angular.module('DLock-Files')
  .config(FileSocketConfig)
  .service('FileSocket', ['SERVER_URL', 'socketFactory', FileSocket]);

  function FileSocketConfig(socketFactoryProvider) {
    
  }

  function FileSocket(SERVER_URL, socketFactory) {
    var fileSocket = io.connect(SERVER_URL);

    fileSocket = socketFactory({
      ioSocket: fileSocket
    });

    return fileSocket;
  }
})();
