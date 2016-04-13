/**=========================================================
 * Module: classy-loader.js
 * Enable use of classyloader directly from data attributes
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('classyloader', Classyloader);

    Classyloader.$inject = ['$timeout', 'Utils'];

    function Classyloader($timeout, Utils) {

        var $scroller = $(window),
            inViewFlagClass = 'js-is-in-view'; // a classname to detect when a chart has been triggered after scroll

        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        /////////////////////////////////////

        function link(scope, element, attrs) {
            // run after interpolation
            $timeout(function () {
                var $element = $(element),
                    options = $element.data();

                // At lease we need a data-percentage attribute
                if (options) {
                    if (options.triggerInView) {
                        $scroller.scroll(function () {
                            checkLoaderInVIew($element, options);
                        });
                        // if the element starts already in view
                        checkLoaderInVIew($element, options);
                    } else
                        startLoader($element, options);
                }
            }, 0);

            function checkLoaderInVIew(element, options) {
                var offset = -20;
                if (!element.hasClass(inViewFlagClass) &&
                    Utils.isInView(element, {topoffset: offset})) {
                    startLoader(element, options);
                }
            }

            function startLoader(element, options) {
                element.ClassyLoader(options).addClass(inViewFlagClass);
            }
        }
    }

})();
