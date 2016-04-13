
/**
 * @ngdoc service
 * @name formsDataservice
 * @description
 *     Application data API.
 */
(function() {
    'use strict';

    angular
        .module('app.forms')
        .factory('formsDataservice', formsDataservice);

    formsDataservice.$inject = ['$http', '$location', '$q', 'exception', 'logger'];

    /**
     * @ngdoc method
     * @name app.forms#formsDataservice
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
    function formsDataservice($http, $location, $q, exception, logger) {
        /* jshint validthis:true */
        var readyPromise;
        var isPrimed = false;
        var primePromise;

        var service = {
            getCities: getCities,
            getChosenStates: getChosenStates,
            getXeditableGroups: getXeditableGroups,
            ready: ready
        };

        return service;

        //================================================================

        function getXeditableGroups() {

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

        function getCities() {
            return $http.get('/api/cities')
                .then(getCitiesComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getCities')(message);
                    $location.url('/dashboard');
                });

            function getCitiesComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getChosenStates() {
            return $http.get('/api/chosen-states')
                .then(getChosenStatesComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getChosenStates')(message);
                    $location.url('/dashboard');
                });

            function getChosenStatesComplete(data, status, headers, config) {
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
