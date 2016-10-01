(function() {
  'use strict';

  angular.module('DLock-Authentication', ['DLock-Configuration', 'firebase']).
  service('AuthenticationService', ['FIREBASE_URL', '$firebaseAuth', AuthenticationService]);

  function AuthenticationService(FIREBASE_URL, $firebaseAuth) {
    var ref = new Firebase(FIREBASE_URL);
  }
})();
