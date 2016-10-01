(function() {
  /**
   * Definition of the main app module and its dependencies
   */
  angular
    .module('DLock', [
      'DLock-Home',
      'DLock-Authentication',
      'ngRoute'
    ])
    .config(config);

  // safe dependency injection
  // this prevents minification issues
  config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider', '$compileProvider'];

  /**
   * App routing
   *
   * You can leave it here in the config section or take it out
   * into separate file
   * 
   */
  function config($routeProvider, $locationProvider, $httpProvider, $compileProvider) {

    $locationProvider.html5Mode(false);

    // routes
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.html',
        controller: 'HomeController'
      })
      .when('/login', {
        templateUrl: 'login/login.html',
        controller: 'LoginController'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

  angular
    .module('DLock')
    .run(run);

  run.$inject = ['$rootScope', '$location', 'AuthenticationService'];

  function run($rootScope, $location, Authentication) {
    //Check authentication on startup
    if(Authentication.loggedIn) return;

    var route = $location.url();
    if(route !== "/login") {
      $location.path('/login');
    }
  }
})();
