(function() {
    'use strict';

    angular
        .module('app.forms')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());

        function getStates() {
            return [
                {
                    state: 'app.form-standard',
                    config: {
                        url: '/form-standard',
                        title: 'Form Standard',
                        templateUrl: routerHelper.basepath('form-standard.html')
                    }
                },
                {
                    state: 'app.form-extended',
                    config: {
                        url: '/form-extended',
                        title: 'Form Extended',
                        templateUrl: routerHelper.basepath('form-extended.html'),
                        resolve: routerHelper.resolveFor('codemirror', 'moment', 'taginput', 'inputmask', 'localytics.directives', 'slider', 'ngWig', 'filestyle')
                    }
                },
                {
                    state: 'app.form-validation',
                    config: {
                        url: '/form-validation',
                        title: 'Form Validation',
                        templateUrl: routerHelper.basepath('form-validation.html'),
                        resolve: routerHelper.resolveFor('parsley')
                    }
                },
                {
                    state: 'app.form-wizard',
                    config: {
                        url: '/form-wizard',
                        title: 'Form Wizard',
                        templateUrl: routerHelper.basepath('form-wizard.html'),
                        resolve: routerHelper.resolveFor('parsley')
                    }
                },
                {
                    state: 'app.form-upload',
                    config: {
                        url: '/form-upload',
                        title: 'Form upload',
                        templateUrl: routerHelper.basepath('form-upload.html'),
                        resolve: routerHelper.resolveFor('angularFileUpload', 'filestyle')
                    }
                },
                {
                    state: 'app.form-xeditable',
                    config: {
                        url: '/form-xeditable',
                        templateUrl: routerHelper.basepath('form-xeditable.html'),
                        resolve: routerHelper.resolveFor('xeditable')
                    }
                },
                {
                    state: 'app.form-imagecrop',
                    config: {
                        url: '/form-imagecrop',
                        templateUrl: routerHelper.basepath('form-imagecrop.html'),
                        resolve: routerHelper.resolveFor('ngImgCrop', 'filestyle')
                    }
                },
                {
                    state: 'app.form-uiselect',
                    config: {
                        url: '/form-uiselect',
                        templateUrl: routerHelper.basepath('form-uiselect.html'),
                        controller: 'uiSelectController',
                        resolve: routerHelper.resolveFor('ui.select')
                    }
                }
            ];
        }
    }
})();
