(function() {
  /**
   * Definition of the main app module and its dependencies
   */
  angular
    .module('DLock', [
      'DLock-Home',
      'DLock-Authentication',
      'ui.router'
    ])
    .config(config);

  // safe dependency injection
  // this prevents minification issues
  config.$inject = ['$stateProvider'];

  /**
   * App routing
   *
   * You can leave it here in the config section or take it out
   * into separate file
   * 
   */
  function config($stateProvider) {
    var loginState = {
      name: 'login',
      url: '/login',
      templateUrl: 'login/login.html',
      controller: 'LoginController'
    }

    var homeState = {
      name: 'home',
      url: '/',
      templateUrl: 'home/home.html',
      controller: 'HomeController'
    }

    $stateProvider
    .state(loginState)
    .state(homeState)
    .state("otherwise", {
      url: '/'
    });
  }
})();
