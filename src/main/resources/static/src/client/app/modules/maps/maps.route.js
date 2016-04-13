(function() {
    'use strict';

    angular
        .module('app.maps')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());

        function getStates() {
            return [
                {
                    state: 'app.maps-google',
                    config: {
                        url: '/maps-google',
                        title: 'Maps Google',
                        templateUrl: 'app/modules/maps/views/maps-google.html',
                        resolve: routerHelper.resolveFor('loadGoogleMapsJS', function () {
                            return loadGoogleMaps();
                        }, 'google-map')
                    }
                },
                {
                    state: 'app.maps-vector',
                    config: {
                        url: '/maps-vector',
                        title: 'Maps Vector',
                        templateUrl: 'app/modules/maps/views/maps-vector.html',
                        controller: 'VectorMapController',
                        resolve: routerHelper.resolveFor('vector-map')
                    }
                }
            ];
        }
    }
})();
