'use strict';

angular.module('DLock-Authentication-Mock', ['DLock-Authentication']);

angular.module('DLock-Authentication-Mock')
.service('AuthenticationServiceMock',  ['$q', AuthenticationServiceMock]);

function AuthenticationServiceMock($q) {
  var fakeUser = {
      uid: 1,
      email: "example@example.com"
  };

  return {
    loggedIn: true,
    user: fakeUser,
    online: true,
    onOnline: [],
    forgot: jasmine.createSpy('forgot').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve(fakeUser);
      return deferred.promise;
    })
  };
};