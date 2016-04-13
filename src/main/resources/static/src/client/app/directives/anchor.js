/**=========================================================
 * Module: anchor.js
 * Disables null anchor behavior
 =========================================================*/
(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('href', function () {

            var directive = {
                compile: compile,
                restrict: 'A'
            };
            return directive;

            /////////////////////////////////////

            function compile(element, attr) {
                return function (scope, element) {
                    if (attr.ngClick || attr.href === '' || attr.href === '#') {
                        if (!element.hasClass('dropdown-toggle')) {
                            element.on('click', function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                            });
                        }
                    }
                };
            }

        })
})();
