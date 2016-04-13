/**=========================================================
 * Module: animate-enabled.js
 * Enable or disables ngAnimate for element with directive
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('animateEnabled', AnimateEnabled);

    AnimateEnabled.$inject = ['$animate'];

    function AnimateEnabled($animate) {

        var directive = {
            link: link
        };
        return directive;

        /////////////////////////////////////

        function link(scope, element, attrs) {
            scope.$watch(function () {
                return scope.$eval(attrs.animateEnabled, scope);
            }, function (newValue) {
                $animate.enabled(!!newValue, element);
            });
        }
    }

})();
