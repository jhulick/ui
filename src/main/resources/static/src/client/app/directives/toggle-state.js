/**=========================================================
 * Module: toggle-state.js
 * Toggle a classname from the BODY Useful to change a state that
 * affects globally the entire layout or more than one item
 * Targeted elements must have [toggle-state="CLASS-NAME-TO-TOGGLE"]
 * User no-persist to avoid saving the sate in browser storage
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('toggleState', ToggleState);

    ToggleState.$inject = ['toggleStateService'];

    function ToggleState(toggle) {

        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        /////////////////////////////////////

        function link(scope, element, attrs) {

            var $body = $('body');
            $(element)
                .on('click', function (e) {
                    e.preventDefault();
                    var classname = attrs.toggleState;

                    if (classname) {
                        if ($body.hasClass(classname)) {
                            $body.removeClass(classname);
                            if (!attrs.noPersist) {
                                toggle.removeState(classname);
                            }
                        } else {
                            $body.addClass(classname);
                            if (!attrs.noPersist) {
                                toggle.addState(classname);
                            }
                        }

                    }

                });
        }
    }
})();
