(function() {
    'use strict';

    angular
        .module('app.layout')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());

        function getStates() {
            return [
                {
                    state: 'app',
                    config: {
                        url: '/app',
                        abstract: true,
                        templateUrl: 'app/layout/views/app.html',
                        controller: 'Shell',
                        resolve: routerHelper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
                    }
                },
                {
                    state: 'app-h',
                    config: {
                        url: '/app-h',
                        abstract: true,
                        templateUrl: 'app/layout/views/app-h.html',
                        controller: 'Shell',
                        resolve: routerHelper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
                    }
                }
            ];
        }
    }
})();
