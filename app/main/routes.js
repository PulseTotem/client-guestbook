'use strict';

/**
 * @ngdoc overview
 * @name pulsetotemGuestBookClientApp
 * @description
 * # routes
 *
 * Define routes available in application.
 */
angular
  .module('pulsetotemGuestBookClientApp')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider

      // Routes for home
      .when('/', {
        templateUrl: '../common/views/home.html',
        controller: 'PulseTotemCommon.HomeCtrl'
      })

      // Routes for screen control
      .when('/session/:socketid', {
        templateUrl: '../control/views/session.html',
        controller: 'PulseTotemControl.SessionCtrl'
      })
      .when('/profil/:profilid', {
        templateUrl: '../control/views/profil.html',
        controller: 'PulseTotemControl.ProfilCtrl'
      })

      // Routes for authentication
      .when('/login', {
        templateUrl: '../common/views/login.html',
        controller: 'PulseTotemCommon.LoginCtrl'
      })

      // Routes for Dashboard
      .when('/dashboard', {
        templateUrl: '../common/views/login.html',
        controller: 'PulseTotemCommon.LoginCtrl'
      })

      // All other stuff
      .otherwise({
        redirectTo: '/'
      });
  }]);
