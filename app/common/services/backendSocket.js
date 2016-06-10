'use strict';

/**
 * @ngdoc function
 * @name pulsetotemGuestBookClientApp.factory:backendSocket
 * @description
 * # backendSocket Factory
 * Factory of the pulsetotemGuestBookClientApp
 */
angular.module('PulseTotemCommon')
  .factory('backendSocket', ['$rootScope', 'CONSTANTS', 'callbackManager', 'socketFactory', function ($rootScope, CONSTANTS, callbackManager, socketFactory) {
    var backendSocketFactory = {};
    backendSocketFactory.backendSocket = null;

    backendSocketFactory.init = function(token, successCB, failCB) {
      var backendIOSocket = io(CONSTANTS.backendUrl + CONSTANTS.adminBackendPath,
        {
          'reconnection': true,
          'reconnectionAttempts': 10,
          'reconnectionDelay': 1000,
          'reconnectionDelayMax': 5000,
          'timeout': 5000,
          'autoConnect': true,
          'multiplex': false,
          'query': 'token=' + token
        });

      backendIOSocket.on("connect", function () {
        if(typeof($rootScope.user) == "undefined" || typeof($rootScope.user.id) == "undefined") {
          backendIOSocket.emit("RetrieveUserDescriptionFromToken", {'token' : token});
        }
      });

      backendIOSocket.on("UserDescriptionFromToken", function (response) {
        callbackManager(response, function (userDesc) {
            $rootScope.user = userDesc;
            successCB();
          },
          function (fail) {
            console.error(fail);
            failCB("An error occurred during User authentication.");
          }
        );
      });

      backendIOSocket.on("error", function (errorData) {
        console.error("An error occurred during connection to Backend.");
        console.log(errorData);
        if($rootScope.user == null) {
          failCB("An error occurred during User authentication.");
        }
      });

      backendIOSocket.on("disconnect", function () {
        console.info("Disconnected to Backend.");
      });

      backendIOSocket.on("reconnect", function (attemptNumber) {
        console.info("Connected to Backend after " + attemptNumber + " attempts.");
      });

      backendIOSocket.on("reconnect_attempt", function () {
        console.info("Trying to reconnect to Backend.");
      });

      backendIOSocket.on("reconnecting", function (attemptNumber) {
        console.info("Trying to connect to Backend - Attempt number " + attemptNumber + ".");
      });

      backendIOSocket.on("reconnect_error", function (errorData) {
        console.error("An error occurred during reconnection to Backend.");
        console.log(errorData);
      });

      backendIOSocket.on("reconnect_failed", function () {
        console.error("Failed to connect to Backend. New attempt will be done in 5 seconds. Administrators received an Alert !");
        //TODO: Send an email and Notification to Admins !

        setTimeout(function() {
          backendSocketFactory.backendSocket = null;
          backendSocketFactory.init(token, successCB, failCB);
        }, 5000);
      });

      var backendSocket = socketFactory({
        ioSocket: backendIOSocket
      });

      backendSocketFactory.backendSocket = backendSocket;

      backendSocketFactory.addFirstListeners();
    };

    backendSocketFactory.exit = function() {
      backendSocketFactory.backendSocket = null;
    };

    backendSocketFactory.on = function() {
      if(backendSocketFactory.backendSocket != null) {
        backendSocketFactory.backendSocket.removeAllListeners(arguments[0]);
        backendSocketFactory.backendSocket.on.apply(this,arguments);
      } else {
        console.error("An error occurred : BackendSocket isn't initialized.");
      }
    };

    backendSocketFactory.addListener = function() {
      if(backendSocketFactory.backendSocket != null) {
        backendSocketFactory.backendSocket.removeAllListeners(arguments[0]);
        backendSocketFactory.backendSocket.addListener.apply(this,arguments);
      } else {
        console.error("An error occurred : BackendSocket isn't initialized.");
      }
    };

    backendSocketFactory.removeListener = function() {
      if(backendSocketFactory.backendSocket != null) {
        backendSocketFactory.backendSocket.removeListener.apply(this,arguments);
      } else {
        console.error("An error occurred : BackendSocket isn't initialized.");
      }
    };

    backendSocketFactory.removeAllListeners = function() {
      if(backendSocketFactory.backendSocket != null) {
        backendSocketFactory.backendSocket.removeAllListeners.apply(this,arguments);
      } else {
        console.error("An error occurred : BackendSocket isn't initialized.");
      }
    };

    backendSocketFactory.emit = function() {
      if(backendSocketFactory.backendSocket != null) {
        backendSocketFactory.backendSocket.emit.apply(this,arguments);
      } else {
        console.error("An error occurred : BackendSocket isn't initialized.");
      }
    };

    backendSocketFactory.forward = function() {
      if(backendSocketFactory.backendSocket != null) {
        backendSocketFactory.backendSocket.forward.apply(this,arguments);
      } else {
        console.error("An error occurred : BackendSocket isn't initialized.");
      }
    };

    backendSocketFactory.onRefreshUserCB = null;

    backendSocketFactory.addFirstListeners = function() {
      backendSocketFactory.on('UserDescription', function(response) {
        callbackManager(response, function (userDesc) {
            $rootScope.user = userDesc;

            if(backendSocketFactory.onRefreshUserCB != null) {
              backendSocketFactory.onRefreshUserCB();
              backendSocketFactory.onRefreshUserCB = null;
            }
          },
          function (fail) {
            console.error(fail);
          }
        );
      });
    };

    backendSocketFactory.refreshUser = function(onRefreshCB) {
      if(backendSocketFactory.backendSocket != null && $rootScope.user != null) {
        if (onRefreshCB) {
          backendSocketFactory.onRefreshUserCB = onRefreshCB;
        }
        backendSocketFactory.emit('RetrieveUserDescription', {'userId': $rootScope.user.id});
      }
    };

    return backendSocketFactory;
  }]);
