

/**
 * @ngdoc service
 * @name Auth
 * @description
 *     Authentication service
 */

(function() {
    'use strict';

    angular
        .module('blocks.auth')
        .factory('Auth', Auth);

    function Auth($rootScope, $state, Principal, AuthServerProvider) {

        var service = {
            logout: logout,
            authorize: authorize
        };

        return service;

        /////////////////////////////////////////////////////////////

        function logout() {
            AuthServerProvider.logout();
            Principal.authenticate(null);
        }

        function authorize() {
            return Principal
                .identity()
                .then(gotPrinciple);

            function gotPrinciple() {
                var isAuthenticated = Principal.isAuthenticated();

                if ($rootScope.toState.data.roles &&
                    $rootScope.toState.data.roles.length > 0 &&
                    !Principal.isInAnyRole($rootScope.toState.data.roles)) {

                    if (isAuthenticated) {
                        // user is signed in but not authorized for desired state
                        $state.go('accessdenied');
                    } else {
                        // user is not authenticated. stow the state they wanted before you
                        // send them to the login, so you can return them when you're done
                        $rootScope.returnToState = $rootScope.toState;
                        $rootScope.returnToStateParams = $rootScope.toStateParams;

                        // now, send them to the login page so they can log in
                        $state.go('login');
                    }
                }
            }
        }
    }
})();
