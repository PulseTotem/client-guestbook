'use strict';

/**
 * @ngdoc function
 * @name pulsetotemGuestBookClientApp.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the pulsetotemGuestBookClientApp
 */
angular.module('PulseTotemCommon')
    .controller('PulseTotemCommon.MenuCtrl', ['$rootScope', '$scope', '$translate', 'backendSocket', '$cookies', '$location', 'CONSTANTS', function ($rootScope, $scope, $translate, backendSocket, $cookies, $location, CONSTANTS) {

        $translate.use('fr');

        $scope.langKey = $translate.use();

        $scope.changeLanguage = function (langKey) {
          $scope.langKey = langKey;
          $translate.use(langKey);
        };

        /*$scope.logout = function() {
          $rootScope.user = {};

          delete($cookies.tmpPulseTotemToken);
          delete($cookies.pulseTotemToken);

          backendSocket.exit();

          if (!$rootScope.$$phase) {
            $rootScope.$apply(function () {
              $location.path(CONSTANTS.homeRoute);
            });
          } else {
            $location.path(CONSTANTS.homeRoute);
          }
        };*/

    }]);
