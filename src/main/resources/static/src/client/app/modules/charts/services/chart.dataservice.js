
/**
 * @ngdoc service
 * @name dataservice
 * @description
 *     Application data API.
 */
(function() {
    'use strict';

    angular
        .module('app.charts')
        .factory('ChartDataservice', ChartDataservice);

    ChartDataservice.$inject = ['$http', '$location', '$q', 'exception', 'logger'];

    /**
     * @ngdoc method
     * @name ChartDataservice#dataservice
     * @description
     *     Configures the dataservice.
     * @param  {[type]} $http
     * @param  {[type]} $location
     * @param  {[type]} $q
     * @param  {[type]} exception
     * @param  {[type]} logger
     * @return {Object} dataservice service
     */
    /* @ngInject */
    function ChartDataservice($http, $location, $q, exception, logger) {
        /* jshint validthis:true */
        var readyPromise;
        var isPrimed = false;
        var primePromise;

        var service = {
            getBarChart: getBarChart,
            getBarstackedChart: getBarstackedChart,
            getSplineChart: getSplineChart,
            getAreaChart: getAreaChart,
            getLineChart: getLineChart,
            getPieChart: getPieChart,
            getDonutChart: getDonutChart,
            ready: ready
        };

        return service;

        //================================================================

        function getBarChart() {
            return $http.get('/api/chart/bar')
                .then(getBarChartComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getBarChart')(message);
                    $location.url('/');
                });

            function getBarChartComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getBarstackedChart() {
            return $http.get('/api/chart/barstacked')
                .then(getBarstackedChartComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getBarstackedChart')(message);
                    $location.url('/');
                });

            function getBarstackedChartComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getSplineChart() {
            return $http.get('/api/chart/spline')
                .then(getSplineChartComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getSplineChart')(message);
                    $location.url('/');
                });

            function getSplineChartComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getAreaChart() {
            return $http.get('/api/chart/area')
                .then(getAreaChartComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getAreaChart')(message);
                    $location.url('/');
                });

            function getAreaChartComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getLineChart() {
            return $http.get('/api/chart/line')
                .then(getLineChartComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getLineChart')(message);
                    $location.url('/');
                });

            function getLineChartComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getPieChart() {
            return $http.get('/api/chart/pie')
                .then(getPieChartComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getPieChart')(message);
                    $location.url('/');
                });

            function getPieChartComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getDonutChart() {
            return $http.get('/api/chart/donut')
                .then(getDonutChartComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getDonutChart')(message);
                    $location.url('/');
                });

            function getDonutChartComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getReady() {
            if (!readyPromise) {
                // Apps often pre-fetch session data ("prime the app")
                // before showing the first view.
                // This app doesn't need priming but we add a
                // no-op implementation to show how it would work.
                logger.info('Primed the app data');
                readyPromise = $q.when(service);
            }
            return readyPromise;
        }

        function ready(promisesArray) {
            return getReady()
                .then(function() {
                    return promisesArray ? $q.all(promisesArray) : readyPromise;
                })
                .catch(exception.catcher('"ready" function failed'));
        }
    }
})();
