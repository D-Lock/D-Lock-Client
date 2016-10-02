(function() {
  'use strict';

  angular.module('DLock-Configuration', [])
    .value('FIREBASE_CONFIG', {
      apiKey: "AIzaSyD--ACvhpg6AtGFXhdKwMgn8Lv8Q2oMTT4",
      authDomain: "d-lock.firebaseapp.com",
      databaseURL: "https://d-lock.firebaseio.com"
    })
    .value('CLIENTS_REF', 'clients/')
    .value('FILES_REF', 'files/')
    .value('SERVER_URL', 'http://localhost:1337/')
    .value('PART_DIR', '/.dloc/parts/');
})();
