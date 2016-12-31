'use strict';

angular.module('DLock-Utilities-Mock', ['DLock-Utilities']);

angular.module('DLock-Utilities-Mock')
.service('UserSettingsServiceMock',  ['$q', UserSettingsServiceMock]);

function UserSettingsServiceMock($q) {
  var settings = {
    loginUsername: "abc123",
    downloadLocation: "def456"
  };
  return {
    settings: settings,
    getLoginUsername: jasmine.createSpy('getLoginUsername').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve(settings.loginUsername);
      return deferred.promise;
    }),
    setLoginUsername: jasmine.createSpy('setLoginUsername').and.callFake(function(val) {
      var deferred = $q.defer();
      settings.loginUsername = val;
      deferred.resolve(settings.loginUsername);
      return deferred.promise;
    }),
    getDownloadLocation: jasmine.createSpy('getDownloadLocation').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve(settings.downloadLocation);
      return deferred.promise;
    }),
    setDownloadLocation: jasmine.createSpy('setDownloadLocation').and.callFake(function(val) {
      var deferred = $q.defer();
      settings.downloadLocation = val;
      deferred.resolve(settings.downloadLocation);
      return deferred.promise;
    })
  };
};