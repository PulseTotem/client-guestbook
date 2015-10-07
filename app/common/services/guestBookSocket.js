'use strict';

/**
 * @ngdoc function
 * @name pulsetotemGuestBookClientApp.factory:guestBookSocket
 * @description
 * # guestBookSocket Factory
 * Factory of the pulsetotemGuestBookClientApp
 */
angular.module('PulseTotemCommon')
  .factory('guestBookSocket', ['$rootScope', 'CONSTANTS', 'callbackManager', 'socketFactory', function ($rootScope, CONSTANTS, callbackManager, socketFactory) {
    var guestBookSocketFactory = {};
    guestBookSocketFactory.guestBookSocket = null;

    guestBookSocketFactory.init = function(callSocketId, successCB, failCB) {
      var guestBookIOSocket = io(CONSTANTS.guestBookServiceUrl + CONSTANTS.guestBookClientPath,
        {
          'reconnection': true,
          'reconnectionAttempts': 10,
          'reconnectionDelay': 1000,
          'reconnectionDelayMax': 5000,
          'timeout': 5000,
          'autoConnect': true,
          'multiplex': false
        });

      guestBookIOSocket.on("connect", function () {
        successCB();
      });

      guestBookIOSocket.on("error", function (errorData) {
        console.error("An error occurred during connection to GuestBookService.");
        console.log(errorData);
        failCB("An error occurred during connection to GuestBookService.");
      });

      guestBookIOSocket.on("disconnect", function () {
        console.info("Disconnected from GuestBookService.");
      });

      guestBookIOSocket.on("reconnect", function (attemptNumber) {
        console.info("Connected to GuestBookService after " + attemptNumber + " attempts.");
      });

      guestBookIOSocket.on("reconnect_attempt", function () {
        console.info("Trying to reconnect to GuestBookService.");
      });

      guestBookIOSocket.on("reconnecting", function (attemptNumber) {
        console.info("Trying to connect to GuestBookService - Attempt number " + attemptNumber + ".");
      });

      guestBookIOSocket.on("reconnect_error", function (errorData) {
        console.error("An error occurred during reconnection to GuestBookService.");
        console.log(errorData);
      });

      guestBookIOSocket.on("reconnect_failed", function () {
        console.error("Failed to connect to GuestBookService. New attempt will be done in 5 seconds. Administrators received an Alert !");
        //TODO: Send an email and Notification to Admins !

        setTimeout(function() {
          guestBookSocketFactory.guestBookSocket = null;
          guestBookSocketFactory.init(callSocketId, successCB, failCB);
        }, 5000);
      });

      var guestBookSocket = socketFactory({
        ioSocket: guestBookIOSocket
      });

      guestBookSocketFactory.guestBookSocket = guestBookSocket;
    };

    guestBookSocketFactory.exit = function() {
      guestBookSocketFactory.guestBookSocket = null;
    };

    guestBookSocketFactory.on = function() {
      if(guestBookSocketFactory.guestBookSocket != null) {
        guestBookSocketFactory.guestBookSocket.removeAllListeners(arguments[0]);
        guestBookSocketFactory.guestBookSocket.on.apply(this,arguments);
      } else {
        console.error("An error occurred : GuestBookService isn't initialized.");
      }
    };

    guestBookSocketFactory.addListener = function() {
      if(guestBookSocketFactory.guestBookSocket != null) {
        guestBookSocketFactory.guestBookSocket.removeAllListeners(arguments[0]);
        guestBookSocketFactory.guestBookSocket.addListener.apply(this,arguments);
      } else {
        console.error("An error occurred : GuestBookService isn't initialized.");
      }
    };

    guestBookSocketFactory.removeListener = function() {
      if(guestBookSocketFactory.guestBookSocket != null) {
        guestBookSocketFactory.guestBookSocket.removeListener.apply(this,arguments);
      } else {
        console.error("An error occurred : GuestBookService isn't initialized.");
      }
    };

    guestBookSocketFactory.removeAllListeners = function() {
      if(guestBookSocketFactory.guestBookSocket != null) {
        guestBookSocketFactory.guestBookSocket.removeAllListeners.apply(this,arguments);
      } else {
        console.error("An error occurred : GuestBookService isn't initialized.");
      }
    };

    guestBookSocketFactory.emit = function() {
      if(guestBookSocketFactory.guestBookSocket != null) {
        guestBookSocketFactory.guestBookSocket.emit.apply(this,arguments);
      } else {
        console.error("An error occurred : GuestBookService isn't initialized.");
      }
    };

    guestBookSocketFactory.forward = function() {
      if(guestBookSocketFactory.guestBookSocket != null) {
        guestBookSocketFactory.guestBookSocket.forward.apply(this,arguments);
      } else {
        console.error("An error occurred : GuestBookService isn't initialized.");
      }
    };

    return guestBookSocketFactory;
  }]);
