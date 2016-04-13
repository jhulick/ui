
/**
 * @ngdoc module
 * @name app.core
 * @description Defines the core AngularJs application module and initializes submodules
 */
(function() {
    'use strict';

    angular.module('app.core', [

        /*
         * Angular modules
         */
        'ngAnimate',
        'ngStorage',
        'ngCookies',
        'ngSanitize',
        'ngResource',
        'ngAria',

        /*
         * Reusable cross app code modules
         */
        'blocks.exception',
        'blocks.logger',

        /*
         * 3rd Party modules
         */
        'pascalprecht.translate',
        'ui.bootstrap',
        'ui.router',
        'oc.lazyLoad',
        'cfp.loadingBar',
        'tmh.dynamicLocale',
        'ui.utils',
        'ngIdle'
    ]);
})();
