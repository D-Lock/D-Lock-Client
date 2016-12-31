'use strict';

describe('Controller: LoginController', function () {
  var createController, $q;
  var controller, $scope, $state, UserSettingsService, AuthenticationService;

  beforeEach(module('DLock-Home'));
  beforeEach(module('DLock-Authentication-Mock'));
  beforeEach(module('DLock-Utilities-Mock'));

  // Mock the services
  beforeEach(inject(function (AuthenticationServiceMock, UserSettingsServiceMock) {
    AuthenticationService = AuthenticationServiceMock;
    UserSettingsService = UserSettingsServiceMock;
  }));

  // Define the scope
  beforeEach(inject(function ($rootScope) {
    $scope = $rootScope.$new();
  }));

  // Set up the controller
  beforeEach(inject(function ($controller, _$state_, _$q_) {
    $q = _$q_;
    $state = _$state_;

    createController = function (debug) {
      return $controller('LoginController', {
        DEBUG: debug, $scope: $scope, $state: $state,
        AuthenticationService: AuthenticationService,
        UserSettingsService: UserSettingsService
      });
    };
    controller = createController(false);
  }));

  it('should work', function () {
    expect($scope).not.toBe({});
  });

  it('autopopulates login models', function() {
    expect($scope.loginCreds).toBeDefined();
    expect($scope.loginCreds.email).toBe("");
    expect($scope.loginCreds.password).toBe("");
  });

  it('autopopulates login with debug password', function() {
    controller = createController(true);

    expect($scope.loginCreds.password).toBe("password");
  });

  it('autopopulates from user settings', function() {
    $scope.$digest();

    expect($scope.loginCreds.email).toBe(UserSettingsService.settings.loginUsername);
  });

  it('saves email upon update', function() {
    expect($scope.saveCreds).toBeDefined();

    $scope.$digest();

    // Change email
    var newEmail = "newEmail";
    $scope.loginCreds.email = newEmail;

    $scope.saveCreds();
    $scope.$digest();

    expect(UserSettingsService.settings.loginUsername).toBe(newEmail);
  });

  it('redirects on login', function() {
    expect($scope.login).toBeDefined();

    spyOn($state, 'go');

    $scope.login();
    $scope.$digest();

    expect(AuthenticationService.logIn).toHaveBeenCalled();
    expect($state.go).toHaveBeenCalled();
    expect($state.go).toHaveBeenCalledWith('home');
  });

  var throwAuthError = function(errorMsg, nested) {
    AuthenticationService.logIn.and.callFake(function () {
      var deferred = $q.defer();
      if(nested) {
        deferred.reject({message: errorMsg});
      } else {
        deferred.reject(errorMsg);
      }
      return deferred.promise;
    });

    $scope.login();
    $scope.$digest();
  };

  it('displays error texts on authentication error', function () {
    var errorText = "Authentication Error";

    throwAuthError(errorText, true);

    expect($scope.error).toBe(errorText);
  });

  it('displays error texts on authentication error not nested', function() {
    var errorText = "Authentication Error";

    throwAuthError(errorText, false);

    expect($scope.error).toBe(errorText);
  });

  it('reloads scope on error message', function() {
    spyOn($scope, '$apply');
    $scope.$$phase = false;

    var errorText = "Authentication Error";
    throwAuthError(errorText, false);

    expect($scope.$apply).toHaveBeenCalled();
  });
});
