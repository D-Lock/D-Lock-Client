(function() {
  'use strict';

  angular.module('DLock-Authentication').
  service('AuthenticationService', ['CLIENTS_REF', '$window','FirebaseService', 'FileSocket', AuthenticationService]);

  function AuthenticationService(CLIENTS_REF, $window, FirebaseService, FileSocket) {
    var auth = firebase.auth();
    var db = firebase.database();
    var service = {};

    service.macAddress = undefined;

    service.loggedIn = false;
    service.user = null;
    service.online = false;

    service.onOnline = [];

    //Public method for logging in
    service.logIn = function(email, password) {
      var signIn = auth.signInWithEmailAndPassword(email, password);
      signIn.then(function(user) {
        service.loggedIn = true;
        service.user = user;

        service.onlineAddresses = db.ref(CLIENTS_REF).child(service.user.uid).child("online");
        service.allAddresses = db.ref(CLIENTS_REF).child(service.user.uid).child("all");

        service.macAddress = $window.mac;
        if(!service.macAddress) {
          throw "MAC Address is not in the global scope";
        }

        service.authenticateUser({
          id: user.uid,
          mac: service.macAddress
        });
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

      //Put their MAC address on the online list
      service.onlineAddresses.push(service.macAddress);
    });

    //When the user closes the window
    service.logOut = function() {
      return new Promise(function(resolve, reject) {
        var changeStates = function() {
          auth.signOut();
          service.macAddress = undefined;
          service.loggedIn = false;
          service.user = null;

          service.unauthenticateUser();

          resolve();
        };

        if(typeof service.macAddress === "undefined") {
          changeStates();
        }

        //Remove the client from the online list
        service.onlineAddresses.once("value").then(function(snapshotObj) {
          var snapshot = snapshotObj.val();
          var snapshotKeys = Object.keys(snapshot);

          for(var i = 0; i < snapshotKeys.length; i++) {
            var key = snapshotKeys[i];
            if(snapshot[key] === service.macAddress) {
              service.onlineAddresses.child(key).remove().then(function() {
                changeStates();
              });
            }
          }
        });
      });
    };

    FileSocket.on('user.connected', function() {
      console.log('User has connected all devices');
      service.online = true;
      service.onOnline.forEach(function(fn) {
        fn(service.online);
      });
    });

    FileSocket.on('user.disconnected', function() {
      service.online = false;
      service.onOnline.forEach(function(fn) {
        fn(service.online);
      });
    });

    service.authenticateUser = function(user) {
      FileSocket.emit('user.info', user);
    };

    service.unauthenticateUser = function(user) {
      FileSocket.emit('user.out', user);
    };

    return service;
  }
})();
