(function() {
  'use strict';

  angular.module('DLock-Files').
  factory('PackageFactory', ['$q', '$rootScope', 'FileReader', 'FileCryptoService', PackageFactory]);

  function PackageFactory($q, $rootScope, FileReader, FileCrypto) {
    return {
      create: function(file, params) {
        var deferred = $q.defer();

        var response = {
          name: file.name,
          size: file.size,
          extension: /(?:\.([^.]+))?$/.exec(file.name)[1],
          params: params,
          uid: this.getUID(file.name, file.size)
        };

        FileReader.readAsDataURL(file, $rootScope).then(function(res) {
          response.data = FileCrypto.encrypt(res.replace(/^[^,]*,/,''));
          deferred.resolve(response);
        }, function(err) {
          deferred.reject(err);
        });

        return deferred.promise;
      },
      createPart: function(file, params, fileData) {
        var deferred = $q.defer();

        var response = {
          name: file.name,
          size: file.size,
          extension: /(?:\.([^.]+))?$/.exec(file.name)[1],
          params: params,
          uid: this.getUID(file.name, file.size),
          data: fileData
        };

        deferred.resolve(response);

        return deferred.promise;
      },
      getUID: function(name, size) {
        return name + size + (new Date()).getTime();
      }
    };
  }
})();
