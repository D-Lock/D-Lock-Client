(function() {
  'use strict';

  angular.module('DLock-Configuration', [])
    .value('DEBUG', false)
    .value('VERSION', '1.0.0')

    .value('FIREBASE_CONFIG', {
      "apiKey": "AIzaSyD--ACvhpg6AtGFXhdKwMgn8Lv8Q2oMTT4",
      "authDomain": "d-lock.firebaseapp.com",
      "databaseURL": "https://d-lock.firebaseio.com"
    })
    .value('CLIENTS_REF', 'clients/')
    .value('FILES_REF', 'files/')
    .value('SERVER_URL', 'http://router.dloc.io:1337/')
    .value('PART_DIR', '/.dloc/parts/');
})();
