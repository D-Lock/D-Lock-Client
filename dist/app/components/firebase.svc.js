(function() {
  'use strict';

  angular.module('DLock-Utilities', ['DLock-Configuration'])
  .service('FirebaseService', ['FIREBASE_CONFIG', FirebaseService]);

  function FirebaseService(FIREBASE_CONFIG) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }
})();
