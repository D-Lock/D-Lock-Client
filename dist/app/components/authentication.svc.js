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

    var addToOnline = function() {
      service.onlineAddresses.once('value', function(snapshot) {
        var val = snapshot.val();
        
        if(val === null) {
          service.onlineAddresses.push(service.macAddress);
        }

        var values = Object.keys(val).map(function(key) {
          return val[key].address;
        });
        
        if(values.indexOf(service.macAddress) !== -1){
          return;
        }

        service.onlineAddresses.push(service.macAddress);
      });
    };

    var checkMacAddress = function() {
      return new Promise(function(resolve, reject) {
        service.allAddresses.once('value', function(snapshot) {
          var val = snapshot.val();
          var values = Object.keys(val).map(function(key) {
            return val[key].address;
          });

          if(values.indexOf(service.macAddress) === -1) {
            return reject("This device is not configured with this account.");
          }
          resolve();
        });
      });
    };

    //Public method for logging in
    service.logIn = function(email, password) {
      return new Promise(function(resolve, reject) {
        var user = undefined;

        var signIn = auth.signInWithEmailAndPassword(email, password)
        .then(function(_user) {
          user = _user;

          service.onlineAddresses = db.ref(CLIENTS_REF).child(user.uid).child("online");
          service.allAddresses = db.ref(CLIENTS_REF).child(user.uid).child("all");

          return setMacAddress();
        }).then(function() {
          return checkMacAddress();
        })
        .then(function() {
          service.loggedIn = true;
          service.user = user;

          service.authenticateUser({
            id: user.uid,
            mac: service.macAddress
          });

          //Put their MAC address on the online list
          addToOnline();

          resolve(user);
        })
        .catch(function(error) {
          service.loggedIn = false;
          reject(error);
        });
      });
    };

    var setMacAddress = function() {
      return new Promise(function(resolve, reject) {
        if(!$window.mac) {
          return reject("MAC Address is not in the global scope");
        }

        service.macAddress = $window.mac;
        resolve(service.macAddress);
      });
    };

    service.register = function(email, password) {
      var signUp = auth.createUserWithEmailAndPassword(email, password);
      signUp.catch(function (error) {
        console.error(error.code);
        console.error(error.message);
      });
      return signUp;
    };

    service.forgot = function(email){
      var reset = auth.sendPasswordResetEmail(email);
      reset.catch(function (error) {
        console.error(error.code);
        console.error(error.message);
      });
      return reset;
    };

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
      console.log('User has disconnected on another device');
      service.online = false;
      service.onOnline.forEach(function(fn) {
        fn(service.online);
      });
    });

    service.authenticateUser = function(user) {
      FileSocket.emit('client.info', user);
    };

    service.unauthenticateUser = function(user) {
      FileSocket.emit('client.out', user);
    };

    return service;
  }
})();
