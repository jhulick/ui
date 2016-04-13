/**=========================================================
 * Module: tags-input.js
 * Initializes the tag inputs plugin
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('tagsinput', Tagsinput);

    Tagsinput.$inject = ['$timeout'];

    function Tagsinput($timeout) {

        var directive = {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };
        return directive;

        /////////////////////////////////////

        function link(scope, element, attrs, ngModel) {
            element.on('itemAdded itemRemoved', function () {
                // check if view value is not empty and is a string
                // and update the view from string to an array of tags
                if (ngModel.$viewValue && ngModel.$viewValue.split) {
                    ngModel.$setViewValue(ngModel.$viewValue.split(','));
                    ngModel.$render();
                }
            });

            $timeout(function () {
                element.tagsinput();
            });
        }
    }

})();
