
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
        .factory('xEditableTableDataService', xEditableTableDataService);

    xEditableTableDataService.$inject = ['$http', '$location', '$q', 'exception', 'logger'];

    /**
     * @ngdoc method
     * @name app.tables#xEditableTableDataService
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
    function xEditableTableDataService($http, $location, $q, exception, logger) {
        /* jshint validthis:true */
        var self = this;
        var readyPromise;
        var cache;

        var service = {
            getData: getData,
            ready: ready
        };

        return service;

        //================================================================

        function getData() {

            return $http.get('/api/xeditable-groups')
                .then(getDataComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getxEditableTableData')(message);
                    $location.url('/dashboard');
                });

            function getDataComplete(results, status, headers, config) {
                return results.data;
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
