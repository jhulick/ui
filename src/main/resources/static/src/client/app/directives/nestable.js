/**=========================================================
 * Module: nestable.js
 * Initializes the nestable plugin
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('nestable', Nestable);

    Nestable.$inject = ['$timeout'];

    function Nestable($timeout) {

        var directive = {
            scope: {
                'nestableControl': '='
            },
            controller: controller,
            restrict: 'A'
        };

        return directive;

        //////////////////////////////

        function controller($scope, $element) {
            var options = $element.data();

            $timeout(function () {
                $element.nestable();
            });

            if ($scope.nestableControl) {
                var nest = $scope.nestableControl;
                nest.serialize = function () {
                    return $element.nestable('serialize');
                };
                nest.expandAll = runMethod('expandAll');
                nest.collapseAll = runMethod('collapseAll');

                $element.on('change', function () {
                    if (typeof nest.onchange === 'function') {
                        $timeout(function () {
                            nest.onchange.apply(arguments);
                        });
                    }
                });
            }

            function runMethod(name) {
                return function () {
                    $element.nestable(name);
                };
            }
        }
    }
})();
