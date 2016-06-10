'use strict';

/**
 * @ngdoc function
 * @name pulsetotemGuestBookClientApp.PulseTotemCommon:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the pulsetotemGuestBookClientApp
 */
angular.module('PulseTotemCommon')
  .controller('PulseTotemCommon.LoginCtrl', ['$rootScope', '$scope', '$http', '$location', 'CONSTANTS', 'backendSocket', '$cookies', function ($rootScope, $scope, $http, $location, CONSTANTS, backendSocket, $cookies) {

        /*$rootScope.user = {};

        $scope.login = function(user) {
          if (typeof(user.password) != "undefined" && user.password != "") {
            var shaObj = new jsSHA(user.password, "TEXT");
            var encryptedPwd = shaObj.getHash("SHA-256", "HEX");

            $http.post(CONSTANTS.backendUrl + CONSTANTS.loginBackendPath, {
              'usernameOrEmail': user.usernameOrEmail,
              'password': encryptedPwd
            })
              .success(function (data, status, headers, config) {
                var successBackendInit = function() {

                  if(user.remember) {
                    delete($cookies.tmpPulseTotemToken);
                    $cookies.pulseTotemToken = data.token;
                  } else {
                    delete($cookies.pulseTotemToken);
                    $cookies.tmpPulseTotemToken = data.token;
                  }

                  $rootScope.header = "default";
                  if (!$rootScope.$$phase) {
                    $rootScope.$apply(function () {
                      $location.path(CONSTANTS.afterLoginRoute);
                    });
                  } else {
                    $location.path(CONSTANTS.afterLoginRoute);
                  }
                };

                var failBackendInit = function(errorDesc) {
                  console.error(errorDesc); //TODO: Manage error during post => display error message
                  delete($cookies.pulseTotemToken);
                  delete($cookies.tmpPulseTotemToken);
                  $rootScope.header = "home";
                  if(next.templateUrl != "../common/views/home.html") {
                    if (!$rootScope.$$phase) {
                      $rootScope.$apply(function () {
                        $location.path(CONSTANTS.homeRoute);
                      });
                    } else {
                      $location.path(CONSTANTS.homeRoute);
                    }
                  }
                };

                backendSocket.init(data.token, successBackendInit, failBackendInit);

              })
              .error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.

                //TODO: Manage error during post => display error message
                console.log("fail login during POST");
              });
          } else {
            //TODO: Manage error during post => display error message
            console.log("fail login because empty password");
          }
        };*/
  }]);
