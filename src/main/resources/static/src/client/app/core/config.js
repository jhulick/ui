/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

(function() {
    'use strict';

    var app = angular.module('app.core');

    app.config(configureStateHelper);
    app.config(configure);
    app.config(lazyLoader);
    app.config(translation);
    app.config(dynamicLocale);
    app.config(loadingBar);
    app.config(idleTimer);
    app.config(registry);


    ///////////////////////////////////////

    configure.$inject = ['$locationProvider', '$urlRouterProvider', 'routerHelperProvider'];

    function configure($locationProvider, $urlRouterProvider, routerHelperProvider) {

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/app/dashboard');

        var appStates = [

            {
                state: 'page',
                config: {
                    url: '/page',
                    templateUrl: 'build/pages/page.html',
                    resolve: routerHelperProvider.resolveFor('modernizr', 'icons', 'parsley'),
                    controller: function ($rootScope) {
                        $rootScope.app.layout.isBoxed = false;
                    }
                }
            },
            {
                state: 'page.recover',
                config: {
                    url: '/recover',
                    title: "Recover",
                    templateUrl: 'build/pages/recover.html'
                }
            },
            {
                state: 'page.lock',
                config: {
                    url: '/lock',
                    title: "Lock",
                    templateUrl: 'build/pages/lock.html'
                }
            },
            {
                state: 'page.404',
                config: {
                    url: '/404',
                    title: "Not Found",
                    templateUrl: 'build/pages/404.html'
                }
            }

        ];
        routerHelperProvider.configureStates(appStates);
    }

    //IdleProvider

    idleTimer.$inject = ['IdleProvider'];

    function idleTimer(IdleProvider) {
        // Configure Idle settings
        IdleProvider.idle(5); // in seconds
        IdleProvider.timeout(120); // in seconds
    }

    configureStateHelper.$inject = ['routerHelperProvider'];

    function configureStateHelper(routerHelperProvider) {
        var resolveAlways = { /* @ngInject */
        };

        routerHelperProvider.configure({
            docTitle: 'MAX UI: ',
            resolveAlways: resolveAlways
        });
    }

    lazyLoader.$inject = ['$ocLazyLoadProvider', 'APP_REQUIRES'];

    function lazyLoader($ocLazyLoadProvider, APP_REQUIRES) {

        // Lazy Load modules configuration
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: APP_REQUIRES.modules
        });

    }

    translation.$inject = ['$translateProvider'];

    function translation($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'build/i18n/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useLocalStorage();
        $translateProvider.usePostCompiling(true);
    }


    dynamicLocale.$inject = ['tmhDynamicLocaleProvider'];

    function dynamicLocale(tmhDynamicLocaleProvider) {
        tmhDynamicLocaleProvider.localeLocationPattern('build/vendor/angular-i18n/angular-locale_{{locale}}.js');
        // tmhDynamicLocaleProvider.useStorage('$cookieStore');
    }


    loadingBar.$inject = ['cfpLoadingBarProvider'];

    function loadingBar(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 500;
        cfpLoadingBarProvider.parentSelector = '.wrapper > section';
    }


    registry.$inject = ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide'];

    function registry($controllerProvider, $compileProvider, $filterProvider, $provide) {
        // for registering components after bootstrap
        App.controller = $controllerProvider.register;
        App.directive = $compileProvider.directive;
        App.filter = $filterProvider.register;
        App.factory = $provide.factory;
        App.service = $provide.service;
        App.constant = $provide.constant;
        App.value = $provide.value;
    }

})();
