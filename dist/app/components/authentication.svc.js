(function() {
  'use strict';

  angular.module('DLock-Authentication', ['DLock-Configuration', 'firebase']).
  service('AuthenticationService', ['FIREBASE_CONFIG', 'CLIENTS_REF', '$window', AuthenticationService]);

  function AuthenticationService(FIREBASE_CONFIG, CLIENTS_REF, $window) {
    firebase.initializeApp(FIREBASE_CONFIG);
    var auth = firebase.auth();
    var db = firebase.database();
    var service = {};
    var macAddress = undefined;

    service.loggedIn = false;
    service.user = null;

    //Public method for logging in
    service.logIn = function(email, password) {
      var signIn = auth.signInWithEmailAndPassword(email, password);
      signIn.then(function(user) {
        service.loggedIn = true;
        service.user = user;
      });
      signIn.catch(function(error) {
        service.loggedIn = false;
      });
      return signIn;
    };

    //When the user is now logged in
    auth.onAuthStateChanged(function(user) {
      service.loggedIn = !!user;
      macAddress = $window.mac;
      if(!macAddress) {
        throw "MAC Address is not in the global scope";
      }
      //Put their MAC address on the online list
      db.ref(CLIENTS_REF).child(service.user.uid).child("online").push(macAddress);
    });

    //When the user closes the window
    service.logOut = function() {
      if(!macAddress) return auth.signOut();

      var userClients = db.ref(CLIENTS_REF).child(service.user.uid).child("online");
      //Remove the client from the online list
      userClients.once("value").then(function(snapshot) {
        for(var i = 0; i < snapshot.length; i++) {
          var mac = macObj.val();
          if(mac === macAddress) {
            userClients.child(macObj.key).remove();
            return auth.signOut();
          }
        }
      });

    };

    return service;
  }
})();
