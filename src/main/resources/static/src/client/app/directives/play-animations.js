/**=========================================================
 * Module: play-animation.js
 * Provides a simple way to run animation with a trigger
 * Requires animo.js
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('animate', Animate);

    Animate.$inject = ['$window', 'Utils'];

    function Animate($window, Utils) {

        var $scroller = $(window).add('body, .wrapper');

        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        /////////////////////////////////////

        function link(scope, elem, attrs) {
            // Parse animations params and attach trigger to scroll
            var $elem = $(elem),
                offset = $elem.data('offset'),
                delay = $elem.data('delay') || 100, // milliseconds
                animation = $elem.data('play') || 'bounce';

            if (typeof offset !== 'undefined') {
                // test if the element starts visible
                testAnimation($elem);
                // test on scroll
                $scroller.scroll(function () {
                    testAnimation($elem);
                });
            }

            // Test an element visibilty and trigger the given animation
            function testAnimation(element) {
                if (!element.hasClass('anim-running') &&
                    Utils.isInView(element, {topoffset: offset})) {
                    element.addClass('anim-running');

                    setTimeout(function () {
                        element
                            .addClass('anim-done')
                            .animo({animation: animation, duration: 0.7});
                    }, delay);
                }
            }

            // Run click triggered animations
            $elem.on('click', function () {
                var $elem = $(this),
                    targetSel = $elem.data('target'),
                    animation = $elem.data('play') || 'bounce',
                    target = $(targetSel);

                if (target && target) {
                    target.animo({animation: animation});
                }
            });
        }
    }
})();
