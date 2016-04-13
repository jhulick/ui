/**=========================================================
 * Module: app.localization
 * Demo for locale settings
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.localization')
        .controller('LocalizationController', LocalizationController);

    LocalizationController.$inject = ['$rootScope', 'tmhDynamicLocale', '$locale', 'logger'];

    function LocalizationController($rootScope, tmhDynamicLocale, $locale, logger) {

        // required for inner references
        var vm = this;

        vm.title = "LocalizationController";

        activate();

        function activate() {
            logger.info('Activated LocalizationController View');
            init();
        }

        function init() {
            $rootScope.availableLocales = {
                'en': 'English',
                'es': 'Spanish',
                'de': 'German',
                'fr': 'French',
                'ar': 'Arabic',
                'ja': 'Japanese',
                'ko': 'Korean',
                'zh': 'Chinese'
            };

            $rootScope.model = {selectedLocale: 'en'};
            $rootScope.$locale = $locale;
            $rootScope.changeLocale = tmhDynamicLocale.set;
        }


    }
})();
