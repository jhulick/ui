/**=========================================================
 * Module: app.maps
 * Provides a simple way to implement bootstrap modals from templates
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.maps')
        .controller('GMapController', GMapController);

    GMapController.$inject = ['$timeout', 'logger'];

    function GMapController($timeout, logger) {

        // required for inner references
        var vm = this;
        vm.mapAddress = '';
        vm.mapLoading = true;

        vm.title = "GMapController";

        activate();

        function activate() {
            return loadMap().then(function() {
                logger.info('Activated GMapController View');
            });
        }

        function loadMap() {
            vm.mapLoading = true;
            return $timeout(function() {
                vm.mapAddress = '276 N TUSTIN ST, ORANGE, CA 92867';
                vm.mapLoading = false;
            }, 2000);
        }


    }
})();
