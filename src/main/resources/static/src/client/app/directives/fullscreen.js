/**=========================================================
 * Module: fullscreen.js
 * Toggle the fullscreen mode on/off
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('toggleFullscreen', ToggleFullscreen);

    function ToggleFullscreen() {

        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        /////////////////////////////////////

        function link(scope, element, attrs) {
            element.on('click', function (e) {
                e.preventDefault();
                if (screenfull.enabled) {
                    screenfull.toggle();
                    // Switch icon indicator
                    if (screenfull.isFullscreen)
                        $(this).children('em').removeClass('fa-expand').addClass('fa-compress');
                    else
                        $(this).children('em').removeClass('fa-compress').addClass('fa-expand');

                } else {
                    $.error('Fullscreen not enabled');
                }
            });
        }
    }

})();