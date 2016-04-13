/**=========================================================
 * Module: sparkline.js
 * SparkLines Mini Charts
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('sparkline', Sparkline);

    Sparkline.$inject = ['$timeout', '$window'];

    function Sparkline($timeout, $window) {

        var directive = {
            restrict: 'EA',
            controller: controller
        };
        return directive;

        /////////////////////////////////////

        function controller($scope, $element) {
            var runSL = function () {
                initSparLine($element);
            };

            $timeout(runSL);
        }

        function initSparLine($element) {
            var options = $element.data();

            options.type = options.type || 'bar'; // default chart is bar
            options.disableHiddenCheck = true;

            $element.sparkline('html', options);

            if (options.resize) {
                $(window).resize(function () {
                    $element.sparkline('html', options);
                });
            }
        }
    }

})();
