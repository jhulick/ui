/**=========================================================
 * Module: now.js
 * Provides a simple way to display the current time formatted
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('now', Now);

    Now.$inject = ['dateFilter', '$interval'];

    function Now(dateFilter, $interval) {

        var directive = {
            link: link,
            restrict: 'E'
        };
        return directive;

        /////////////////////////////////////

        function link(scope, element, attrs) {
            var format = attrs.format;
            function updateTime() {
                var dt = dateFilter(new Date(), format);
                element.text(dt);
            }
            updateTime();
            $interval(updateTime, 1000);
        }
    }
})();
