/**=========================================================
 * Module: filestyle.js
 * Initializes the fielstyle plugin
 =========================================================*/
(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('filestyle', Filestyle);

    ////////////////////////////

    function Filestyle() {

        var directive = {
            controller: controller,
            restrict: 'A'
        };

        return directive;

        function controller($scope, $element) {
            var options = $element.data();

            // old usage support
            options.classInput = $element.data('classinput') || options.classInput;

            $element.filestyle(options);
        }
    }
})();
