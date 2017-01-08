(function() {
  'use strict';
  
  /**
   * Definition of the main app module and its dependencies
   */
  angular
    .module('DLock', [
      'DLock-Home',
      'DLock-Authentication'
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
    $stateProvider
    .state({
      name: 'splash',
      url: '/splash',
      templateUrl: 'splash/splash.html',
      controller: 'SplashController'
    })
    .state({
      name: 'index',
      url: '/',
      views: {
        'content-header': {
          templateUrl: 'components/content-header.html',
          controller: 'HeaderController'
        },
        'side-nav': {
          templateUrl: 'components/side-nav.html',
          controller: 'NavController'
        },
        '@': {
          templateUrl: 'index/index.html',
          controller: 'IndexController'
        }
      }
    })
    .state({
      name: 'index.login',
      url: '/login',
      views: {
        '@': {
          templateUrl: 'login/login.html',
          controller: 'LoginController'
        }
      }
    })
    .state({
      name: 'index.login.forgot',
      url: '/forgot',
      templateUrl: 'forgot/forgot.html',
      controller: 'ForgotController'
    })
    .state({
      name: 'index.login.register',
      url: '/register',
      templateUrl: 'register/register.html',
      controller: 'RegisterController'
    })
    .state({
      name: 'home',
      url: '/home',
      views: {
        'content-header': {
          templateUrl: 'components/content-header.html',
          controller: 'HeaderController'
        },
        'side-nav': {
          templateUrl: 'components/side-nav.html',
          controller: 'NavController'
        },
        '@': {
          templateUrl: 'home/home.html',
          controller: 'HomeController'
        }
      }
    })
    .state({
      name: 'home.settings',
      url: '/settings',
      views: {
        '@': {
          templateUrl: 'settings/settings.html',
          controller: 'SettingsController'
        }
      }
    })
    .state("otherwise", {
      url: '/'
    });
  }
})();
