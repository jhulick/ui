
/**
 * @ngdoc service
 * @name ngTableDataService
 * @description
 *     Application data API.
 */
(function() {
    'use strict';

    angular
        .module('app.tables')
        .factory('ngTableDataService', ngTableDataService);

    ngTableDataService.$inject = ['$http', '$location', '$q', 'exception', 'logger', '$timeout'];

    /**
     * @ngdoc method
     * @name app.charts#ngTableDataService
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
    function ngTableDataService($http, $location, $q, exception, logger, $timeout) {
        /* jshint validthis:true */

        var self = this;
        var readyPromise;
        var isPrimed = false;
        var primePromise;
        var cache;

        var service = {
            getData: getData,
            ready: ready
        };

        return service;

        //================================================================

        function getData(params) {

            if (!self.cache) {
                return $http.get('/api/table-data')
                    .then(getDataComplete)
                    .catch(function(message) {
                        exception.catcher('XHR Failed for getTableData')(message);
                        $location.url('/dashboard');
                    });
            } else {
                return filterdata(params);
            }

            function getDataComplete(results, status, headers, config) {
                self.cache = results.data;
                return filterdata(params);
            }

            function filterdata(params) {
                return $timeout(function () {
                    var from = (params.page() - 1) * params.count();
                    var to = params.page() * params.count();
                    var filteredData = self.cache.result.slice(from, to);

                    params.total(self.cache.total);
                    return filteredData;
                }).then(function(data) {
                    return data;
                })
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
