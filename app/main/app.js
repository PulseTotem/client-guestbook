'use strict';

/**
 * @ngdoc overview
 * @name pulsetotemGuestBookClientApp
 * @description
 * # pulsetotemGuestBookClientApp
 *
 * Main module of the application.
 */
angular
    .module('pulsetotemGuestBookClientApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'pascalprecht.translate',
    'btford.socket-io',
    'PulseTotemCommon',
    'PulseTotemControl'
    ])
    .config(['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
    }])
    .config(['$mdThemingProvider', function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey', {
          'default' : '600'
        })
        .accentPalette('blue');
    }])
    /*.run(['$rootScope', '$location', '$cookies', '$http', 'CONSTANTS', 'backendSocket', '$route', function($rootScope, $location, $cookies, $http, CONSTANTS, backendSocket, $route) {
      $rootScope.header = "home";

      if(typeof($rootScope.currentLogingFromToken) == "undefined" || $rootScope.currentLogingFromToken == null) {
        $rootScope.currentLogingFromToken = false;
      }

      $rootScope.$on("$routeChangeStart", function(event, next, current) {

        if(! $rootScope.currentLogingFromToken) {
          if (typeof($rootScope.user) == "undefined" || typeof($rootScope.user.id) == "undefined") {
            var pulseTotemToken = null;
            var tmpToken = false;
            if ($cookies.pulseTotemToken) {
              pulseTotemToken = $cookies.pulseTotemToken;
            } else {
              if ($cookies.tmpPulseTotemToken) {
                pulseTotemToken = $cookies.tmpPulseTotemToken;
                tmpToken = true;
              }
            }

            if (pulseTotemToken != null) {
              $rootScope.currentLogingFromToken = true;
              $http.post(CONSTANTS.backendUrl + CONSTANTS.loginFromTokenBackendPath, {
                'token': pulseTotemToken,
                'tmp': tmpToken
              })
                .success(function (data, status, headers, config) {
                  var successBackendInit = function() {
                    if(tmpToken) {
                      delete($cookies.pulseTotemToken);
                      $cookies.tmpPulseTotemToken = data.token;
                    } else {
                      delete($cookies.tmpPulseTotemToken);
                      $cookies.pulseTotemToken = data.token;
                    }

                    $rootScope.currentLogingFromToken = false;

                    $rootScope.header = "default";
                    if (next.templateUrl === "views/home.html") {
                      if (!$rootScope.$$phase) {
                        $rootScope.$apply(function () {
                          $location.path(CONSTANTS.afterLoginRoute);
                        });
                      } else {
                        $location.path(CONSTANTS.afterLoginRoute);
                      }
                    }
                  };

                  var failBackendInit = function(errorDesc) {
                    console.error(errorDesc);
                    delete($cookies.pulseTotemToken);
                    delete($cookies.tmpPulseTotemToken);

                    $rootScope.header = "home";
                    if (!$rootScope.$$phase) {
                      $rootScope.$apply(function () {
                        $location.path(CONSTANTS.homeRoute);
                      });
                    } else {
                      $location.path(CONSTANTS.homeRoute);
                    }
                  };

                  backendSocket.init(data.token, successBackendInit, failBackendInit);
                })
                .error(function (data, status, headers, config) {
                  $rootScope.currentLogingFromToken = false;
                  delete($cookies.pulseTotemToken);
                  delete($cookies.tmpPulseTotemToken);
                  $rootScope.header = "home";
                  if (next.templateUrl != "../common/views/home.html") {
                    if (!$rootScope.$$phase) {
                      $rootScope.$apply(function () {
                        $location.path('/');
                      });
                    } else {
                      $location.path('/');
                    }
                  }
                });
            } else {
              $rootScope.header = "home";
              if (next.templateUrl != "../common/views/home.html") {
                if (!$rootScope.$$phase) {
                  $rootScope.$apply(function () {
                    $location.path('/');
                  });
                } else {
                  $location.path('/');
                }
              }
            }

          } else {
            $rootScope.header = "default";
            if (next.templateUrl === "../common/views/home.html") {
              if (!$rootScope.$$phase) {
                $rootScope.$apply(function () {
                  $location.path(CONSTANTS.afterLoginRoute);
                });
              } else {
                $location.path(CONSTANTS.afterLoginRoute);
              }
            }
          }
        }
      });
    }])*/;
