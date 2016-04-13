(function() {
    'use strict';

    angular
        .module('app.localization')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());

        function getStates() {
            return [
                {
                    state: 'app.localization',
                    config: {
                        url: '/localization',
                        title: 'Localization',
                        templateUrl: 'app/modules/layout/localization.html'
                    }
                }
            ];
        }
    }
})();
