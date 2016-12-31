'use strict';

describe('Controller: HomeController', function () {
  var createController;
  var controller, $scope, $window, $document, AuthenticationService, FileService, MD5;

  beforeEach(module('DLock-Home'));
  beforeEach(module('DLock-Authentication-Mock'));
  beforeEach(module('DLock-Files-Mock'));

  // Inject the mock services
  beforeEach(module(function ($provide) {
    $document = [{}];
    $document[0].getElementById = jasmine.createSpy('getElementById');
  }));

  // Mock the services
  beforeEach(inject(function (AuthenticationServiceMock, FileServiceMock) {
    AuthenticationService = AuthenticationServiceMock;
    FileService = FileServiceMock;
  }));

  // Define the scope
  beforeEach(inject(function ($rootScope) {
    $scope = $rootScope.$new();
  }));

  // Set up the controller
  beforeEach(inject(function ($controller, _$window_, _md5_) {
    $window = _$window_;
    MD5 = _md5_;

    createController = function () {
      return $controller('HomeController', {
        $scope: $scope,
        $window: $window, $document: $document,
        AuthenticationService: AuthenticationService,
        FileService: FileService, MD5: MD5
      });
    };
    controller = createController();
  }));

  it('should work', function () {
    expect($scope).not.toBe({});
  });

  it('should get file list if logged in', function () {
    expect(FileService.getFiles).toHaveBeenCalled();

    expect($scope.files).toBe(FileService.mockFiles);
  });

  it('should set up an authentication callback', function () {
    expect(AuthenticationService.onOnline.length).toBe(1);
  });

  it('should look for files again authentication goes online', function () {
    // Run the onOnline handler set up in the previous test
    AuthenticationService.onOnline[0](true);

    // Make sure it got the list of files
    expect(FileService.getFiles.calls.count()).toEqual(2);
  });

  it('should be able to upload', function () {
    expect($scope.upload).toBeDefined();

    // Override upload form
    var file = {};
    $document[0].getElementById = jasmine.createSpy('getElementById').and
      .returnValue({ files: [file] });

    $scope.upload();

    expect(FileService.sendFile).toHaveBeenCalledWith(file);
  });

  it('should allow for file selection', function () {
    expect($scope.selectFile).toBeDefined();

    var file = {};
    $scope.selectFile(file);

    expect($scope.selectedFile).toBe(file);
  });

  it('should clear files when offline', function () {
    $scope.files = [{}];
    $scope.selectedFile = {};

    // Initially set selected files
    AuthenticationService.online = false;

    createController();

    expect($scope.files).toEqual({});
    expect($scope.selectedFile).toBeUndefined();
  });
});
