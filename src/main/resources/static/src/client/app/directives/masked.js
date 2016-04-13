/**=========================================================
 * Module: masked,js
 * Initializes the masked inputs
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('masked', Masked);

    ////////////////////////////

    function Masked() {

        var directive = {
            controller: controller,
            restrict: 'A'
        };

        return directive;

        function controller($scope, $element) {
            var $elem = $($element);
            if ($.fn.inputmask)
                $elem.inputmask();
        }
    }
})();