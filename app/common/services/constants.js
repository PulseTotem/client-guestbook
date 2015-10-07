'use strict';

/**
 * @ngdoc function
 * @name pulsetotemGuestBookClientApp.PulseTotemCommon.constant:Constants
 * @description
 * Constants for the pulsetotemGuestBookClientApp
 */
angular.module('PulseTotemCommon')
    .constant('CONSTANTS', {
        backendUrl: 'http://localhost:4000/',
        //backendUrl: 'http://backend.pulsetotem.fr/',
        //backendUrl: 'http://backend-test.pulsetotem.fr/',
        loginBackendPath: 'login',
        loginFromTokenBackendPath: 'loginFromToken',
        homeRoute: '/',
        afterLoginRoute: '/dashboard',

        //guestBookServiceUrl: 'http://localhost:6015/',
        //guestBookServiceUrl: 'http://service-guestbook.pulsetotem.fr/',
        guestBookServiceUrl: 'http://service-guestbook-test.pulsetotem.fr/',
        guestBookClientPath: 'GuestBookClient'
    });
