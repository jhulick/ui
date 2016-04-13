/**=========================================================
 * Module: clear-storage.js
 * Removes a key from the browser storage via element click
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('resetKey', ResetKey);

    ResetKey.$inject = ['$state', '$rootScope'];

    function ResetKey($state, $rootScope) {

        var directive = {
            restrict: 'A',
            scope: {
                resetKey: '='
            },
            link: link,
            controller: controller
        };
        return directive;

        /////////////////////////////////////

        function link(scope, element, attrs) {
            scope.resetKey = attrs.resetKey;
        }

        function controller($scope, $element) {
            $element.on('click', function (e) {
                e.preventDefault();

                if ($scope.resetKey) {
                    delete $rootScope.$storage[$scope.resetKey];
                    $state.go($state.current, {}, {reload: true});
                } else {
                    $.error('No storage key specified for reset.');
                }
            });
        }
    }
})();
