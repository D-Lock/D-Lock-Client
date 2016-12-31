'use strict';

angular.module('DLock-Files-Mock', ['DLock-Files']);

angular.module('DLock-Files-Mock')
.service('FileServiceMock',  ['$q', FileServiceMock]);

function FileServiceMock($q) {
  return {
    mockFiles: [{abc: 123}],
    getFiles: jasmine.createSpy('getFiles').and.callFake(function(uid, cb){
      cb(this.mockFiles);
    }),
    sendFile: jasmine.createSpy('sendFile')
  };
};