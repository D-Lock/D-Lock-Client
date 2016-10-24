(function() {
  //Service Modules
  angular.module('DLock-Utilities', ['DLock-Configuration']);
  angular.module('DLock-Authentication', ['DLock-Configuration', 'DLock-Utilities', 'firebase']);
  angular.module('DLock-Files', ['DLock-Configuration', 'DLock-Authentication', 'firebase', 'btford.socket-io', 'mdo-angular-cryptography', 'filereader']);

  //Controller Modules
  angular.module('DLock-Home', ['DLock-Authentication', 'DLock-Files', 'DLock-Utilities', 'angular-md5']);
})();
