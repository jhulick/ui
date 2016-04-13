/**=========================================================
 * Module: validate-form.js
 * Initializes the validation plugin Parsley
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('validateForm', ValidateForm);

    function ValidateForm() {

        var directive = {
            controller: controller,
            restrict: 'A'
        };
        return directive;

        /////////////////////////////////////

        function controller($scope, $element) {
            var $elem = $($element);
            if ($.fn.parsley) {
                $elem.parsley();
            }
        }
    }
})();