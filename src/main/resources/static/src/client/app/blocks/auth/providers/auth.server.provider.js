
/**
 * @ngdoc service
 * @name AuthServerProvider
 * @description
 *     Authentication Session service
 */

(function() {

    'use strict';

    angular
        .module('blocks.auth')
        .factory('AuthServerProvider', AuthService);

    /**
     * @ngdoc method
     * @name AuthServerProvider#AuthService
     * @description
     *     Configure the Authentication Session service
     * @return {Object} configuration settings for AuthServerProvider
     */
    /* @ngInject */
    function AuthService($http, localStorageService) {

        var service = {
            logout: logout,
            getToken: getToken,
            hasValidToken: hasValidToken
        };

        return service;

        ///////////////////////////////////////////////////////////////////

        function logout() {
            // logout from the server
            $http.post('api/logout')
                .success(function (response) {
                    localStorageService.clearAll();
                    // to get a new csrf token call the api
                    $http.get('api/account');
                    return response;
                }
            );
        }

        function getToken() {
            var token = localStorageService.get('token');
            return token;
        }

        function hasValidToken() {
            var token = this.getToken();
            return !!token;
        }
    }

})();
