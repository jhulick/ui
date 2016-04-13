(function() {
    'use strict';

    angular
        .module('app.charts')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());

        function getStates() {
            return [
                {
                    state: 'app.chart-flot',
                    config: {
                        url: '/chart-flot',
                        title: 'Chart Flot',
                        templateUrl: 'app/modules/charts/views/chart-flot.html',
                        resolve: routerHelper.resolveFor('flot-chart', 'flot-chart-plugins')
                    }
                },
                {
                    state: 'app.chart-radial',
                    config: {
                        url: '/chart-radial',
                        title: 'Chart Radial',
                        templateUrl: 'app/modules/charts/views/chart-radial.html',
                        resolve: routerHelper.resolveFor('classyloader')
                    }
                },
                {
                    state: 'app.chart-js',
                    config: {
                        url: '/chart-js',
                        title: 'Chart JS',
                        templateUrl: 'app/modules/charts/views/chart-js.html',
                        resolve: routerHelper.resolveFor('chartjs')
                    }
                }
            ];
        }
    }
})();
