/**=========================================================
 * Module: app.maps
 * Provides a simple way to implement bootstrap modals from templates
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.maps')
        .controller('ModalGmapController', ModalGmapController);

    ModalGmapController.$inject = ['$modal', '$timeout', 'gmap', 'logger'];

    function ModalGmapController($modal, $timeout, gmap, logger) {

        // required for inner references
        var mgvm = this;

        mgvm.title = "ModalGmapController";
        mgvm.open = open;

        activate();

        function activate() {
            logger.info('Activated ModalGmapController View');
        }

        function open(size) {
            var modalInstance = $modal.open({
                templateUrl: '/myModalContent.html',
                controller: ModalInstanceCtrl,
                size: size
            });
        }

        // Please note that $modalInstance represents a modal window (instance) dependency.
        // It is not the same as the $modal service used above.

        ModalInstanceCtrl.$inject = ['$scope', '$modalInstance', 'gmap'];

        function ModalInstanceCtrl($scope, $modalInstance, gmap) {

            $scope.ok = ok;
            $scope.cancel = cancel;
            $scope.gmap = gmap;

            $modalInstance.opened.then(function () {
                // When modal has been opened
                // set to true the initialization param
                //$timeout(function () {
                //    $scope.initGmap = true;
                //});
                $scope.initGmap = true;
            });

            function ok() {
                $modalInstance.close('closed');
            }

            function cancel() {
                $modalInstance.dismiss('cancel');
            }
        }
    }
})();
