/**=========================================================
 * Module: masked,js
 * Initializes the jQuery UI slider controls
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('uiSlider', UiSlider);

    function UiSlider() {

        var directive = {
            controller: controller,
            restrict: 'A'
        };
        return directive;

        /////////////////////////////////////

        function controller($scope, $element) {
            var $elem = $($element);
            if ($.fn.slider) {
                $elem.slider();
            }
        }
    }
})();