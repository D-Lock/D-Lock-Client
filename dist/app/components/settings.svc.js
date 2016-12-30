(function() {
  'use strict';

  angular.module('DLock-Utilities').
  service('UserSettingsService', ['$q', '$window', UserSettingsService]);

  function UserSettingsService($q, $window) {
    var service = {};
    var db = $window.db.settings;

    var getProperty = function(propertyName, defaultValue) {
      var deferred = $q.defer();
      db.findOne({name: propertyName}, function(err, docs) {
        if(err || !docs) {
          //Return the default value otherwise
          if(defaultValue) {
            return deferred.resolve(defaultValue);
          } else {
            return deferred.reject(err);
          }
        }

        deferred.resolve(docs.value);
      });

      return deferred.promise;
    }

    var setProperty = function(propertyName, propertyValue) {
      var deferred = $q.defer();

      db.update({name: propertyName}, {name: propertyName, value: propertyValue}, {upsert: true, returnUpdatedDocs: true}, 
      function(err, numReplaced, docs) {
        if(err || numReplaced < 1) {
          return deferred.reject(err);
        }

        deferred.resolve(docs.value);
      });

      return deferred.promise;
    };

    service.getDownloadLocation = function() {
      return getProperty("downloadLocation", "C:\\");
    };

    service.setDownloadLocation = function(val) {
      return setProperty("downloadLocation", val);
    };

    return service;
  }
})();
