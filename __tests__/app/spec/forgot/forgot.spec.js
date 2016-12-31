'use strict';

describe('Controller: ForgotController', function () {
  var createController, $q;
  var controller, $scope, $state, AuthenticationService;

  beforeEach(module('DLock-Home'));
  beforeEach(module('DLock-Authentication-Mock'));

  // Mock the services
  beforeEach(inject(function (AuthenticationServiceMock) {
    AuthenticationService = AuthenticationServiceMock;
  }));

  // Define the scope
  beforeEach(inject(function ($rootScope) {
    $scope = $rootScope.$new();
  }));

  // Set up the controller
  beforeEach(inject(function ($controller, _$state_, _$q_) {
    $q = _$q_;
    $state = _$state_;

    createController = function () {
      return $controller('ForgotController', {
        $scope: $scope, $state: $state,
        AuthenticationService: AuthenticationService
      });
    };
    controller = createController();
  }));

  it('should work', function () {
    expect($scope).not.toBe({});
  });

  it('should have a default forgot email', function () {
    expect($scope.forgotCreds).toBeDefined();
    expect($scope.forgotCreds.email).toBe("");
  });

  it('redirects you when you activate', function () {
    expect($scope.forgot).toBeDefined();

    spyOn($state, 'go').and.callFake(function () { });

    $scope.forgot("email");
    $scope.$digest();

    expect($state.go).toHaveBeenCalled();
    expect($state.go).toHaveBeenCalledWith('index.login');
  });

  it('displays error texts on authentication error', function () {
    var errorText = "Authentication Error";

    AuthenticationService.forgot.and.callFake(function () {
      var deferred = $q.defer();
      deferred.reject({message: errorText});
      return deferred.promise;
    });

    $scope.forgot("email");
    $scope.$digest();

    expect($scope.errorText).toBe(errorText);
  });
});
