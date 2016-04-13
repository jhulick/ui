
(function() {
    'use strict';

    angular
        .module('blocks.auth')
        .provider('Principal', Principal);


    function Principal() {

        /**
         * @name Principal#options
         * @type {Object}
         * @propertyOf blocks.auth#Principal
         */
        var opts = {};

        /**
         * @ngdoc function
         * @methodOf Principal
         * @name Principal#configure
         * @param  {String} cfg the config options
         * @description
         * Public provider configuration function.
         * Use within a angular.config block.
         */
        this.configure = function(cfg) {
            if (typeof cfg !== 'object') {
                throw new Error('Principal: configure expects an object');
            }
            opts = angular.extend(opts, cfg);
        };

        var identity, authenticated = false;

        /**
         * Inject services used within your service here
         */
        /* @ngInject */
        this.$get = function principle($q, $http) {

            var service = {
                isIdentityResolved: isIdentityResolved,
                isAuthenticated: isAuthenticated,
                isInRole: isInRole,
                isInAnyRole: isInAnyRole,
                authenticate: authenticate,
                identity: identity
            };

            return service;

            ////////////////////////////////////////////////////////

            function isIdentityResolved() {
                return angular.isDefined(identity);
            }

            function isAuthenticated() {
                return authenticated;
            }

            function isInRole(role) {
                if (!authenticated || !identity.roles) {
                    return false;
                }
                return identity.roles.indexOf(role) !== -1;
            }

            function isInAnyRole(roles) {
                if (!authenticated || !identity.roles) {
                    return false;
                }
                for (var i = 0; i < roles.length; i++) {
                    if (this.isInRole(roles[i])) {
                        return true;
                    }
                }
                return false;
            }

            function authenticate(identity) {
                identity = identity;
                authenticated = identity !== null;
            }

            function identity(force) {
                var deferred = $q.defer();
                if (force === true) {
                    identity = undefined;
                }

                // check and see if we have retrieved the identity data from the server.
                // if we have, reuse it by immediately resolving
                if (angular.isDefined(identity)) {
                    deferred.resolve(identity);
                    return deferred.promise;
                }

                return $http.get('ui/user').success(function (account) {
                    if (account) {
                        identity = account;
                        authenticated = true;
                    } else {
                        identity = null;
                        authenticated = false;
                    }
                }).error(function () {
                    identity = null;
                    authenticated = false;
                });
            }
        }
    }

})();
