'use strict';

/**
 * @ngdoc function
 * @name pulsetotemGuestBookClientApp.controller:ProfilCtrl
 * @description
 * # ProfilCtrl
 * Controller of the pulsetotemGuestBookClientApp
 */
angular.module('PulseTotemControl')
  .controller('PulseTotemControl.ProfilCtrl', ['$rootScope', '$scope', '$routeParams', 'guestBookSocket', 'callbackManager', function($rootScope, $scope, $routeParams, guestBookSocket, callbackManager) {
    $scope.connected = false;
    $scope.drawing = false;
    $scope.backgroundImage = {"background-image": "url('http://cdn.the6thscreen.fr/guestbook/background.jpg')"};

    var initDraw = function() {
      if(! $scope.drawing) {
        $scope.drawing = true;
      }
    };

    var initSession = function() {

      $scope.letsDraw = function() {
        if(!$scope.drawing) {
          guestBookSocket.emit("TakeControl", {'callSocketId': null});
        }
      };

      $scope.sendToGuestBookSocket = function(drawContent) {
        if($scope.drawing) {
          guestBookSocket.emit("NewContent", {'drawContent': drawContent});
        }
      };

      $scope.saveToGuestBookSocket = function(drawContent) {
        if($scope.drawing) {
          guestBookSocket.emit("SaveContent", {'drawContent': drawContent});
          $scope.drawing = false;
        }
      };

      guestBookSocket.on("LockedControl", function (response) {
        callbackManager(response, function (sessionDesc) {
            $scope.$apply(function () {
              initDraw();
            });
          },
          function (fail) {
            console.error(fail);
            console.error("An error occurred during Locked Control.");
          }
        );
      });

      guestBookSocket.on("unlockControl", function (response) {
        callbackManager(response, function (sessionDesc) {
            $scope.$apply(function () {
              //TODO : display a message
            });
          },
          function (fail) {
            console.error(fail);
            console.error("An error occurred during unlock Control.");
          }
        );
      });

      guestBookSocket.on("SetBackground", function (response) {
        callbackManager(response, function (backgroundInfo) {
            $scope.$apply(function () {
              $scope.backgroundImage = {"background-image": "url('"+backgroundInfo.backgroundURL+"')"};
            });
          },
          function (fail) {
            console.error(fail);
            console.error("An error occurred during set background.");
          }
        );
      });

      guestBookSocket.emit("SetProfilId", {'profilId': $routeParams.profilid});
    };

    guestBookSocket.init($routeParams.socketid, function() {
      $scope.$apply(function () {
        $scope.connected = true;
        initSession();
      });
    }, function(err) {
      console.error(err);
    });
  }]);
