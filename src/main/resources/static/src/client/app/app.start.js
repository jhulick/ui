
/**
 * @ngdoc factory
 * @name appStart
 * @description
 *     The application startup function, called in the app module's run block.
 *     Create apart from app.js so it can easily be stubbed out during testing
 *     or tested independently
 */

(function() {
    'use strict';

    angular
        .module('max-ui')
        .factory('appStart', startup);

    startup.$inject = [
        '$rootScope', '$state', '$stateParams',  '$window', '$templateCache'
    ];

    function startup($rootScope, $state, $stateParams, $window, $templateCache) {
        var appStart = {
            start: start
        };
        return appStart;

        //////////////////////

        function start() {
            // Set reference to access them from any scope
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$storage = $window.localStorage;

            // Uncomment this to disable template cache
            /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
             if (typeof(toState) !== 'undefined'){
             $templateCache.remove(toState.templateUrl);
             }
             });*/

            // Scope Globals
            // -----------------------------------
            $rootScope.app = {
                name: 'MAX UI',
                description: 'MAX PaaS Angular Bootstrap',
                year: ((new Date()).getFullYear()),
                layout: {
                    isFixed: true,
                    isCollapsed: false,
                    isBoxed: false,
                    isRTL: false,
                    horizontal: false,
                    isFloat: false,
                    asideHover: false
                },
                useFullLayout: false,
                hiddenFooter: false,
                viewAnimation: 'ng-fadeInUp'
            }

            $rootScope.user = {
                name: 'Jeremy',
                job: 'ng-Dev',
                picture: 'build/img/dummy.png'
            }
        }
    }

})();
