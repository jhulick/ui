/**=========================================================
 * Module: navbar-search.js
 * Navbar search toggler * Auto dismiss on ESC key
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('searchOpen', SearchOpen);

    SearchOpen.$inject = ['navSearch'];

    function SearchOpen(navSearch) {

        var directive = {
            controller: controller,
            restrict: 'A'
        };
        return directive;

        /////////////////////////////////////

        function controller($scope, $element) {
            $element
                .on('click', function (e) { e.stopPropagation(); })
                .on('click', navSearch.toggle);
        }
    }
})();


(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('searchDismiss', ['navSearch', SearchDismiss]);

    SearchDismiss.$inject = ['navSearch'];

    function SearchDismiss(navSearch) {

        var inputSelector = '.navbar-form input[type="text"]';

        var directive = {
            controller: controller,
            restrict: 'A'
        };
        return directive;

        /////////////////////////////////////

        function controller($scope, $element) {
            $(inputSelector)
                .on('click', function (e) {
                    e.stopPropagation();
                })
                .on('keyup', function (e) {
                    if (e.keyCode == 27) // ESC
                        navSearch.dismiss();
                });

            // click anywhere closes the search
            $(document).on('click', navSearch.dismiss);
            // dismissable options
            $element
                .on('click', function (e) {
                    e.stopPropagation();
                })
                .on('click', navSearch.dismiss);
        }

    }
})();

