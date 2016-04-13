/**=========================================================
 * Module: scroll.js
 * Make a content box scrollable
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('scrollable', Scrollable);

    function Scrollable() {

        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;

        /////////////////////////////////////

        function link(scope, elem, attrs) {
            var defaultHeight = 250;
            elem.slimScroll({
                height: (attrs.height || defaultHeight)
            });
        }
    }
})();