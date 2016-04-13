/**=========================================================
 * Module: nav-search.js
 * Services to share navbar search functions
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .service('navSearch', navSearch);

    function navSearch() {

        var navbarFormSelector = 'form.navbar-form';

        var service = {
            toggle: toggle,
            dismiss: dismiss
        };
        return service;

        /////////////////////////////////////

        function toggle() {
            var navbarForm = $(navbarFormSelector);
            navbarForm.toggleClass('open');
            var isOpen = navbarForm.hasClass('open');
            navbarForm.find('input')[isOpen ? 'focus' : 'blur']();
        }

        function dismiss() {
            $(navbarFormSelector)
                .removeClass('open')      // Close control
                .find('input[type="text"]').blur() // remove focus
                .val('');                    // Empty input
        }
    }
})();
