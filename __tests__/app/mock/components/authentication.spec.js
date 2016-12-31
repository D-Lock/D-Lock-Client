'use strict';

angular.module('DLock-Authentication-Mock', ['DLock-Authentication']);

angular.module('DLock-Authentication-Mock')
.service('AuthenticationServiceMock',  ['$q', AuthenticationServiceMock]);

function AuthenticationServiceMock($q) {
  return {
    loggedIn: true,
    user: {
        uid: 1,
        email: "example@example.com"
    },
    online: true,
    onOnline: []
  };
};