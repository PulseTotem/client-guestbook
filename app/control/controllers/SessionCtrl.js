'use strict';

/**
 * @ngdoc function
 * @name pulsetotemGuestBookClientApp.controller:SessionCtrl
 * @description
 * # SessionCtrl
 * Controller of the pulsetotemGuestBookClientApp
 */
angular.module('PulseTotemControl')
  .controller('PulseTotemControl.SessionCtrl', ['$rootScope', '$scope', '$routeParams', 'guestBookSocket', 'callbackManager', function($rootScope, $scope, $routeParams, guestBookSocket, callbackManager) {
    $scope.connected = false;
    $scope.waiting = true;
    $scope.drawing = false;
    $scope.backgroundImage = {"background-image": "url('http://cdn.the6thscreen.fr/guestbook/background.jpg')"};

    var initDraw = function() {
      if(! $scope.drawing) {
        $scope.drawing = true;
      }
    };

    $scope.sendToGuestBookSocket = function(drawContent) {
      guestBookSocket.emit("NewContent", {'drawContent': drawContent});
    };

    $scope.saveToGuestBookSocket = function(drawContent) {
      guestBookSocket.emit("SaveContent", {'drawContent': drawContent});
    };

    var initSession = function() {
      guestBookSocket.on("LockedControl", function (response) {
        callbackManager(response, function (sessionDesc) {
            $scope.$apply(function () {
              $rootScope.session = sessionDesc;
              if($rootScope.session._status == 'ACTIVE') {
                $scope.waiting = false;
                initDraw();
              }
            });
          },
          function (fail) {
            console.error(fail);
            console.error("An error occurred during Locked Control.");
          }
        );
      });

      guestBookSocket.on("ControlSession", function (response) {
        callbackManager(response, function (sessionDesc) {
            $scope.$apply(function () {
              $rootScope.session = sessionDesc;
              if($rootScope.session._status == 'ACTIVE') {
                $scope.waiting = false;
                initDraw();
              }
            });
          },
          function (fail) {
            console.error(fail);
            console.error("An error occurred during Taking Control on Screen.");
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

      if (typeof($rootScope.session) == "undefined" || typeof($rootScope.session._id) == "undefined") {
        guestBookSocket.emit("TakeControl", {'callSocketId': $routeParams.socketid});
      }
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
