(function() {
  'use strict';

  angular.module('DLock-Configuration', [])
    .value('FIREBASE_CONFIG', {
      apiKey: "",
      authDomain: "",
      databaseURL: ""
    })
    .value('CLIENTS_REF', 'clients/')
    .value('FILES_REF', 'files/')
    .value('SERVER_URL', 'http://localhost:1337/')
    .value('PART_DIR', '/.dloc/parts/')
    .value('CRYPTO_KEY', 'ABCD1234');
})();
