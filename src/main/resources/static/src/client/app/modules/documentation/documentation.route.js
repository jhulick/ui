(function() {
    'use strict';

    angular
        .module('app.documentation')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());

        function getStates() {
            return [
                {
                    state: 'app.documentation',
                    config: {
                        url: '/documentation',
                        title: 'Documentation',
                        templateUrl: 'app/modules/documentation/views/documentation.html',
                        resolve: routerHelper.resolveFor('flatdoc')
                    }
                }
            ];
        }
    }
})();
