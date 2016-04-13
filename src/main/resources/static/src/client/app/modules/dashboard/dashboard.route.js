(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());

        function getStates() {
            return [
                {
                    state: 'app.dashboard',
                    config: {
                        url: '/dashboard',
                        title: 'Dashboard',
                        templateUrl: 'app/modules/dashboard/views/dashboard.html',
                        resolve: routerHelper.resolveFor('flot-chart', 'flot-chart-plugins', 'vector-map')
                    }
                },
                {
                    state: 'app-h.dashboard_v2',
                    config: {
                        url: '/dashboard_v2',
                        title: 'Dashboard v2',
                        templateUrl: 'app/modules/dashboard/views/dashboard_v2.html',
                        controller: function ($rootScope, $scope) {
                            $rootScope.app.layout.horizontal = true;
                            $scope.$on('$destroy', function () {
                                $rootScope.app.layout.horizontal = false;
                            });
                        },
                        resolve: routerHelper.resolveFor('flot-chart', 'flot-chart-plugins')
                    }
                }
            ];
        }
    }
})();
