(function() {
  'use strict';

  angular.module('DLock-Files').
  factory('PackageFactory', ['$q', 'FileReader', 'FileCryptoService', PackageFactory]);

  function PackageFactory($q, FileReader, FileCrypto) {
    return {
      create: function(file, params, $scope) {
        var deferred = $q.defer();

        var response = {
          name: file.name,
          size: file.size,
          extension: /(?:\.([^.]+))?$/.exec(file.name)[1],
          params: params,
          uid: this.getUID(file.name, file.size)
        };

        FileReader.readAsDataURL(file, $scope).then(function(res) {
          response.data = FileCrypto.encrypt(res.replace(/^[^,]*,/,''));
          deferred.resolve(response);
        }, function(err) {
          deferred.reject(err);
        });

        return deferred.promise;
      },
      getUID: function(name, size) {
        return name + size + (new Date()).getTime();
      }
    };
  }
})();
