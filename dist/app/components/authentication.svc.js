(function() {
  'use strict';

  angular.module('DLock-Authentication', ['DLock-Configuration', 'firebase']).
  service('AuthenticationService', ['FIREBASE_CONFIG', 'CLIENTS_REF', '$window', AuthenticationService]);

  function AuthenticationService(FIREBASE_CONFIG, CLIENTS_REF, $window) {
    firebase.initializeApp(FIREBASE_CONFIG);
    var auth = firebase.auth();
    var db = firebase.database();
    var service = {};

    service.macAddress = undefined;

    service.loggedIn = false;
    service.user = null;

    //Public method for logging in
    service.logIn = function(email, password) {
      var signIn = auth.signInWithEmailAndPassword(email, password);
      signIn.then(function(user) {
        service.loggedIn = true;
        service.user = user;

        service.onlineAddresses = db.ref(CLIENTS_REF).child(service.user.uid).child("online");
        service.allAddresses = db.ref(CLIENTS_REF).child(service.user.uid).child("all");
      });
      signIn.catch(function(error) {
        service.loggedIn = false;
      });
      return signIn;
    };

    service.register = function(email, password) {
      var signUp = auth.createUserWithEmailAndPassword(email, password);
      signUp.catch(function (error) {
        console.error(error.code);
        console.error(error.message);
      });
      return signUp;
    }

    service.forgot = function(email){
      var reset = auth.sendPasswordResetEmail(email);
      reset.catch(function (error) {
        console.error(error.code);
        console.error(error.message);
      });
      return reset;
    }

    //When the user is now logged in
    auth.onAuthStateChanged(function(user) {
      service.loggedIn = !!user;
      service.macAddress = $window.mac;
      if(!service.macAddress) {
        throw "MAC Address is not in the global scope";
      }
      //Put their MAC address on the online list
      service.onlineAddresses.push(service.macAddress);
    });

    //When the user closes the window
    service.logOut = function() {
      if(!macAddress) return auth.signOut();

      //Remove the client from the online list
      service.onlineAddresses.once("value").then(function(snapshot) {
        snapshot.forEach(function(macObj) {
          var mac = macObj.val();
          if(mac === macAddress) {
            userClients.child(macObj.key).remove().then(function() {
              auth.signOut();
            });
          }
        });
      });
    };

    return service;
  }
})();
