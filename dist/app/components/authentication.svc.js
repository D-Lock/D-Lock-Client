(function() {
  'use strict';

  angular.module('DLock-Authentication').
  service('AuthenticationService', ['FirebaseService', 'CLIENTS_REF', '$window', AuthenticationService]);

  function AuthenticationService(FirebaseService, CLIENTS_REF, $window) {
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

      if(!service.loggedIn) return;
      service.macAddress = $window.mac;
      if(!service.macAddress) {
        throw "MAC Address is not in the global scope";
      }
      //Put their MAC address on the online list
      service.onlineAddresses.push(service.macAddress);
    });

    //When the user closes the window
    service.logOut = function() {
      return new Promise(function(resolve, reject) {
        if(typeof service.macAddress === "undefined") {
          auth.signOut();
          service.macAddress = undefined;
          service.loggedIn = false;
          service.user = null;

          resolve();
        }

        //Remove the client from the online list
        service.onlineAddresses.once("value").then(function(snapshotObj) {
          var snapshot = snapshotObj.val();
          var snapshotKeys = Object.keys(snapshot);

          for(var i = 0; i < snapshotKeys.length; i++) {
            var key = snapshotKeys[i];
            if(snapshot[key] === service.macAddress) {
              service.onlineAddresses.child(key).remove().then(function() {
                auth.signOut();

                service.macAddress = undefined;
                service.loggedIn = false;
                service.user = null;

                resolve();
              });
            }
          }
        });
      });
    };

    return service;
  }
})();
