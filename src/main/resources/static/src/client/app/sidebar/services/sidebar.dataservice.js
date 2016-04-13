
/**
 * @ngdoc service
 * @name dataservice
 * @description
 *     Application data API.
 */
(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .factory('SidebarData', SidebarData);

    SidebarData.$inject = ['$http', '$location', '$q', 'exception', 'logger'];

    /**
     * @ngdoc method
     * @name SidebarData#dataservice
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
    function SidebarData($http, $location, $q, exception, logger) {
        var isPrimed = false;
        var primePromise;

        var service = {
            getSidebarData: getSidebarData,
            get: get,
            ready: ready
        };

        return service;

        //================================================================

        function getSidebarData() {
            return $http.get('/api/sidebar')
                .then(getSidebarDataComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getSidebarData')(message);
                    $location.url('/');
                });

            function getSidebarDataComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function get(id) {
            return getMail().then(function (mails) {
                for (var i = 0; i < mails.length; i++) {
                    if (mails[i].id == id) return mails[i];
                }
                return null;
            });
        }

        function prime() {
            // This function can only be called once.
            if (primePromise) {
                return primePromise;
            }

            primePromise = $q.when(true).then(success);
            return primePromise;

            function success() {
                isPrimed = true;
                logger.info('Primed data');
            }
        }

        function ready(nextPromises) {
            var readyPromise = primePromise || prime();

            return readyPromise
                .then(function() { return $q.all(nextPromises); })
                .catch(exception.catcher('"ready" function failed'));
        }

    }
})();
