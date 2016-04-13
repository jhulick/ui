
/**
 * @ngdoc module
 * @name app
 * @description Defines the AngularJs application module and initializes submodules
 */


if (typeof $ === 'undefined') {
    throw new Error('This application\'s JavaScript requires jQuery');
}

var App = angular.module('max-ui', [

    'app.core',

    /* Feature areas */
    'app.layout',
    'app.dashboard',
    'app.sidebar',
    'app.forms',
    'app.tables',
    'app.charts',
    'app.maps',
    'app.documentation'
]);

App.run(['appStart', function (appStart) {
    appStart.start();
}]);


/**
 * @ngdoc factory
 * @name appStart
 * @description
 *     The application startup function, called in the app module's run block.
 *     Create apart from app.js so it can easily be stubbed out during testing
 *     or tested independently
 */

(function() {
    'use strict';

    angular
        .module('max-ui')
        .factory('appStart', startup);

    startup.$inject = [
        '$rootScope', '$state', '$stateParams',  '$window', '$templateCache'
    ];

    function startup($rootScope, $state, $stateParams, $window, $templateCache) {
        var appStart = {
            start: start
        };
        return appStart;

        //////////////////////

        function start() {
            // Set reference to access them from any scope
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$storage = $window.localStorage;

            // Uncomment this to disable template cache
            /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
             if (typeof(toState) !== 'undefined'){
             $templateCache.remove(toState.templateUrl);
             }
             });*/

            // Scope Globals
            // -----------------------------------
            $rootScope.app = {
                name: 'MAX UI',
                description: 'MAX PaaS Angular Bootstrap',
                year: ((new Date()).getFullYear()),
                layout: {
                    isFixed: true,
                    isCollapsed: false,
                    isBoxed: false,
                    isRTL: false,
                    horizontal: false,
                    isFloat: false,
                    asideHover: false
                },
                useFullLayout: false,
                hiddenFooter: false,
                viewAnimation: 'ng-fadeInUp'
            }

            $rootScope.user = {
                name: 'Jeremy',
                job: 'ng-Dev',
                picture: 'build/img/dummy.png'
            }
        }
    }

})();


/**
 * @ngdoc module
 * @name app.core
 * @description Defines the core AngularJs application module and initializes submodules
 */
(function() {
    'use strict';

    angular.module('app.core', [

        /*
         * Angular modules
         */
        'ngAnimate',
        'ngStorage',
        'ngCookies',
        'ngSanitize',
        'ngResource',
        'ngAria',

        /*
         * Reusable cross app code modules
         */
        'blocks.exception',
        'blocks.logger',

        /*
         * 3rd Party modules
         */
        'pascalprecht.translate',
        'ui.bootstrap',
        'ui.router',
        'oc.lazyLoad',
        'cfp.loadingBar',
        'tmh.dynamicLocale',
        'ui.utils',
        'ngIdle'
    ]);
})();

(function() {
    'use strict';

    angular.module('blocks.logger', []);
})();

(function() {
    'use strict';

    angular
        .module('blocks.logger')
        .factory('logger', logger);

    logger.$inject = ['$log', 'toastr'];

    function logger($log, toastr) {
        var service = {
            showToasts: true,

            error   : error,
            info    : info,
            success : success,
            warning : warning,

            // straight to console; bypass toastr
            log     : $log.log
        };

        return service;
        /////////////////////

        function error(message, data, title) {
            toastr.error(message, title);
            $log.error('Error: ' + message, data);
        }

        function info(message, data, title) {
            toastr.info(message, title);
            $log.info('Info: ' + message, data);
        }

        function success(message, data, title) {
            toastr.success(message, title);
            $log.info('Success: ' + message, data);
        }

        function warning(message, data, title) {
            toastr.warning(message, title);
            $log.warn('Warning: ' + message, data);
        }
    }
}());

/* Help configure the state-base ui.router */
(function () {
    'use strict';

    angular
        .module('app.core')
        .provider('routerHelper', routerHelperProvider);

    routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider', 'APP_REQUIRES'];

    /* @ngInject */
    function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider, appRequires) {

        /* jshint validthis:true */
        var config = {
            docTitle: undefined,
            resolveAlways: {}
        };

        // Set here the base of the relative path
        // for all app views
        this.basepath = function (uri) {
            return '../../build/views/' + uri;
        };

        $locationProvider.html5Mode(true);

        this.configure = function (cfg) {
            angular.extend(config, cfg);
        };

        this.$get = RouterHelper;
        RouterHelper.$inject = ['$location', '$rootScope', '$state', 'logger'];

        /* @ngInject */
        function RouterHelper($location, $rootScope, $state, logger) {
            var handlingStateChangeError = false;
            var hasOtherwise = false;
            var stateCounts = {
                errors: 0,
                changes: 0
            };

            var service = {
                configureStates: configureStates,
                getStates: getStates,
                resolveFor: resolveFor,
                basepath: basepath,
                stateCounts: stateCounts
            };

            init();

            return service;

            ///////////////

            // Set here the base of the relative path
            // for all app views
            function basepath(uri) {
                return 'build/views/' + uri;
            }

            function configureStates(states, otherwisePath) {
                states.forEach(function (state) {
                    state.config.resolve =
                        angular.extend(state.config.resolve || {}, config.resolveAlways);
                    $stateProvider.state(state.state, state.config);
                });
                if (otherwisePath && !hasOtherwise) {
                    hasOtherwise = true;
                    $urlRouterProvider.otherwise(otherwisePath);
                }
            }

            function handleRoutingErrors() {
                // Route cancellation:
                // On routing error, go to the dashboard.
                // Provide an exit clause if it tries to do it twice.
                $rootScope.$on('$stateChangeError',
                    function (event, toState, toParams, fromState, fromParams, error) {
                        if (handlingStateChangeError) {
                            return;
                        }
                        stateCounts.errors++;
                        handlingStateChangeError = true;
                        var destination = (toState &&
                            (toState.title || toState.name || toState.loadedTemplateUrl)) ||
                            'unknown target';
                        var msg = 'Error routing to ' + destination + '. ' +
                            (error.data || '') + '. <br/>' + (error.statusText || '') +
                            ': ' + (error.status || '');
                        logger.warning(msg, [toState]);
                        $location.path('/');
                    }
                );
            }

            // Generates a resolve object by passing script names
            // previously configured in constant.APP_REQUIRES
            function resolveFor() {
                var _args = arguments;
                return {
                    deps: ['$ocLazyLoad', '$q', function ($ocLL, $q) {
                        // Creates a promise chain for each argument
                        var promise = $q.when(1); // empty promise
                        for (var i = 0, len = _args.length; i < len; i++) {
                            promise = andThen(_args[i]);
                        }
                        return promise;

                        // creates promise to chain dynamically
                        function andThen(_arg) {
                            // also support a function that returns a promise
                            if (typeof _arg == 'function') {
                                return promise.then(_arg);
                            } else {
                                return promise.then(function () {
                                    // if is a module, pass the name. If not, pass the array
                                    var whatToLoad = getRequired(_arg);
                                    // simple error check
                                    if (!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                                    // finally, return a promise
                                    return $ocLL.load(whatToLoad);
                                });
                            }
                        }

                        // check and returns required data
                        // analyze module items with the form [name: '', files: []]
                        // and also simple array of script files (for not angular js)
                        function getRequired(name) {
                            if (appRequires.modules) {
                                for (var m in appRequires.modules) {
                                    if (appRequires.modules[m].name && appRequires.modules[m].name === name) {
                                        return appRequires.modules[m];
                                    }
                                }
                            }
                            return appRequires.scripts && appRequires.scripts[name];
                        }

                    }]
                };
            } // resolveFor

            function init() {
                handleRoutingErrors();
                updateDocTitle();
            }

            function getStates() {
                return $state.get();
            }

            function updateDocTitle() {
                $rootScope.$on('$stateChangeSuccess',
                    function (event, toState, toParams, fromState, fromParams) {
                        stateCounts.changes++;
                        handlingStateChangeError = false;
                        var title = config.docTitle + ' ' + (toState.title || '');
                        $rootScope.title = title; // data bind to <title>
                    }
                );
            }
        }

        this.configureStates = function (states, otherwisePath) {
            states.forEach(function (state) {
                state.config.resolve =
                    angular.extend(state.config.resolve || {}, config.resolveAlways);
                $stateProvider.state(state.state, state.config);
            });
            if (otherwisePath && !hasOtherwise) {
                hasOtherwise = true;
                $urlRouterProvider.otherwise(otherwisePath);
            }
        }

        // Generates a resolve object by passing script names
        // previously configured in constant.APP_REQUIRES
        this.resolveFor = function () {
            var _args = arguments;
            return {
                deps: ['$ocLazyLoad', '$q', function ($ocLL, $q) {
                    // Creates a promise chain for each argument
                    var promise = $q.when(1); // empty promise
                    for (var i = 0, len = _args.length; i < len; i++) {
                        promise = andThen(_args[i]);
                    }
                    return promise;

                    // creates promise to chain dynamically
                    function andThen(_arg) {
                        // also support a function that returns a promise
                        if (typeof _arg == 'function') {
                            return promise.then(_arg);
                        } else {
                            return promise.then(function () {
                                // if is a module, pass the name. If not, pass the array
                                var whatToLoad = getRequired(_arg);
                                // simple error check
                                if (!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                                // finally, return a promise
                                return $ocLL.load(whatToLoad);
                            });
                        }
                    }

                    // check and returns required data
                    // analyze module items with the form [name: '', files: []]
                    // and also simple array of script files (for not angular js)
                    function getRequired(name) {
                        if (appRequires.modules) {
                            for (var m in appRequires.modules) {
                                if (appRequires.modules[m].name && appRequires.modules[m].name === name) {
                                    return appRequires.modules[m];
                                }
                            }
                        }
                        return appRequires.scripts && appRequires.scripts[name];
                    }

                }]
            };
        }; // resolveFor
    }
})();


/**
 * @ngdoc module
 * @name blocks.exception
 * @description Defines the AngularJs exception handling module.
 */

(function() {
    'use strict';

    angular.module('blocks.exception', ['blocks.logger']);
})();


/**
 * @ngdoc service
 * @name exception
 * @description
 *     Exception handling for the application.
 */
(function() {
    'use strict';

    angular
        .module('blocks.exception')
        .factory('exception', exception);

    exception.$inject = ['logger'];

    /**
     * @ngdoc method
     * @name exception#exception
     * @description
     *     Catch AngularJs exceptions and XHR exceptions and log to logger
     * @return {Object} exception service
     */
    /* @ngInject */
    function exception(logger) {
        var service = {
            catcher: catcher
        };
        return service;

        function catcher(message) {
            return function(reason) {
                logger.error(message, reason);
            };
        }
    }
})();

// Include in index.html so that app level exceptions are handled.
// Exclude from testRunner.html which should run exactly what it wants to run
(function() {
    'use strict';

    angular
        .module('blocks.exception')
        .provider('exceptionHandler', exceptionHandlerProvider)
        .config(config);

    /**
     * Must configure the exception handling
     * @return {[type]}
     */
    function exceptionHandlerProvider() {
        /* jshint validthis:true */
        this.config = {
            appErrorPrefix: undefined
        };

        this.configure = function (appErrorPrefix) {
            this.config.appErrorPrefix = appErrorPrefix;
        };

        this.$get = function() {
            return {config: this.config};
        };
    }

    /**
     * Configure by setting an optional string value for appErrorPrefix.
     * Accessible via config.appErrorPrefix (via config value).
     * @param  {[type]} $provide
     * @return {[type]}
     * @ngInject
     */
    function config($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    extendExceptionHandler.$inject = ['$delegate', '$injector', 'exceptionHandler'];

    /**
     * Extend the $exceptionHandler service to also display a toast.
     * @param  {Object} $delegate
     * @param  {Object} exceptionHandler
     * @param  {Object} logger
     * @return {Function} the decorated $exceptionHandler service
     */
    function extendExceptionHandler($delegate, $injector, exceptionHandler) {
        return function(exception, cause) {
            var appErrorPrefix = exceptionHandler.config.appErrorPrefix || '';
            var errorData = {exception: exception, cause: cause};
            exception.message = appErrorPrefix + exception.message;
            $delegate(exception, cause);
            /**
             * Could add the error to a service's collection,
             * add errors to $rootScope, log errors to remote web server,
             * or log locally. Or throw hard. It is entirely up to you.
             * throw exception;
             *
             * @example
             *     throw { message: 'error message we added' };
             */
            var logger = $injector.get('logger');
            logger.error(exception.message, errorData);
        };
    }
})();

/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/

/**
 * @ngdoc constant
 * @name max-ui
 * @description Defines the AngularJs application constants
 */
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('toastr', window.toastr)
        .constant('APP_COLORS', {
            'primary': '#5d9cec',
            'success': '#27c24c',
            'info': '#23b7e5',
            'warning': '#ff902b',
            'danger': '#f05050',
            'inverse': '#131e26',
            'green': '#37bc9b',
            'pink': '#f532e5',
            'purple': '#7266ba',
            'dark': '#3a3f51',
            'yellow': '#fad732',
            'gray-darker': '#232735',
            'gray-dark': '#3a3f51',
            'gray': '#dde6e9',
            'gray-light': '#e4eaec',
            'gray-lighter': '#edf1f2'
        })
        .constant('APP_MEDIAQUERY', {
            'desktopLG': 1200,
            'desktop': 992,
            'tablet': 768,
            'mobile': 480
        })
        .constant('APP_REQUIRES', {
            // jQuery based and standalone scripts
            scripts: {
                'whirl': ['build/vendor/whirl/dist/whirl.css'],
                'classyloader': ['build/vendor/jquery-classyloader/js/jquery.classyloader.min.js'],
                'animo': ['build/vendor/animo.js/animo.js'],
                'fastclick': ['build/vendor/fastclick/lib/fastclick.js'],
                'modernizr': ['build/vendor/modernizr/modernizr.js'],
                'animate': ['build/vendor/animate.css/animate.min.css'],
                'icons': [
                    'build/vendor/fontawesome/css/font-awesome.min.css',
                    'build/vendor/simple-line-icons/css/simple-line-icons.css'
                ],
                'sparklines': ['build/vendor/sparklines/jquery.sparkline.min.js'],
                'slider': [
                    'build/vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
                    'build/vendor/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css'
                ],
                'wysiwyg': ['build/vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                    'build/vendor/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
                'slimscroll': ['build/vendor/slimScroll/jquery.slimscroll.min.js'],
                'screenfull': ['build/vendor/screenfull/dist/screenfull.js'],
                'vector-map': [
                    'build/vendor/ika.jvectormap/jquery-jvectormap-2.0.2.min.js',
                    'build/vendor/ika.jvectormap/jquery-jvectormap-2.0.2.css'
                ],
                'loadGoogleMapsJS': ['build/vendor/gmap/load-google-maps.js'],
                'google-map': ['build/vendor/jQuery-gMap/jquery.gmap.min.js'],
                'flot-chart': ['build/vendor/Flot/jquery.flot.js'],
                'flot-chart-plugins': [
                    'build/vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
                    'build/vendor/Flot/jquery.flot.resize.js',
                    'build/vendor/Flot/jquery.flot.pie.js',
                    'build/vendor/Flot/jquery.flot.time.js',
                    'build/vendor/Flot/jquery.flot.categories.js',
                    'build/vendor/flot-spline/js/jquery.flot.spline.min.js'],
                // jquery core and widgets
                'jquery-ui': [
                    'build/vendor/jquery-ui/ui/core.js',
                    'build/vendor/jquery-ui/ui/widget.js'],
                // loads only jquery required modules and touch support
                'jquery-ui-widgets': [
                    'build/vendor/jquery-ui/ui/core.js',
                    'build/vendor/jquery-ui/ui/widget.js',
                    'build/vendor/jquery-ui/ui/mouse.js',
                    'build/vendor/jquery-ui/ui/draggable.js',
                    'build/vendor/jquery-ui/ui/droppable.js',
                    'build/vendor/jquery-ui/ui/sortable.js',
                    'build/vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'
                ],
                'moment': ['build/vendor/moment/min/moment-with-locales.min.js'],
                'inputmask': ['build/vendor/jquery.inputmask/dist/jquery.inputmask.bundle.min.js'],
                'flatdoc': ['build/vendor/flatdoc/flatdoc.js'],
                'codemirror': [
                    'build/vendor/codemirror/lib/codemirror.js',
                    'build/vendor/codemirror/lib/codemirror.css'
                ],
                // modes for common web files
                'codemirror-modes-web': [
                    'build/vendor/codemirror/mode/javascript/javascript.js',
                    'build/vendor/codemirror/mode/xml/xml.js',
                    'build/vendor/codemirror/mode/htmlmixed/htmlmixed.js',
                    'build/vendor/codemirror/mode/css/css.js'
                ],
                'taginput': [
                    'build/vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
                    'build/vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js'
                ],
                'filestyle': ['build/vendor/bootstrap-filestyle/src/bootstrap-filestyle.js'],
                'parsley': ['build/vendor/parsleyjs/dist/parsley.min.js'],
                'datatables': [
                    'build/vendor/datatables/media/js/jquery.dataTables.min.js',
                    'build/vendor/datatable-bootstrap/css/dataTables.bootstrap.css'
                ],
                'datatables-plugins': [
                    'build/vendor/datatable-bootstrap/js/dataTables.bootstrap.js',
                    'build/vendor/datatable-bootstrap/js/dataTables.bootstrapPagination.js',
                    'build/vendor/datatables-colvis/js/dataTables.colVis.js',
                    'build/vendor/datatables-colvis/css/dataTables.colVis.css'],
                'fullcalendar': [
                    'build/vendor/fullcalendar/dist/fullcalendar.min.js',
                    'build/vendor/fullcalendar/dist/fullcalendar.css'
                ],
                'gcal': ['build/vendor/fullcalendar/dist/gcal.js'],
                'nestable': ['build/vendor/nestable/jquery.nestable.js'],
                'chartjs': ['build/vendor/Chart.js/Chart.js']
            },
            // Angular based script (use the right module name)
            modules: [
                {
                    name: 'toaster',
                    files: [
                        'build/vendor/angularjs-toaster/toaster.js',
                        'build/vendor/angularjs-toaster/toaster.css'
                    ]
                },
                {
                    name: 'localytics.directives',
                    files: [
                        'build/vendor/chosen_v1.2.0/chosen.jquery.min.js',
                        'build/vendor/chosen_v1.2.0/chosen.min.css',
                        'build/vendor/angular-chosen-localytics/chosen.js'
                    ]
                },
                {
                    name: 'ngDialog',
                    files: [
                        'build/vendor/ngDialog/js/ngDialog.min.js',
                        'build/vendor/ngDialog/css/ngDialog.min.css',
                        'build/vendor/ngDialog/css/ngDialog-theme-default.min.css'
                    ]
                },
                {
                    name: 'ngWig',
                    files: ['build/vendor/ngWig/dist/ng-wig.min.js']},
                {
                    name: 'ngTable',
                    files: [
                        'build/vendor/ng-table/dist/ng-table.min.js',
                        'build/vendor/ng-table/dist/ng-table.min.css'
                    ]
                },
                {
                    name: 'ngTableExport',
                    files: ['build/vendor/ng-table-export/ng-table-export.js']
                },
                {
                    name: 'angularBootstrapNavTree',
                    files: [
                        'build/vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                        'build/vendor/angular-bootstrap-nav-tree/dist/abn_tree.css'
                    ]
                },
                {
                    name: 'htmlSortable',
                    files: [
                        'build/vendor/html.sortable/dist/html.sortable.js',
                        'build/vendor/html.sortable/dist/html.sortable.angular.js'
                    ]
                },
                {
                    name: 'xeditable',
                    files: [
                        'build/vendor/angular-xeditable/dist/js/xeditable.js',
                        'build/vendor/angular-xeditable/dist/css/xeditable.css'
                    ]
                },
                {
                    name: 'angularFileUpload',
                    files: ['build/vendor/angular-file-upload/angular-file-upload.js']
                },
                {
                    name: 'ngImgCrop',
                    files: [
                        'build/vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
                        'build/vendor/ng-img-crop/compile/unminified/ng-img-crop.css'
                    ]
                },
                {
                    name: 'ui.select',
                    files: [
                        'build/vendor/angular-ui-select/dist/select.js',
                        'build/vendor/angular-ui-select/dist/select.css'
                    ]
                },
                {
                    name: 'ui.codemirror',
                    files: ['build/vendor/angular-ui-codemirror/ui-codemirror.js']},
                {
                    name: 'angular-carousel',
                    files: [
                        'build/vendor/angular-carousel/dist/angular-carousel.css',
                        'build/vendor/angular-carousel/dist/angular-carousel.js'
                    ]
                },
                {
                    name: 'ngGrid',
                    files: [
                        'build/vendor/ng-grid/build/ng-grid.min.js',
                        'build/vendor/ng-grid/ng-grid.css'
                    ]
                },
                {
                    name: 'infinite-scroll',
                    files: ['build/vendor/ngInfiniteScroll/build/ng-infinite-scroll.js']
                }
            ]
        })
})();

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

/**=========================================================
 * Module: browser.js
 * Browser detection
 =========================================================*/
(function () {
    'use strict';

    angular
        .module('app.core')
        .service('browser', function () {

            var matched, browser;

            var uaMatch = function (ua) {
                ua = ua.toLowerCase();

                var match = /(opr)[\/]([\w.]+)/.exec(ua) ||
                    /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                    /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
                    /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                    /(msie) ([\w.]+)/.exec(ua) ||
                    ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) ||
                    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                    [];

                var platform_match = /(ipad)/.exec(ua) ||
                    /(iphone)/.exec(ua) ||
                    /(android)/.exec(ua) ||
                    /(windows phone)/.exec(ua) ||
                    /(win)/.exec(ua) ||
                    /(mac)/.exec(ua) ||
                    /(linux)/.exec(ua) ||
                    /(cros)/i.exec(ua) ||
                    [];

                return {
                    browser: match[3] || match[1] || "",
                    version: match[2] || "0",
                    platform: platform_match[0] || ""
                };
            };

            matched = uaMatch(window.navigator.userAgent);
            browser = {};

            if (matched.browser) {
                browser[matched.browser] = true;
                browser.version = matched.version;
                browser.versionNumber = parseInt(matched.version);
            }

            if (matched.platform) {
                browser[matched.platform] = true;
            }

            // These are all considered mobile platforms, meaning they run a mobile browser
            if (browser.android || browser.ipad || browser.iphone || browser["windows phone"]) {
                browser.mobile = true;
            }

            // These are all considered desktop platforms, meaning they run a desktop browser
            if (browser.cros || browser.mac || browser.linux || browser.win) {
                browser.desktop = true;
            }

            // Chrome, Opera 15+ and Safari are webkit based browsers
            if (browser.chrome || browser.opr || browser.safari) {
                browser.webkit = true;
            }

            // IE11 has a new token so we will assign it msie to avoid breaking changes
            if (browser.rv) {
                var ie = "msie";

                matched.browser = ie;
                browser[ie] = true;
            }

            // Opera 15+ are identified as opr
            if (browser.opr) {
                var opera = "opera";

                matched.browser = opera;
                browser[opera] = true;
            }

            // Stock Android browsers are marked as Safari on Android.
            if (browser.safari && browser.android) {
                var android = "android";

                matched.browser = android;
                browser[android] = true;
            }

            // Assign the name and platform variable
            browser.name = matched.browser;
            browser.platform = matched.platform;

            return browser;
        });
})();

/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('colors', colors);

    colors.$inject = ['APP_COLORS'];

    function colors(colors) {

        var service = {
            byName: byName
        };

        return service;

        //////////////////////

        function byName(name) {
            return (colors[name] || '#fff');
        }
    }
})();

/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.core')
        .service('Utils', Utils);

    ////////////////////////////

    Utils.$inject = ['$window', 'APP_MEDIAQUERY'];

    function Utils($window, APP_MEDIAQUERY) {

        var $html = angular.element("html"),
            $win = angular.element($window),
            $body = angular.element('body');

        return {
            // DETECTION
            support: {
                transition: (function () {
                    var transitionEnd = (function () {

                        var element = document.body || document.documentElement,
                            transEndEventNames = {
                                WebkitTransition: 'webkitTransitionEnd',
                                MozTransition: 'transitionend',
                                OTransition: 'oTransitionEnd otransitionend',
                                transition: 'transitionend'
                            }, name;

                        for (name in transEndEventNames) {
                            if (element.style[name] !== undefined) return transEndEventNames[name];
                        }
                    }());

                    return transitionEnd && {end: transitionEnd};
                })(),
                animation: (function () {

                    var animationEnd = (function () {

                        var element = document.body || document.documentElement,
                            animEndEventNames = {
                                WebkitAnimation: 'webkitAnimationEnd',
                                MozAnimation: 'animationend',
                                OAnimation: 'oAnimationEnd oanimationend',
                                animation: 'animationend'
                            }, name;

                        for (name in animEndEventNames) {
                            if (element.style[name] !== undefined) return animEndEventNames[name];
                        }
                    }());

                    return animationEnd && {end: animationEnd};
                })(),
                requestAnimationFrame: window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                },
                touch: (
                ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
                (window.DocumentTouch && document instanceof window.DocumentTouch) ||
                (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
                (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
                false
                ),
                mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
            },
            // UTILITIES
            isInView: function (element, options) {

                var $element = $(element);

                if (!$element.is(':visible')) {
                    return false;
                }

                var window_left = $win.scrollLeft(),
                    window_top = $win.scrollTop(),
                    offset = $element.offset(),
                    left = offset.left,
                    top = offset.top;

                options = $.extend({topoffset: 0, leftoffset: 0}, options);

                if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
                    left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
                    return true;
                } else {
                    return false;
                }
            },
            langdirection: $html.attr("dir") == "rtl" ? "right" : "left",
            isTouch: function () {
                return $html.hasClass('touch');
            },
            isSidebarCollapsed: function () {
                return $body.hasClass('aside-collapsed');
            },
            isSidebarToggled: function () {
                return $body.hasClass('aside-toggled');
            },
            isMobile: function () {
                return $win.width() < APP_MEDIAQUERY.tablet;
            }
        };
    }
})();

(function() {
    'use strict';

    angular.module('app.layout', []);
})();

(function() {
    'use strict';

    angular
        .module('app.layout')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());

        function getStates() {
            return [
                {
                    state: 'app',
                    config: {
                        url: '/app',
                        abstract: true,
                        templateUrl: 'app/layout/views/app.html',
                        controller: 'Shell',
                        resolve: routerHelper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
                    }
                },
                {
                    state: 'app-h',
                    config: {
                        url: '/app-h',
                        abstract: true,
                        templateUrl: 'app/layout/views/app-h.html',
                        controller: 'Shell',
                        resolve: routerHelper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
                    }
                }
            ];
        }
    }
})();

/**=========================================================
 * Module: main.js
 * Main Application Controller
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('Shell', Shell);

    Shell.$inject = ['$rootScope', '$scope', '$state', '$translate', '$window', '$localStorage', '$timeout', 'toggleStateService', 'colors', 'browser', 'cfpLoadingBar'];

    function Shell($rootScope, $scope, $state, $translate, $window, $localStorage, $timeout, toggle, colors, browser, cfpLoadingBar) {

        // Setup the layout mode
        $rootScope.app.layout.horizontal = ($rootScope.$stateParams.layout == 'app-h');

        // Loading bar transition
        // -----------------------------------
        var thBar;
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if ($('.wrapper > section').length) {// check if bar container exists
                thBar = $timeout(function () {
                    cfpLoadingBar.start();
                }, 0); // sets a latency Threshold
            }
        });
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            event.targetScope.$watch("$viewContentLoaded", function () {
                $timeout.cancel(thBar);
                cfpLoadingBar.complete();
            });
        });

        // Hook not found
        $rootScope.$on('$stateNotFound',
            function (event, unfoundState, fromState, fromParams) {
                console.log(unfoundState.to); // "lazy.state"
                console.log(unfoundState.toParams); // {a:1, b:2}
                console.log(unfoundState.options); // {inherit:false} + default options
            });
        // Hook error
        $rootScope.$on('$stateChangeError',
            function (event, toState, toParams, fromState, fromParams, error) {
                console.log(error);
            });
        // Hook success
        $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
                // display new view from top
                $window.scrollTo(0, 0);
                // Save the route title
                $rootScope.currTitle = $state.current.title;
            });

        $rootScope.currTitle = $state.current.title;
        $rootScope.pageTitle = function () {
            var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
            document.title = title;
            return title;
        };

        // iPad may presents ghost click issues
        // if( ! browser.ipad )
        // FastClick.attach(document.body);

        // Close submenu when sidebar change from collapsed to normal
        $rootScope.$watch('app.layout.isCollapsed', function (newValue, oldValue) {
            if (newValue === false)
                $rootScope.$broadcast('closeSidebarMenu');
        });

        // Restore layout settings
        if (angular.isDefined($localStorage.layout))
            $scope.app.layout = $localStorage.layout;
        else
            $localStorage.layout = $scope.app.layout;

        $rootScope.$watch("app.layout", function () {
            $localStorage.layout = $scope.app.layout;
        }, true);


        // Allows to use branding color with interpolation
        // {{ colorByName('primary') }}
        $scope.colorByName = colors.byName;

        // Hides/show user avatar on sidebar
        $scope.toggleUserBlock = function () {
            $scope.$broadcast('toggleUserBlock');
        };

        // Internationalization
        // ----------------------

        $scope.language = {
            // Handles language dropdown
            listIsOpen: false,
            // list of available languages
            available: {
                'en': 'English',
                'es_AR': 'Español'
            },
            // display always the current ui language
            init: function () {
                var proposedLanguage = $translate.proposedLanguage() || $translate.use();
                var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in app.config
                $scope.language.selected = $scope.language.available[(proposedLanguage || preferredLanguage)];
            },
            set: function (localeId, ev) {
                // Set the new idiom
                $translate.use(localeId);
                // save a reference for the current language
                $scope.language.selected = $scope.language.available[localeId];
                // finally toggle dropdown
                $scope.language.listIsOpen = !$scope.language.listIsOpen;
            }
        };

        $scope.language.init();

        // Restore application classes state
        toggle.restoreState($(document.body));

        // cancel click event easily
        $rootScope.cancel = function ($event) {
            $event.stopPropagation();
        };

    }
})();

/**=========================================================
 * Module: sidebar-menu.js
 * Handle sidebar collapsible elements
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$rootScope', '$scope', '$state', '$http', '$timeout', 'Utils'];

    function SidebarController($rootScope, $scope, $state, $http, $timeout, Utils) {

        var collapseList = [];

        // demo: when switch from collapse to hover, close all items
        $rootScope.$watch('app.layout.asideHover', function (oldVal, newVal) {
            if (newVal === false && oldVal === true) {
                closeAllBut(-1);
            }
        });

        // Check item and children active state
        var isActive = function (item) {

            if (!item) return;

            if (!item.sref || item.sref == '#') {
                var foundActive = false;
                angular.forEach(item.submenu, function (value, key) {
                    if (isActive(value)) foundActive = true;
                });
                return foundActive;
            } else {
                return $state.is(item.sref) || $state.includes(item.sref);
            }
        };

        // Load menu from json file
        // -----------------------------------

        $scope.getMenuItemPropClasses = function (item) {
            return (item.heading ? 'nav-heading' : '') +
                (isActive(item) ? ' active' : '');
        };

        // TODO: put into dataservice
        $scope.loadSidebarMenu = function () {

            var menuJson = 'server/data/sidebar-menu.json',
                menuURL = menuJson; //+ '?v=' + (new Date().getTime()); // jumps cache
            $http.get(menuURL)
                .success(function (items) {
                    $rootScope.menuItems = items;
                })
                .error(function (data, status, headers, config) {
                    alert('Failure loading menu');
                });
        };

        $scope.loadSidebarMenu();

        // Handle sidebar collapse items
        // -----------------------------------

        $scope.addCollapse = function ($index, item) {
            collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
        };

        $scope.isCollapse = function ($index) {
            return (collapseList[$index]);
        };

        $scope.toggleCollapse = function ($index, isParentItem) {
            // collapsed sidebar doesn't toggle drodopwn
            if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) return true;

            // make sure the item index exists
            if (angular.isDefined(collapseList[$index])) {
                if (!$scope.lastEventFromChild) {
                    collapseList[$index] = !collapseList[$index];
                    closeAllBut($index);
                }
            } else if (isParentItem) {
                closeAllBut(-1);
            }
            $scope.lastEventFromChild = isChild($index);

            return true;
        };

        function closeAllBut(index) {
            index += '';
            for (var i in collapseList) {
                if (index < 0 || index.indexOf(i) < 0)
                    collapseList[i] = true;
            }
        }

        function isChild($index) {
            return (typeof $index === 'string') && !($index.indexOf('-') < 0);
        }

    }
})();

/**=========================================================
 * Module: anchor.js
 * Disables null anchor behavior
 =========================================================*/
(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('href', function () {

            var directive = {
                compile: compile,
                restrict: 'A'
            };
            return directive;

            /////////////////////////////////////

            function compile(element, attr) {
                return function (scope, element) {
                    if (attr.ngClick || attr.href === '' || attr.href === '#') {
                        if (!element.hasClass('dropdown-toggle')) {
                            element.on('click', function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                            });
                        }
                    }
                };
            }

        })
})();

/**=========================================================
 * Module: animate-enabled.js
 * Enable or disables ngAnimate for element with directive
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('animateEnabled', AnimateEnabled);

    AnimateEnabled.$inject = ['$animate'];

    function AnimateEnabled($animate) {

        var directive = {
            link: link
        };
        return directive;

        /////////////////////////////////////

        function link(scope, element, attrs) {
            scope.$watch(function () {
                return scope.$eval(attrs.animateEnabled, scope);
            }, function (newValue) {
                $animate.enabled(!!newValue, element);
            });
        }
    }

})();

/**=========================================================
 * Module: chart.js
 * Wrapper directive for chartJS.
 * Based on https://gist.github.com/AndreasHeiberg/9837868
 =========================================================*/

(function () {
    'use strict';

    var app = angular.module('max-ui');

    function ChartJS(type) {

        var directive = {
            restrict: "A",
            scope: {
                data: "=",
                options: "=",
                id: "@",
                width: "=",
                height: "=",
                resize: "=",
                chart: "@",
                segments: "@",
                responsive: "=",
                tooltip: "=",
                legend: "="
            },
            link: link
        };

        return directive;

        ////////////////////////////////////////////

        function link($scope, $elem) {
            var ctx = $elem[0].getContext("2d");
            var autosize = false;

            $scope.size = function () {
                if ($scope.width <= 0) {
                    $elem.width($elem.parent().width());
                    ctx.canvas.width = $elem.width();
                } else {
                    ctx.canvas.width = $scope.width || ctx.canvas.width;
                    autosize = true;
                }

                if ($scope.height <= 0) {
                    $elem.height($elem.parent().height());
                    ctx.canvas.height = ctx.canvas.width / 2;
                } else {
                    ctx.canvas.height = $scope.height || ctx.canvas.height;
                    autosize = true;
                }
            };

            $scope.$watch("data", function (newVal, oldVal) {
                if (chartCreated)
                    chartCreated.destroy();

                // if data not defined, exit
                if (!newVal) {
                    return;
                }
                if ($scope.chart) {
                    type = $scope.chart;
                }

                if (autosize) {
                    $scope.size();
                    chart = new Chart(ctx);
                }

                if ($scope.responsive || $scope.resize)
                    $scope.options.responsive = true;

                if ($scope.responsive !== undefined)
                    $scope.options.responsive = $scope.responsive;

                chartCreated = chart[type]($scope.data, $scope.options);
                chartCreated.update();
                if ($scope.legend)
                    angular.element($elem[0]).parent().after(chartCreated.generateLegend());
            }, true);

            $scope.$watch("tooltip", function (newVal, oldVal) {
                if (chartCreated)
                    chartCreated.draw();
                if (newVal === undefined || !chartCreated.segments)
                    return;
                if (!isFinite(newVal) || newVal >= chartCreated.segments.length || newVal < 0)
                    return;
                var activeSegment = chartCreated.segments[newVal];
                activeSegment.save();
                activeSegment.fillColor = activeSegment.highlightColor;
                chartCreated.showTooltip([activeSegment]);
                activeSegment.restore();
            }, true);

            $scope.size();
            var chart = new Chart(ctx);
            var chartCreated;
        }

    }

    /* Aliases for various chart types */
    app.directive("chartjs", function () {
        return ChartJS();
    });
    app.directive("linechart", function () {
        return ChartJS("Line");
    });
    app.directive("barchart", function () {
        return ChartJS("Bar");
    });
    app.directive("radarchart", function () {
        return ChartJS("Radar");
    });
    app.directive("polarchart", function () {
        return ChartJS("PolarArea");
    });
    app.directive("piechart", function () {
        return ChartJS("Pie");
    });
    app.directive("doughnutchart", function () {
        return ChartJS("Doughnut");
    });
    app.directive("donutchart", function () {
        return ChartJS("Doughnut");
    });

})();

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

/**=========================================================
 * Module: clear-storage.js
 * Removes a key from the browser storage via element click
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('resetKey', ResetKey);

    ResetKey.$inject = ['$state', '$rootScope'];

    function ResetKey($state, $rootScope) {

        var directive = {
            restrict: 'A',
            scope: {
                resetKey: '='
            },
            link: link,
            controller: controller
        };
        return directive;

        /////////////////////////////////////

        function link(scope, element, attrs) {
            scope.resetKey = attrs.resetKey;
        }

        function controller($scope, $element) {
            $element.on('click', function (e) {
                e.preventDefault();

                if ($scope.resetKey) {
                    delete $rootScope.$storage[$scope.resetKey];
                    $state.go($state.current, {}, {reload: true});
                } else {
                    $.error('No storage key specified for reset.');
                }
            });
        }
    }
})();

/**=========================================================
 * Module: filestyle.js
 * Initializes the fielstyle plugin
 =========================================================*/
(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('filestyle', Filestyle);

    ////////////////////////////

    function Filestyle() {

        var directive = {
            controller: controller,
            restrict: 'A'
        };

        return directive;

        function controller($scope, $element) {
            var options = $element.data();

            // old usage support
            options.classInput = $element.data('classinput') || options.classInput;

            $element.filestyle(options);
        }
    }
})();

/**=========================================================
 * Module: flatdoc.js
 * Creates the flatdoc markup and initializes the plugin
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('flatdoc', flatdoc);

    flatdoc.$inject = ['$location'];

    function flatdoc($location) {

        var directive = {
            restrict: "EA",
            template: "<div role='flatdoc'><div role='flatdoc-menu'></div><div role='flatdoc-content'></div></div>",
            link: link
        };
        return directive;

        /////////////////////////////////////

        function link(scope, element, attrs) {
            Flatdoc.run({
                fetcher: Flatdoc.file(attrs.src)
            });

            var $root = $('html, body');
            $(document).on('flatdoc:ready', function () {
                var docMenu = $('[role="flatdoc-menu"]');
                docMenu.find('a').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var $this = $(this);

                    docMenu.find('a.active').removeClass('active');
                    $this.addClass('active');

                    $root.animate({
                        scrollTop: $(this.getAttribute('href')).offset().top - ($('.topnavbar').height() + 10)
                    }, 800);
                });

            });
        }
    }
})();

/**=========================================================
 * Module: flot.js
 * Initializes the Flot chart plugin and handles data refresh
 =========================================================*/
(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('flot', Flot);

    Flot.$inject = ['$http', '$timeout'];

    function Flot($http, $timeout) {

        var directive = {
            restrict: 'EA',
            template: '<div></div>',
            scope: {
                dataset: '=?',
                options: '=',
                series: '=',
                callback: '=',
                src: '='
            },
            link: linkFunction
        };
        return directive;

        /////////////////////////////////////

        function linkFunction(scope, element, attributes) {
            var height, plot, plotArea, width;
            var heightDefault = 220;

            plot = null;

            width = attributes.width || '100%';
            height = attributes.height || heightDefault;

            plotArea = $(element.children()[0]);
            plotArea.css({
                width: width,
                height: height
            });

            function init() {
                var plotObj;
                if (!scope.dataset || !scope.options) return;
                plotObj = $.plot(plotArea, scope.dataset, scope.options);
                scope.$emit('plotReady', plotObj);
                if (scope.callback) {
                    scope.callback(plotObj, scope);
                }
                return plotObj;
            }

            function onDatasetChanged(dataset) {
                if (plot) {
                    plot.setData(dataset);
                    plot.setupGrid();
                    return plot.draw();
                } else {
                    plot = init();
                    onSerieToggled(scope.series);
                    return plot;
                }
            }

            scope.$watchCollection('dataset', onDatasetChanged, true);

            function onSerieToggled(series) {
                if (!plot || !series) return;
                var someData = plot.getData();
                for (var sName in series) {
                    angular.forEach(series[sName], toggleFor(sName));
                }

                plot.setData(someData);
                plot.draw();

                function toggleFor(sName) {
                    return function (s, i) {
                        if (someData[i] && someData[i][sName]) {
                            someData[i][sName].show = s;
                        }
                    }
                }
            }

            scope.$watch('series', onSerieToggled, true);

            function onSrcChanged(src) {
                if (src) {
                    $http.get(src)
                        .success(function (data) {
                            $timeout(function () {
                                scope.dataset = data;
                            });
                        }).error(function () {
                            $.error('Flot chart: Bad request.');
                        });
                }
            }
            scope.$watch('src', onSrcChanged);
        }
    }
})();

/**=========================================================
 * Module: form-wizard.js
 * Handles form wizard plugin and validation
 =========================================================*/
(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('formWizard', FormWizard);

    FormWizard.$inject = ['$parse'];

    function FormWizard($parse) {

        var directive = {
            restrict: 'A',
            scope: true,
            link: function (scope, element, attribute) {
                var validate = $parse(attribute.validateSteps)(scope),
                    wiz = new Wizard(attribute.steps, !!validate, element);
                scope.wizard = wiz.init();

            }
        };
        return directive;

        /////////////////////////////////////

        function Wizard(quantity, validate, element) {

            var self = this;
            self.quantity = parseInt(quantity, 10);
            self.validate = validate;
            self.element = element;

            self.init = function () {
                self.createsteps(self.quantity);
                self.go(1); // always start at fist step
                return self;
            };

            self.go = function (step) {
                if (angular.isDefined(self.steps[step])) {
                    if (self.validate && step !== 1) {
                        var form = $(self.element),
                            group = form.children().children('div').get(step - 2);

                        if (false === form.parsley().validate(group.id)) {
                            return false;
                        }
                    }
                    self.cleanall();
                    self.steps[step] = true;
                }
            }

            self.active = function (step) {
                return !!self.steps[step];
            }

            self.cleanall = function () {
                for (var i in self.steps) {
                    self.steps[i] = false;
                }
            }

            self.createsteps = function (q) {
                self.steps = [];
                for (var i = 1; i <= q; i++) self.steps[i] = false;
            }
        }
    }
})();

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
/**=========================================================
 * Module: gmap.js
 * Init Google Map plugin
 =========================================================*/
(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('gmap', Gmap);

    Gmap.$inject = ['$window', 'gmap'];

    function Gmap($window, gmap) {

            // Map Style definition
            // Get more styles from http://snazzymaps.com/style/29/light-monochrome
            // - Just replace and assign to 'MapStyles' the new style array
            var MapStyles = [{featureType:'water',stylers:[{visibility:'on'},{color:'#bdd1f9'}]},{featureType:'all',elementType:'labels.text.fill',stylers:[{color:'#334165'}]},{featureType:'landscape',stylers:[{color:'#e9ebf1'}]},{featureType:'road.highway',elementType:'geometry',stylers:[{color:'#c5c6c6'}]},{featureType:'road.arterial',elementType:'geometry',stylers:[{color:'#fff'}]},{featureType:'road.local',elementType:'geometry',stylers:[{color:'#fff'}]},{featureType:'transit',elementType:'geometry',stylers:[{color:'#d8dbe0'}]},{featureType:'poi',elementType:'geometry',stylers:[{color:'#cfd5e0'}]},{featureType:'administrative',stylers:[{visibility:'on'},{lightness:33}]},{featureType:'poi.park',elementType:'labels',stylers:[{visibility:'on'},{lightness:20}]},{featureType:'road',stylers:[{color:'#d8dbe0',lightness:20}]}];

            gmap.setStyle( MapStyles );

            // Center Map marker on resolution change
            $($window).resize(function() {
                gmap.autocenter();
            });

            var directive = {
                restrict: 'A',
                priority: 1000,
                scope: {
                    mapAddress: '='
                },
                link: link
            };
            return directive;

            /////////////////////////////////////

            function link(scope, element, attrs) {
                scope.$watch('mapAddress', function(newVal) {
                    element.attr('data-address', newVal);
                    gmap.init(element);
                });
            }
        }
})();

/**=========================================================
 * Module: load-css.js
 * Request and load into the current page a css file
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('loadCss', LoadCss);

    function LoadCss() {

        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        /////////////////////////////////////

        function link(scope, element, attrs) {
            element.on('click', function (e) {
                if (element.is('a')) e.preventDefault();
                var uri = attrs.loadCss, link;

                if (uri) {
                    link = createLink(uri);
                    if (!link) {
                        $.error('Error creating stylesheet link element.');
                    }
                } else {
                    $.error('No stylesheet location defined.');
                }
            });
        }

        function createLink(uri) {
            var linkId = 'autoloaded-stylesheet',
                oldLink = $('#' + linkId).attr('id', linkId + '-old');

            $('head').append($('<link/>').attr({
                'id': linkId,
                'rel': 'stylesheet',
                'href': uri
            }));

            if (oldLink.length) {
                oldLink.remove();
            }
            return $('#' + linkId);
        }
    }
})();
/**=========================================================
 * Module: masked,js
 * Initializes the masked inputs
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('masked', Masked);

    ////////////////////////////

    function Masked() {

        var directive = {
            controller: controller,
            restrict: 'A'
        };

        return directive;

        function controller($scope, $element) {
            var $elem = $($element);
            if ($.fn.inputmask)
                $elem.inputmask();
        }
    }
})();
/**=========================================================
 * Module: nestable.js
 * Initializes the nestable plugin
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('nestable', Nestable);

    Nestable.$inject = ['$timeout'];

    function Nestable($timeout) {

        var directive = {
            scope: {
                'nestableControl': '='
            },
            controller: controller,
            restrict: 'A'
        };

        return directive;

        //////////////////////////////

        function controller($scope, $element) {
            var options = $element.data();

            $timeout(function () {
                $element.nestable();
            });

            if ($scope.nestableControl) {
                var nest = $scope.nestableControl;
                nest.serialize = function () {
                    return $element.nestable('serialize');
                };
                nest.expandAll = runMethod('expandAll');
                nest.collapseAll = runMethod('collapseAll');

                $element.on('change', function () {
                    if (typeof nest.onchange === 'function') {
                        $timeout(function () {
                            nest.onchange.apply(arguments);
                        });
                    }
                });
            }

            function runMethod(name) {
                return function () {
                    $element.nestable(name);
                };
            }
        }
    }
})();

/**=========================================================
 * Module: notify.js
 * Create a notifications that fade out automatically.
 * Based on Notify addon from UIKit (http://getuikit.com/docs/addons_notify.html)
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('notify', Notify);

    ////////////////////////////

    function Notify() {

        var directive = {
            controller: controller,
            restrict: 'A'
        };

        return directive;

        function controller($scope, $element) {
            $element.on('click', function (e) {
                e.preventDefault();
                notifyNow($element);
            });
        }

        function notifyNow(elem) {
            var $element = $(elem),
                message = $element.data('message'),
                options = $element.data('options');

            if (!message) {
                $.error('Notify: No message specified');
            }

            $.notify(message, options || {});
        }
    }
})();

/**
 * Notify Addon definition as jQuery plugin
 * Adapted version to work with Bootstrap classes
 * More information http://getuikit.com/docs/addons_notify.html
 */

(function ($, window, document) {

    var containers = {},
        messages = {},

        notify = function (options) {
            if ($.type(options) == 'string') {
                options = {message: options};
            }

            if (arguments[1]) {
                options = $.extend(options, $.type(arguments[1]) == 'string' ? {status: arguments[1]} : arguments[1]);
            }

            return (new Message(options)).show();
        },
        closeAll = function (group, instantly) {
            if (group) {
                for (var id in messages) {
                    if (group === messages[id].group) messages[id].close(instantly);
                }
            } else {
                for (var id in messages) {
                    messages[id].close(instantly);
                }
            }
        };

    var Message = function (options) {

        var $this = this;
        this.options = $.extend({}, Message.defaults, options);

        this.uuid = "ID" + (new Date().getTime()) + "RAND" + (Math.ceil(Math.random() * 100000));
        this.element = $([
            // @geedmo: alert-dismissable enables bs close icon
            '<div class="uk-notify-message alert-dismissable">',
            '<a class="close">&times;</a>',
            '<div>' + this.options.message + '</div>',
            '</div>'

        ].join('')).data("notifyMessage", this);

        // status
        if (this.options.status) {
            this.element.addClass('alert alert-' + this.options.status);
            this.currentstatus = this.options.status;
        }

        this.group = this.options.group;
        messages[this.uuid] = this;

        if (!containers[this.options.pos]) {
            containers[this.options.pos] = $('<div class="uk-notify uk-notify-' + this.options.pos + '"></div>').appendTo('body').on("click", ".uk-notify-message", function () {
                $(this).data("notifyMessage").close();
            });
        }
    };


    $.extend(Message.prototype, {

        uuid: false,
        element: false,
        timout: false,
        currentstatus: "",
        group: false,

        show: function () {

            if (this.element.is(":visible")) return;

            var $this = this;
            containers[this.options.pos].show().prepend(this.element);
            var marginbottom = parseInt(this.element.css("margin-bottom"), 10);

            this.element.css({
                "opacity": 0,
                "margin-top": -1 * this.element.outerHeight(),
                "margin-bottom": 0
            }).animate({"opacity": 1, "margin-top": 0, "margin-bottom": marginbottom}, function () {

                if ($this.options.timeout) {
                    var closefn = function () {
                        $this.close();
                    };

                    $this.timeout = setTimeout(closefn, $this.options.timeout);
                    $this.element.hover(
                        function () {
                            clearTimeout($this.timeout);
                        },
                        function () {
                            $this.timeout = setTimeout(closefn, $this.options.timeout);
                        }
                    );
                }
            });

            return this;
        },

        close: function (instantly) {

            var $this = this,
                finalize = function () {
                    $this.element.remove();

                    if (!containers[$this.options.pos].children().length) {
                        containers[$this.options.pos].hide();
                    }

                    delete messages[$this.uuid];
                };

            if (this.timeout) clearTimeout(this.timeout);

            if (instantly) {
                finalize();
            } else {
                this.element.animate({
                    "opacity": 0,
                    "margin-top": -1 * this.element.outerHeight(),
                    "margin-bottom": 0
                }, function () {
                    finalize();
                });
            }
        },

        content: function (html) {
            var container = this.element.find(">div");
            if (!html) {
                return container.html();
            }
            container.html(html);

            return this;
        },

        status: function (status) {
            if (!status) {
                return this.currentstatus;
            }
            this.element.removeClass('alert alert-' + this.currentstatus).addClass('alert alert-' + status);
            this.currentstatus = status;

            return this;
        }
    });

    Message.defaults = {
        message: "",
        status: "normal",
        timeout: 5000,
        group: null,
        pos: 'top-center'
    };

    $["notify"] = notify;
    $["notify"].message = Message;
    $["notify"].closeAll = closeAll;

    return notify;

}(jQuery, window, document));
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

/**=========================================================
 * Module panel-tools.js
 * Directive tools to control panels.
 * Allows collapse, refresh and dismiss (remove)
 * Saves panel state in browser storage
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('paneltool', Paneltool);

    Paneltool.$inject = ['$compile', '$timeout'];

    function Paneltool($compile, $timeout) {

        var templates = {
            /* jshint multistr: true */
            collapse: "<a href='#' panel-collapse='' data-toggle='tooltip' title='Collapse Panel' ng-click='{{panelId}} = !{{panelId}}' ng-init='{{panelId}}=false'> \
                            <em ng-show='{{panelId}}' class='fa fa-plus'></em> \
                            <em ng-show='!{{panelId}}' class='fa fa-minus'></em> \
                          </a>",
            dismiss: "<a href='#' panel-dismiss='' data-toggle='tooltip' title='Close Panel'>\
                           <em class='fa fa-times'></em>\
                         </a>",
            refresh: "<a href='#' panel-refresh='' data-toggle='tooltip' data-spinner='{{spinner}}' title='Refresh Panel'>\
                           <em class='fa fa-refresh'></em>\
                         </a>"
        };
        var directive = {
            link: link,
            restrict: 'E'
        };
        return directive;

        /////////////////////////////////////

        function link(scope, element, attrs) {
            var tools = scope.panelTools || attrs;

            $timeout(function () {
                element.html(getTemplate(element, tools)).show();
                $compile(element.contents())(scope);

                element.addClass('pull-right');
            });
        }

        function getTemplate(elem, attrs) {
            var temp = '';
            attrs = attrs || {};
            if (attrs.toolCollapse) {
                temp += templates.collapse.replace(/{{panelId}}/g, (elem.parent().parent().attr('id')));
            }
            if (attrs.toolDismiss) {
                temp += templates.dismiss;
            }
            if (attrs.toolRefresh) {
                temp += templates.refresh.replace(/{{spinner}}/g, attrs.toolRefresh);
            }
            return temp;
        }
    }
})();


/**=========================================================
 * Dismiss panels * [panel-dismiss]
 =========================================================*/
(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('panelDismiss', PanelDismiss);

    PanelDismiss.$inject = ['$q'];

    function PanelDismiss($q) {

        var directive = {
            controller: controller,
            restrict: 'A'
        };
        return directive;

        /////////////////////////////////////

        function controller($scope, $element) {
            var removeEvent = 'panel-remove',
                removedEvent = 'panel-removed';

            $element.on('click', function () {

                // find the first parent panel
                var parent = $(this).closest('.panel');

                removeElement();

                function removeElement() {
                    var deferred = $q.defer();
                    var promise = deferred.promise;

                    // Communicate event destroying panel
                    $scope.$emit(removeEvent, parent.attr('id'), deferred);
                    promise.then(destroyMiddleware);
                }

                // Run the animation before destroy the panel
                function destroyMiddleware() {
                    if ($.support.animation) {
                        parent.animo({animation: 'bounceOut'}, destroyPanel);
                    }
                    else destroyPanel();
                }

                function destroyPanel() {
                    var col = parent.parent();
                    parent.remove();
                    // remove the parent if it is a row and is empty and not a sortable (portlet)
                    col
                        .filter(function () {
                            var el = $(this);
                            return (el.is('[class*="col-"]:not(.sortable)') && el.children('*').length === 0);
                        }).remove();

                    // Communicate event destroyed panel
                    $scope.$emit(removedEvent, parent.attr('id'));
                }
            });
        }
    }
})();

/**=========================================================
 * Collapse panels * [panel-collapse]
 =========================================================*/
(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('panelCollapse', PanelCollapse);

    PanelCollapse.$inject = ['$timeout'];

    function PanelCollapse($timeout) {

        var storageKeyName = 'panelState',
            storage;

        var directive = {
            controller: controller,
            restrict: 'A'
        };
        return directive;

        /////////////////////////////////////

        function controller($scope, $element) {

            // Prepare the panel to be collapsible
            var $elem = $($element),
                parent = $elem.closest('.panel'), // find the first parent panel
                panelId = parent.attr('id');

            storage = $scope.$storage;

            // Load the saved state if exists
            var currentState = loadPanelState(panelId);
            if (typeof currentState !== undefined) {
                $timeout(function () {
                    $scope[panelId] = currentState;
                }, 10);
            }

            // bind events to switch icons
            $element.bind('click', function () {
                savePanelState(panelId, !$scope[panelId]);
            });
        }

        function savePanelState(id, state) {
            if (!id) return false;
            var data = angular.fromJson(storage[storageKeyName]);
            if (!data) {
                data = {};
            }
            data[id] = state;
            storage[storageKeyName] = angular.toJson(data);
        }

        function loadPanelState(id) {
            if (!id) return false;
            var data = angular.fromJson(storage[storageKeyName]);
            if (data) {
                return data[id];
            }
        }

    }
})();


/**=========================================================
 * Refresh panels
 * [panel-refresh] * [data-spinner="standard"]
 =========================================================*/
(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('panelRefresh', PanelRefresh);

    PanelRefresh.$inject = ['$q'];

    function PanelRefresh($q) {

        var directive = {
            controller: controller,
            restrict: 'A'
        };
        return directive;

        /////////////////////////////////////

        function controller($scope, $element) {
            var refreshEvent = 'panel-refresh',
                whirlClass = 'whirl',
                defaultSpinner = 'standard';

            // catch clicks to toggle panel refresh
            $element.on('click', function () {
                var $this = $(this),
                    panel = $this.parents('.panel').eq(0),
                    spinner = $this.data('spinner') || defaultSpinner;

                // start showing the spinner
                panel.addClass(whirlClass + ' ' + spinner);

                // Emit event when refresh clicked
                $scope.$emit(refreshEvent, panel.attr('id'));
            });

            // listen to remove spinner
            $scope.$on('removeSpinner', removeSpinner);

            // method to clear the spinner when done
            function removeSpinner(ev, id) {
                if (!id) return;
                var newid = id.charAt(0) == '#' ? id : ('#' + id);
                angular
                    .element(newid)
                    .removeClass(whirlClass);
            }
        }
    }
})();

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

/**=========================================================
 * Module: scroll.js
 * Make a content box scrollable
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('scrollable', Scrollable);

    function Scrollable() {

        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;

        /////////////////////////////////////

        function link(scope, elem, attrs) {
            var defaultHeight = 250;
            elem.slimScroll({
                height: (attrs.height || defaultHeight)
            });
        }
    }
})();
/**=========================================================
 * Module: sidebar.js
 * Wraps the sidebar and handles collapsed state
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('sidebar', Sidebar);

    Sidebar.$inject = ['$rootScope', '$window', 'Utils'];

    function Sidebar($rootScope, $window, Utils) {

        var $win = $($window);
        var $body = $('body');
        var $scope;
        var $sidebar;
        var currentState = $rootScope.$state.current.name;

        var directive = {
            restrict: 'EA',
            template: '<nav class="sidebar" ng-transclude></nav>',
            transclude: true,
            replace: true,
            link: link
        };
        return directive;

        /////////////////////////////////////

        function link(scope, element, attrs) {
            $scope = scope;
            $sidebar = element;

            var eventName = Utils.isTouch() ? 'click' : 'mouseenter';
            var subNav = $();
            $sidebar.on(eventName, '.nav > li', function () {

                if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) {
                    subNav.trigger('mouseleave');
                    subNav = toggleMenuItem($(this));

                    // Used to detect click and touch events outside the sidebar
                    sidebarAddBackdrop();
                }
            });

            scope.$on('closeSidebarMenu', function () {
                removeFloatingNav();
            });

            // Normalize state when resize to mobile
            $win.on('resize', function () {
                if (!Utils.isMobile()) {
                    $body.removeClass('aside-toggled');
                }
            });

            // Adjustment on route changes
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                currentState = toState.name;
                // Hide sidebar automatically on mobile
                $('body.aside-toggled').removeClass('aside-toggled');

                $rootScope.$broadcast('closeSidebarMenu');
            });
        }

        function sidebarAddBackdrop() {
            var $backdrop = $('<div/>', {'class': 'dropdown-backdrop'});
            $backdrop.insertAfter('.aside-inner').on("click mouseenter", function () {
                removeFloatingNav();
            });
        }

        // Open the collapse sidebar submenu items when on touch devices
        // - desktop only opens on hover
        function toggleTouchItem($element) {
            $element
                .siblings('li')
                .removeClass('open')
                .end()
                .toggleClass('open');
        }

        // Handles hover to open items under collapsed menu
        // -----------------------------------
        function toggleMenuItem($listItem) {

            removeFloatingNav();

            var ul = $listItem.children('ul');
            if (!ul.length) return $();
            if ($listItem.hasClass('open')) {
                toggleTouchItem($listItem);
                return $();
            }

            var $aside = $('.aside');
            var $asideInner = $('.aside-inner'); // for top offset calculation
            // float aside uses extra padding on aside
            var mar = parseInt($asideInner.css('padding-top'), 0) + parseInt($aside.css('padding-top'), 0);
            var subNav = ul.clone().appendTo($aside);

            toggleTouchItem($listItem);

            var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
            var vwHeight = $win.height();

            subNav
                .addClass('nav-floating')
                .css({
                    position: $scope.app.layout.isFixed ? 'fixed' : 'absolute',
                    top: itemTop,
                    bottom: (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
                });

            subNav.on('mouseleave', function () {
                toggleTouchItem($listItem);
                subNav.remove();
            });

            return subNav;
        }

        function removeFloatingNav() {
            $('.dropdown-backdrop').remove();
            $('.sidebar-subnav.nav-floating').remove();
            $('.sidebar li.open').removeClass('open');
        }

    }
})();

/**=========================================================
 * Module: skycons.js
 * Include any animated weather icon from Skycons
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('skycon', function () {

            var directive = {
                link: link,
                restrict: 'A'
            };
            return directive;

            /////////////////////////////////////

            function link(scope, element, attrs) {
                var skycons = new Skycons({'color': (attrs.color || 'white')});
                element.html('<canvas width="' + attrs.width + '" height="' + attrs.height + '"></canvas>');
                skycons.add(element.children()[0], attrs.skycon);
                skycons.play();
            }
        });
})();
/**=========================================================
 * Module: sparkline.js
 * SparkLines Mini Charts
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('sparkline', Sparkline);

    Sparkline.$inject = ['$timeout', '$window'];

    function Sparkline($timeout, $window) {

        var directive = {
            restrict: 'EA',
            controller: controller
        };
        return directive;

        /////////////////////////////////////

        function controller($scope, $element) {
            var runSL = function () {
                initSparLine($element);
            };

            $timeout(runSL);
        }

        function initSparLine($element) {
            var options = $element.data();

            options.type = options.type || 'bar'; // default chart is bar
            options.disableHiddenCheck = true;

            $element.sparkline('html', options);

            if (options.resize) {
                $(window).resize(function () {
                    $element.sparkline('html', options);
                });
            }
        }
    }

})();

/**=========================================================
 * Module: table-checkall.js
 * Tables check all checkbox
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('checkAll', CheckAll);

    function CheckAll() {

        var directive = {
            restrict: 'A',
            controller: controller
        };
        return directive;

        /////////////////////////////////////

        function controller($scope, $element) {
            $element.on('change', function () {
                var $this = $(this),
                    index = $this.index() + 1,
                    checkbox = $this.find('input[type="checkbox"]'),
                    table = $this.parents('table');
                // Make sure to affect only the correct checkbox column
                table.find('tbody > tr > td:nth-child(' + index + ') input[type="checkbox"]')
                    .prop('checked', checkbox[0].checked);
            });
        }
    }

})();
/**=========================================================
 * Module: tags-input.js
 * Initializes the tag inputs plugin
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('tagsinput', Tagsinput);

    Tagsinput.$inject = ['$timeout'];

    function Tagsinput($timeout) {

        var directive = {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };
        return directive;

        /////////////////////////////////////

        function link(scope, element, attrs, ngModel) {
            element.on('itemAdded itemRemoved', function () {
                // check if view value is not empty and is a string
                // and update the view from string to an array of tags
                if (ngModel.$viewValue && ngModel.$viewValue.split) {
                    ngModel.$setViewValue(ngModel.$viewValue.split(','));
                    ngModel.$render();
                }
            });

            $timeout(function () {
                element.tagsinput();
            });
        }
    }

})();

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

/**=========================================================
 * Module: masked,js
 * Initializes the jQuery UI slider controls
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('uiSlider', UiSlider);

    function UiSlider() {

        var directive = {
            controller: controller,
            restrict: 'A'
        };
        return directive;

        /////////////////////////////////////

        function controller($scope, $element) {
            var $elem = $($element);
            if ($.fn.slider) {
                $elem.slider();
            }
        }
    }
})();
/**=========================================================
 * Module: validate-form.js
 * Initializes the validation plugin Parsley
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('validateForm', ValidateForm);

    function ValidateForm() {

        var directive = {
            controller: controller,
            restrict: 'A'
        };
        return directive;

        /////////////////////////////////////

        function controller($scope, $element) {
            var $elem = $($element);
            if ($.fn.parsley) {
                $elem.parsley();
            }
        }
    }
})();
/**=========================================================
 * Module: vector-map.js.js
 * Init jQuery Vector Map plugin
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('vectorMap', VectorMap);

    VectorMap.$inject = ['vectorMap'];

    function VectorMap(vectorMap) {

        var defaultColors = {
            markerColor: '#23b7e5',      // the marker points
            bgColor: 'transparent',  // the background
            scaleColors: ['#878c9a'],    // the color of the region in the serie
            regionFill: '#bbbec6'       // the base region color
        };

        var directive = {
            restrict: 'EA',
            link: link
        };
        return directive;

        /////////////////////////////////////

        function link(scope, element, attrs) {
            var mapHeight = attrs.height || '300',
                options = {
                    markerColor: attrs.markerColor || defaultColors.markerColor,
                    bgColor: attrs.bgColor || defaultColors.bgColor,
                    scale: attrs.scale || 1,
                    scaleColors: attrs.scaleColors || defaultColors.scaleColors,
                    regionFill: attrs.regionFill || defaultColors.regionFill,
                    mapName: attrs.mapName || 'world_mill_en'
                };

            element.css('height', mapHeight);
            vectorMap.init(element, options, scope.seriesData, scope.markersData);
        }
    }

})();

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


/**=========================================================
 * Module: google-map.js
 * Services to share gmap functions
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .service('gmap', gmap);

    //////////////////////////////

    function gmap() {

        var service = {
            setStyle: setStyle,
            autocenter: autocenter,
            init: init
        };
        return service;

        //////////////////////

        function setStyle(style) {
            this.MapStyles = style;
        }

        function autocenter() {
            var refs = this.gMapRefs;
            if (refs && refs.length) {
                for (var r in refs) {
                    var mapRef = refs[r];
                    var currMapCenter = mapRef.getCenter();
                    if (mapRef && currMapCenter) {
                        google.maps.event.trigger(mapRef, 'resize');
                        mapRef.setCenter(currMapCenter);
                    }
                }
            }
        }

        function init(element) { //initGmap

            var self = this,
                $element = $(element),
                addresses = $element.data('address') && $element.data('address').split(';'),
                titles = $element.data('title') && $element.data('title').split(';'),
                zoom = $element.data('zoom') || 14,
                maptype = $element.data('maptype') || 'ROADMAP', // or 'TERRAIN'
                markers = [];

            if (addresses) {
                for (var a in addresses) {
                    if (typeof addresses[a] == 'string') {
                        markers.push({
                            address: addresses[a],
                            html: (titles && titles[a]) || '',
                            popup: true   /* Always popup */
                        });
                    }
                }

                var options = {
                    controls: {
                        panControl: true,
                        zoomControl: true,
                        mapTypeControl: true,
                        scaleControl: true,
                        streetViewControl: true,
                        overviewMapControl: true
                    },
                    scrollwheel: false,
                    maptype: maptype,
                    markers: markers,
                    zoom: zoom
                    // More options https://github.com/marioestrada/jQuery-gMap
                };

                var gMap = $element.gMap(options);

                var ref = gMap.data('gMap.reference');
                // save in the map references list
                if (!self.gMapRefs)
                    self.gMapRefs = [];
                self.gMapRefs.push(ref);

                // set the styles
                if ($element.data('styled') !== undefined) {
                    ref.setOptions({
                        styles: self.MapStyles
                    });
                }
            }
        }
    }
})();

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

/**=========================================================
 * Module: helpers.js
 * Provides helper functions for routes definition
 =========================================================*/
(function () {
    'use strict';

    angular
        .module('max-ui')
        .provider('RouteHelpers', RouteHelpers);

    RouteHelpers.$inject = ['APP_REQUIRES'];

    function RouteHelpers(appRequires) {

        // Set here the base of the relative path
        // for all app views
        this.basepath = function (uri) {
            return 'app/views/' + uri;
        };

        // Generates a resolve object by passing script names
        // previously configured in constant.APP_REQUIRES
        this.resolveFor = function () {
            var _args = arguments;
            return {
                deps: ['$ocLazyLoad', '$q', function ($ocLL, $q) {
                    // Creates a promise chain for each argument
                    var promise = $q.when(1); // empty promise
                    for (var i = 0, len = _args.length; i < len; i++) {
                        promise = andThen(_args[i]);
                    }
                    return promise;

                    // creates promise to chain dynamically
                    function andThen(_arg) {
                        // also support a function that returns a promise
                        if (typeof _arg == 'function') {
                            return promise.then(_arg);
                        } else {
                            return promise.then(function () {
                                // if is a module, pass the name. If not, pass the array
                                var whatToLoad = getRequired(_arg);
                                // simple error check
                                if (!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                                // finally, return a promise
                                return $ocLL.load(whatToLoad);
                            });
                        }
                    }

                    // check and returns required data
                    // analyze module items with the form [name: '', files: []]
                    // and also simple array of script files (for not angular js)
                    function getRequired(name) {
                        if (appRequires.modules) {
                            for (var m in appRequires.modules) {
                                if (appRequires.modules[m].name && appRequires.modules[m].name === name) {
                                    return appRequires.modules[m];
                                }
                            }
                        }
                        return appRequires.scripts && appRequires.scripts[name];
                    }

                }]
            };
        }; // resolveFor

        // not necessary, only used in config block for routes
        this.$get = function () {
        };

    }
})();

/**=========================================================
 * Module: toggle-state.js
 * Services to share toggle state functionality
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .service('toggleStateService', toggleStateService);

    toggleStateService.$inject = ['$rootScope'];

    function toggleStateService($rootScope) {

        var service = {
            addState: addState,
            removeState: removeState,
            restoreState: restoreState
        };
        return service;

        /////////////////////////////////////

        var storageKeyName = 'toggleState';

        // Helper object to check for words in a phrase //
        var WordChecker = {
            hasWord: function (phrase, word) {
                return new RegExp('(^|\\s)' + word + '(\\s|$)').test(phrase);
            },
            addWord: function (phrase, word) {
                if (!this.hasWord(phrase, word)) {
                    return (phrase + (phrase ? ' ' : '') + word);
                }
            },
            removeWord: function (phrase, word) {
                if (this.hasWord(phrase, word)) {
                    return phrase.replace(new RegExp('(^|\\s)*' + word + '(\\s|$)*', 'g'), '');
                }
            }
        };

        // Add a state to the browser storage to be restored later
        function addState(classname) {
            var data = angular.fromJson($rootScope.$storage[storageKeyName]);
            if (!data) {
                data = classname;
            } else {
                data = WordChecker.addWord(data, classname);
            }
            $rootScope.$storage[storageKeyName] = angular.toJson(data);
        }

        // Remove a state from the browser storage
        function removeState(classname) {
            var data = $rootScope.$storage[storageKeyName];
            // nothing to remove
            if (!data) return;

            data = WordChecker.removeWord(data, classname);
            $rootScope.$storage[storageKeyName] = angular.toJson(data);
        }

        // Load the state string and restore the classlist
        function restoreState($elem) {
            var data = angular.fromJson($rootScope.$storage[storageKeyName]);
            // nothing to restore
            if (!data) return;
            $elem.addClass(data);
        }
    }
})();

/**=========================================================
 * Module: vector-map.js
 * Services to initialize vector map plugin
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .service('vectorMap', vectorMap);

    /////////////////////////////////

    function vectorMap() {

        var service = {
            init: init
        };
        return service;

        /////////////////////////////////////

        function init($element, opts, series, markers) {
            $element.vectorMap({
                map: opts.mapName,
                backgroundColor: opts.bgColor,
                zoomMin: 1,
                zoomMax: 8,
                zoomOnScroll: false,
                regionStyle: {
                    initial: {
                        'fill': opts.regionFill,
                        'fill-opacity': 1,
                        'stroke': 'none',
                        'stroke-width': 1.5,
                        'stroke-opacity': 1
                    },
                    hover: {
                        'fill-opacity': 0.8
                    },
                    selected: {
                        fill: 'blue'
                    },
                    selectedHover: {}
                },
                focusOn: {x: 0.4, y: 0.6, scale: opts.scale},
                markerStyle: {
                    initial: {
                        fill: opts.markerColor,
                        stroke: opts.markerColor
                    }
                },
                onRegionLabelShow: function (e, el, code) {
                    if (series && series[code])
                        el.html(el.html() + ': ' + series[code] + ' visitors');
                },
                markers: markers,
                series: {
                    regions: [{
                        values: series,
                        scale: opts.scaleColors,
                        normalizeFunction: 'polynomial'
                    }]
                }
            });
        }
    }
})();

(function() {
    'use strict';

    angular.module('app.dashboard', []);
})();

(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());

        function getStates() {
            return [
                {
                    state: 'app.dashboard',
                    config: {
                        url: '/dashboard',
                        title: 'Dashboard',
                        templateUrl: 'app/modules/dashboard/views/dashboard.html',
                        resolve: routerHelper.resolveFor('flot-chart', 'flot-chart-plugins', 'vector-map')
                    }
                },
                {
                    state: 'app-h.dashboard_v2',
                    config: {
                        url: '/dashboard_v2',
                        title: 'Dashboard v2',
                        templateUrl: 'app/modules/dashboard/views/dashboard_v2.html',
                        controller: function ($rootScope, $scope) {
                            $rootScope.app.layout.horizontal = true;
                            $scope.$on('$destroy', function () {
                                $rootScope.app.layout.horizontal = false;
                            });
                        },
                        resolve: routerHelper.resolveFor('flot-chart', 'flot-chart-plugins')
                    }
                }
            ];
        }
    }
})();

(function() {
    'use strict';

    angular.module('app.charts', ['app.core']);
})();

(function() {
    'use strict';

    angular
        .module('app.charts')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());

        function getStates() {
            return [
                {
                    state: 'app.chart-flot',
                    config: {
                        url: '/chart-flot',
                        title: 'Chart Flot',
                        templateUrl: 'app/modules/charts/views/chart-flot.html',
                        resolve: routerHelper.resolveFor('flot-chart', 'flot-chart-plugins')
                    }
                },
                {
                    state: 'app.chart-radial',
                    config: {
                        url: '/chart-radial',
                        title: 'Chart Radial',
                        templateUrl: 'app/modules/charts/views/chart-radial.html',
                        resolve: routerHelper.resolveFor('classyloader')
                    }
                },
                {
                    state: 'app.chart-js',
                    config: {
                        url: '/chart-js',
                        title: 'Chart JS',
                        templateUrl: 'app/modules/charts/views/chart-js.html',
                        resolve: routerHelper.resolveFor('chartjs')
                    }
                }
            ];
        }
    }
})();


/**
 * @ngdoc service
 * @name dataservice
 * @description
 *     Application data API.
 */
(function() {
    'use strict';

    angular
        .module('app.charts')
        .factory('ChartDataservice', ChartDataservice);

    ChartDataservice.$inject = ['$http', '$location', '$q', 'exception', 'logger'];

    /**
     * @ngdoc method
     * @name ChartDataservice#dataservice
     * @description
     *     Configures the dataservice.
     * @param  {[type]} $http
     * @param  {[type]} $location
     * @param  {[type]} $q
     * @param  {[type]} exception
     * @param  {[type]} logger
     * @return {Object} dataservice service
     */
    /* @ngInject */
    function ChartDataservice($http, $location, $q, exception, logger) {
        /* jshint validthis:true */
        var readyPromise;
        var isPrimed = false;
        var primePromise;

        var service = {
            getBarChart: getBarChart,
            getBarstackedChart: getBarstackedChart,
            getSplineChart: getSplineChart,
            getAreaChart: getAreaChart,
            getLineChart: getLineChart,
            getPieChart: getPieChart,
            getDonutChart: getDonutChart,
            ready: ready
        };

        return service;

        //================================================================

        function getBarChart() {
            return $http.get('/api/chart/bar')
                .then(getBarChartComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getBarChart')(message);
                    $location.url('/');
                });

            function getBarChartComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getBarstackedChart() {
            return $http.get('/api/chart/barstacked')
                .then(getBarstackedChartComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getBarstackedChart')(message);
                    $location.url('/');
                });

            function getBarstackedChartComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getSplineChart() {
            return $http.get('/api/chart/spline')
                .then(getSplineChartComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getSplineChart')(message);
                    $location.url('/');
                });

            function getSplineChartComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getAreaChart() {
            return $http.get('/api/chart/area')
                .then(getAreaChartComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getAreaChart')(message);
                    $location.url('/');
                });

            function getAreaChartComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getLineChart() {
            return $http.get('/api/chart/line')
                .then(getLineChartComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getLineChart')(message);
                    $location.url('/');
                });

            function getLineChartComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getPieChart() {
            return $http.get('/api/chart/pie')
                .then(getPieChartComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getPieChart')(message);
                    $location.url('/');
                });

            function getPieChartComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getDonutChart() {
            return $http.get('/api/chart/donut')
                .then(getDonutChartComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getDonutChart')(message);
                    $location.url('/');
                });

            function getDonutChartComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getReady() {
            if (!readyPromise) {
                // Apps often pre-fetch session data ("prime the app")
                // before showing the first view.
                // This app doesn't need priming but we add a
                // no-op implementation to show how it would work.
                logger.info('Primed the app data');
                readyPromise = $q.when(service);
            }
            return readyPromise;
        }

        function ready(promisesArray) {
            return getReady()
                .then(function() {
                    return promisesArray ? $q.all(promisesArray) : readyPromise;
                })
                .catch(exception.catcher('"ready" function failed'));
        }
    }
})();

/**=========================================================
 * Module: app.charts
 * Controller for ChartJs
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.charts')
        .controller('ChartJSController', ChartJSController);

    ChartJSController.$inject = ['colors', 'logger'];

    function ChartJSController(colors, logger) {

        // required for inner references
        var vm = this;

        vm.title = "ChartJSController";

        activate();

        function activate() {
            logger.info('Activated ChartJSController View');
            init();
        }

        // random values for demo
        function rFactor() {
            return Math.round(Math.random() * 100);
        }

        function init() {
            // Line chart
            // -----------------------------------

            vm.lineData = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'My First dataset',
                        fillColor: 'rgba(114,102,186,0.2)',
                        strokeColor: 'rgba(114,102,186,1)',
                        pointColor: 'rgba(114,102,186,1)',
                        pointStrokeColor: '#fff',
                        pointHighlightFill: '#fff',
                        pointHighlightStroke: 'rgba(114,102,186,1)',
                        data: [rFactor(), rFactor(), rFactor(), rFactor(), rFactor(), rFactor(), rFactor()]
                    },
                    {
                        label: 'My Second dataset',
                        fillColor: 'rgba(35,183,229,0.2)',
                        strokeColor: 'rgba(35,183,229,1)',
                        pointColor: 'rgba(35,183,229,1)',
                        pointStrokeColor: '#fff',
                        pointHighlightFill: '#fff',
                        pointHighlightStroke: 'rgba(35,183,229,1)',
                        data: [rFactor(), rFactor(), rFactor(), rFactor(), rFactor(), rFactor(), rFactor()]
                    }
                ]
            };


            vm.lineOptions = {
                scaleShowGridLines: true,
                scaleGridLineColor: 'rgba(0,0,0,.05)',
                scaleGridLineWidth: 1,
                bezierCurve: true,
                bezierCurveTension: 0.4,
                pointDot: true,
                pointDotRadius: 4,
                pointDotStrokeWidth: 1,
                pointHitDetectionRadius: 20,
                datasetStroke: true,
                datasetStrokeWidth: 2,
                datasetFill: true
            };


            // Bar chart
            // -----------------------------------

            vm.barData = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        fillColor: colors.byName('info'),
                        strokeColor: colors.byName('info'),
                        highlightFill: colors.byName('info'),
                        highlightStroke: colors.byName('info'),
                        data: [rFactor(), rFactor(), rFactor(), rFactor(), rFactor(), rFactor(), rFactor()]
                    },
                    {
                        fillColor: colors.byName('primary'),
                        strokeColor: colors.byName('primary'),
                        highlightFill: colors.byName('primary'),
                        highlightStroke: colors.byName('primary'),
                        data: [rFactor(), rFactor(), rFactor(), rFactor(), rFactor(), rFactor(), rFactor()]
                    }
                ]
            };

            vm.barOptions = {
                scaleBeginAtZero: true,
                scaleShowGridLines: true,
                scaleGridLineColor: 'rgba(0,0,0,.05)',
                scaleGridLineWidth: 1,
                barShowStroke: true,
                barStrokeWidth: 2,
                barValueSpacing: 5,
                barDatasetSpacing: 1
            };


            //  Doughnut chart
            // -----------------------------------

            vm.doughnutData = [
                {
                    value: 300,
                    color: colors.byName('purple'),
                    highlight: colors.byName('purple'),
                    label: 'Purple'
                },
                {
                    value: 50,
                    color: colors.byName('info'),
                    highlight: colors.byName('info'),
                    label: 'Info'
                },
                {
                    value: 100,
                    color: colors.byName('yellow'),
                    highlight: colors.byName('yellow'),
                    label: 'Yellow'
                }
            ];

            vm.doughnutOptions = {
                segmentShowStroke: true,
                segmentStrokeColor: '#fff',
                segmentStrokeWidth: 2,
                percentageInnerCutout: 85,
                animationSteps: 100,
                animationEasing: 'easeOutBounce',
                animateRotate: true,
                animateScale: false
            };

            // Pie chart
            // -----------------------------------

            vm.pieData = [
                {
                    value: 300,
                    color: colors.byName('purple'),
                    highlight: colors.byName('purple'),
                    label: 'Purple'
                },
                {
                    value: 40,
                    color: colors.byName('yellow'),
                    highlight: colors.byName('yellow'),
                    label: 'Yellow'
                },
                {
                    value: 120,
                    color: colors.byName('info'),
                    highlight: colors.byName('info'),
                    label: 'Info'
                }
            ];

            vm.pieOptions = {
                segmentShowStroke: true,
                segmentStrokeColor: '#fff',
                segmentStrokeWidth: 2,
                percentageInnerCutout: 0, // Setting this to zero convert a doughnut into a Pie
                animationSteps: 100,
                animationEasing: 'easeOutBounce',
                animateRotate: true,
                animateScale: false
            };

            // Polar chart
            // -----------------------------------

            vm.polarData = [
                {
                    value: 300,
                    color: colors.byName('pink'),
                    highlight: colors.byName('pink'),
                    label: 'Red'
                },
                {
                    value: 50,
                    color: colors.byName('purple'),
                    highlight: colors.byName('purple'),
                    label: 'Green'
                },
                {
                    value: 100,
                    color: colors.byName('pink'),
                    highlight: colors.byName('pink'),
                    label: 'Yellow'
                },
                {
                    value: 140,
                    color: colors.byName('purple'),
                    highlight: colors.byName('purple'),
                    label: 'Grey'
                }
            ];

            vm.polarOptions = {
                scaleShowLabelBackdrop: true,
                scaleBackdropColor: 'rgba(255,255,255,0.75)',
                scaleBeginAtZero: true,
                scaleBackdropPaddingY: 1,
                scaleBackdropPaddingX: 1,
                scaleShowLine: true,
                segmentShowStroke: true,
                segmentStrokeColor: '#fff',
                segmentStrokeWidth: 2,
                animationSteps: 100,
                animationEasing: 'easeOutBounce',
                animateRotate: true,
                animateScale: false
            };


            // Radar chart
            // -----------------------------------

            vm.radarData = {
                labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
                datasets: [
                    {
                        label: 'My First dataset',
                        fillColor: 'rgba(114,102,186,0.2)',
                        strokeColor: 'rgba(114,102,186,1)',
                        pointColor: 'rgba(114,102,186,1)',
                        pointStrokeColor: '#fff',
                        pointHighlightFill: '#fff',
                        pointHighlightStroke: 'rgba(114,102,186,1)',
                        data: [65, 59, 90, 81, 56, 55, 40]
                    },
                    {
                        label: 'My Second dataset',
                        fillColor: 'rgba(151,187,205,0.2)',
                        strokeColor: 'rgba(151,187,205,1)',
                        pointColor: 'rgba(151,187,205,1)',
                        pointStrokeColor: '#fff',
                        pointHighlightFill: '#fff',
                        pointHighlightStroke: 'rgba(151,187,205,1)',
                        data: [28, 48, 40, 19, 96, 27, 100]
                    }
                ]
            };

            vm.radarOptions = {
                scaleShowLine: true,
                angleShowLineOut: true,
                scaleShowLabels: false,
                scaleBeginAtZero: true,
                angleLineColor: 'rgba(0,0,0,.1)',
                angleLineWidth: 1,
                pointLabelFontFamily: "'Arial'",
                pointLabelFontStyle: 'bold',
                pointLabelFontSize: 10,
                pointLabelFontColor: '#565656',
                pointDot: true,
                pointDotRadius: 3,
                pointDotStrokeWidth: 1,
                pointHitDetectionRadius: 20,
                datasetStroke: true,
                datasetStrokeWidth: 2,
                datasetFill: true
            };
        }
    }
})();

/**=========================================================
 * Module: app.charts
 * Setup options and data for flot chart directive
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.charts')
        .controller('Flot', Flot);

    Flot.$inject = ['$rootScope', 'ChartDataservice', '$timeout', 'logger', '$q'];

    function Flot($rootScope, dataservice, $timeout, logger, $q) {
        // required for inner references
        var vm = this;

        // Generate random data for realtime demo
        var data = [], totalPoints = 300;

        vm.title = 'FlotChart';

        vm.barData = [];
        vm.barStackeData = [];
        vm.splineData = [];
        vm.getAreaChart = [];
        vm.realTimeData = [];
        vm.areaData = [];
        vm.lineData =  [];
        vm.pieData = [];
        vm.donutData = [];

        activate();

        function activate() {
            var promises = [
                getBarChart(),
                getBarstackedChart(),
                getSplineChart(),
                getAreaChart(),
                getLineChart(),
                getPieChart(),
                getDonutChart(),
                update()
            ];
            return $q.all(promises).then(function() {
                logger.info('Activated FlotChart View');
            });
        }

        function getBarChart() {
            return dataservice.getBarChart().then(function(data) {
                vm.barData = data;
                return vm.barData;
            });
        }

        function getBarstackedChart() {
            return dataservice.getBarstackedChart().then(function(data) {
                vm.barStackeData = data;
                return vm.barStackeData;
            });
        }

        function getSplineChart() {
            return dataservice.getSplineChart().then(function(data) {
                vm.splineData = data;
                return vm.splineData;
            });
        }

        function getAreaChart() {
            return dataservice.getAreaChart().then(function(data) {
                vm.areaData = data;
                return vm.areaData;
            });
        }

        function getLineChart() {
            return dataservice.getLineChart().then(function(data) {
                vm.lineData = data;
                return vm.lineData;
            });
        }

        function getPieChart() {
            return dataservice.getPieChart().then(function(data) {
                vm.pieData = data;
                return vm.pieData;
            });
        }

        function getDonutChart() {
            return dataservice.getDonutChart().then(function(data) {
                vm.donutData = data;
                return vm.donutData;
            });
        }

        // BAR
        // -----------------------------------
        vm.barOptions = {
            series: {
                bars: {
                    align: 'center',
                    lineWidth: 0,
                    show: true,
                    barWidth: 0.6,
                    fill: 0.9
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function (label, x, y) {
                    return x + ' : ' + y;
                }
            },
            xaxis: {
                tickColor: '#fcfcfc',
                mode: 'categories'
            },
            yaxis: {
                position: ($rootScope.app.layout.isRTL ? 'right' : 'left'),
                tickColor: '#eee'
            },
            shadowSize: 0
        };

        // BAR STACKED
        // -----------------------------------
        vm.barStackedOptions = {
            series: {
                stack: true,
                bars: {
                    align: 'center',
                    lineWidth: 0,
                    show: true,
                    barWidth: 0.6,
                    fill: 0.9
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function (label, x, y) {
                    return x + ' : ' + y;
                }
            },
            xaxis: {
                tickColor: '#fcfcfc',
                mode: 'categories'
            },
            yaxis: {
                min: 0,
                max: 200, // optional: use it for a clear represetation
                position: ($rootScope.app.layout.isRTL ? 'right' : 'left'),
                tickColor: '#eee'
            },
            shadowSize: 0
        };

        // SPLINE
        // -----------------------------------
        vm.splineOptions = {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true,
                    radius: 4
                },
                splines: {
                    show: true,
                    tension: 0.4,
                    lineWidth: 1,
                    fill: 0.5
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function (label, x, y) {
                    return x + ' : ' + y;
                }
            },
            xaxis: {
                tickColor: '#fcfcfc',
                mode: 'categories'
            },
            yaxis: {
                min: 0,
                max: 150, // optional: use it for a clear represetation
                tickColor: '#eee',
                position: ($rootScope.app.layout.isRTL ? 'right' : 'left'),
                tickFormatter: function (v) {
                    return v/* + ' visitors'*/;
                }
            },
            shadowSize: 0
        };

        // AREA
        // -----------------------------------
        vm.areaOptions = {
            series: {
                lines: {
                    show: true,
                    fill: 0.8
                },
                points: {
                    show: true,
                    radius: 4
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function (label, x, y) {
                    return x + ' : ' + y;
                }
            },
            xaxis: {
                tickColor: '#fcfcfc',
                mode: 'categories'
            },
            yaxis: {
                min: 0,
                tickColor: '#eee',
                position: ($rootScope.app.layout.isRTL ? 'right' : 'left'),
                tickFormatter: function (v) {
                    return v + ' visitors';
                }
            },
            shadowSize: 0
        };

        // LINE
        // -----------------------------------
        vm.lineOptions = {
            series: {
                lines: {
                    show: true,
                    fill: 0.01
                },
                points: {
                    show: true,
                    radius: 4
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function (label, x, y) {
                    return x + ' : ' + y;
                }
            },
            xaxis: {
                tickColor: '#eee',
                mode: 'categories'
            },
            yaxis: {
                position: ($rootScope.app.layout.isRTL ? 'right' : 'left'),
                tickColor: '#eee'
            },
            shadowSize: 0
        };

        // PIE
        // -----------------------------------
        vm.pieOptions = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0,
                    label: {
                        show: true,
                        radius: 0.8,
                        formatter: function (label, series) {
                            return '<div class="flot-pie-label">' +
                                    //label + ' : ' +
                                Math.round(series.percent) +
                                '%</div>';
                        },
                        background: {
                            opacity: 0.8,
                            color: '#222'
                        }
                    }
                }
            }
        };

        // DONUT
        // -----------------------------------
        vm.donutOptions = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.5 // This makes the donut shape
                }
            }
        };

        // REALTIME
        // -----------------------------------
        vm.realTimeOptions = {
            series: {
                lines: {show: true, fill: true, fillColor: {colors: ['#a0e0f3', '#23b7e5']}},
                shadowSize: 0 // Drawing is faster without shadows
            },
            grid: {
                show: false,
                borderWidth: 0,
                minBorderMargin: 20,
                labelMargin: 10
            },
            xaxis: {
                tickFormatter: function () {
                    return "";
                }
            },
            yaxis: {
                min: 0,
                max: 110
            },
            legend: {
                show: true
            },
            colors: ["#23b7e5"]
        };



        function getRandomData() {
            if (data.length > 0)
                data = data.slice(1);
            // Do a random walk
            while (data.length < totalPoints) {
                var prev = data.length > 0 ? data[data.length - 1] : 50,
                    y = prev + Math.random() * 10 - 5;
                if (y < 0) {
                    y = 0;
                } else if (y > 100) {
                    y = 100;
                }
                data.push(y);
            }
            // Zip the generated y values with the x values
            var res = [];
            for (var i = 0; i < data.length; ++i) {
                res.push([i, data[i]]);
            }
            return [res];
        }

        function update() {
            vm.realTimeData = getRandomData();
            $timeout(update, 30);
        }

        // end random data generation
    }
})();


(function() {
    'use strict';

    angular.module('app.maps', ['app.core']);
})();

(function() {
    'use strict';

    angular
        .module('app.maps')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());

        function getStates() {
            return [
                {
                    state: 'app.maps-google',
                    config: {
                        url: '/maps-google',
                        title: 'Maps Google',
                        templateUrl: 'app/modules/maps/views/maps-google.html',
                        resolve: routerHelper.resolveFor('loadGoogleMapsJS', function () {
                            return loadGoogleMaps();
                        }, 'google-map')
                    }
                },
                {
                    state: 'app.maps-vector',
                    config: {
                        url: '/maps-vector',
                        title: 'Maps Vector',
                        templateUrl: 'app/modules/maps/views/maps-vector.html',
                        controller: 'VectorMapController',
                        resolve: routerHelper.resolveFor('vector-map')
                    }
                }
            ];
        }
    }
})();

/**=========================================================
 * Module: app.maps
 * Provides a simple way to implement bootstrap modals from templates
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.maps')
        .controller('GMapController', GMapController);

    GMapController.$inject = ['$timeout', 'logger'];

    function GMapController($timeout, logger) {

        // required for inner references
        var vm = this;
        vm.mapAddress = '';
        vm.mapLoading = true;

        vm.title = "GMapController";

        activate();

        function activate() {
            return loadMap().then(function() {
                logger.info('Activated GMapController View');
            });
        }

        function loadMap() {
            vm.mapLoading = true;
            return $timeout(function() {
                vm.mapAddress = '276 N TUSTIN ST, ORANGE, CA 92867';
                vm.mapLoading = false;
            }, 2000);
        }


    }
})();

/**=========================================================
 * Module: app.maps
 * Provides a simple way to implement bootstrap modals from templates
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.maps')
        .controller('ModalGmapController', ModalGmapController);

    ModalGmapController.$inject = ['$modal', '$timeout', 'gmap', 'logger'];

    function ModalGmapController($modal, $timeout, gmap, logger) {

        // required for inner references
        var mgvm = this;

        mgvm.title = "ModalGmapController";
        mgvm.open = open;

        activate();

        function activate() {
            logger.info('Activated ModalGmapController View');
        }

        function open(size) {
            var modalInstance = $modal.open({
                templateUrl: '/myModalContent.html',
                controller: ModalInstanceCtrl,
                size: size
            });
        }

        // Please note that $modalInstance represents a modal window (instance) dependency.
        // It is not the same as the $modal service used above.

        ModalInstanceCtrl.$inject = ['$scope', '$modalInstance', 'gmap'];

        function ModalInstanceCtrl($scope, $modalInstance, gmap) {

            $scope.ok = ok;
            $scope.cancel = cancel;
            $scope.gmap = gmap;

            $modalInstance.opened.then(function () {
                // When modal has been opened
                // set to true the initialization param
                //$timeout(function () {
                //    $scope.initGmap = true;
                //});
                $scope.initGmap = true;
            });

            function ok() {
                $modalInstance.close('closed');
            }

            function cancel() {
                $modalInstance.dismiss('cancel');
            }
        }
    }
})();

/**=========================================================
 * Module: vmaps,js
 * jVector Maps support
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.maps')
        .controller('VectorMapController', VectorMapController);

    VectorMapController.$inject = ['$scope', 'logger'];

    function VectorMapController($scope, logger) {

        $scope.title = "GMapController";

        activate();

        function activate() {
            logger.info('Activated VectorMapController View');
        }

        $scope.seriesData = {
            'CA': 11100,   // Canada
            'DE': 2510,    // Germany
            'FR': 3710,    // France
            'AU': 5710,    // Australia
            'GB': 8310,    // Great Britain
            'RU': 9310,    // Russia
            'BR': 6610,    // Brazil
            'IN': 7810,    // India
            'CN': 4310,    // China
            'US': 839,     // USA
            'SA': 410      // Saudi Arabia
        };

        $scope.markersData = [
            {latLng: [41.90, 12.45], name: 'Vatican City'},
            {latLng: [43.73, 7.41], name: 'Monaco'},
            {latLng: [-0.52, 166.93], name: 'Nauru'},
            {latLng: [-8.51, 179.21], name: 'Tuvalu'},
            {latLng: [7.11, 171.06], name: 'Marshall Islands'},
            {latLng: [17.3, -62.73], name: 'Saint Kitts and Nevis'},
            {latLng: [3.2, 73.22], name: 'Maldives'},
            {latLng: [35.88, 14.5], name: 'Malta'},
            {latLng: [41.0, -71.06], name: 'New England'},
            {latLng: [12.05, -61.75], name: 'Grenada'},
            {latLng: [13.16, -59.55], name: 'Barbados'},
            {latLng: [17.11, -61.85], name: 'Antigua and Barbuda'},
            {latLng: [-4.61, 55.45], name: 'Seychelles'},
            {latLng: [7.35, 134.46], name: 'Palau'},
            {latLng: [42.5, 1.51], name: 'Andorra'}
        ];
    }
})();

(function() {
    'use strict';

    angular.module('app.forms', []);
})();

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


/**
 * @ngdoc service
 * @name formsDataservice
 * @description
 *     Application data API.
 */
(function() {
    'use strict';

    angular
        .module('app.forms')
        .factory('formsDataservice', formsDataservice);

    formsDataservice.$inject = ['$http', '$location', '$q', 'exception', 'logger'];

    /**
     * @ngdoc method
     * @name app.forms#formsDataservice
     * @description
     *     Configures the dataservice.
     * @param  {[type]} $http
     * @param  {[type]} $location
     * @param  {[type]} $q
     * @param  {[type]} exception
     * @param  {[type]} logger
     * @return {Object} dataservice service
     */
    /* @ngInject */
    function formsDataservice($http, $location, $q, exception, logger) {
        /* jshint validthis:true */
        var readyPromise;
        var isPrimed = false;
        var primePromise;

        var service = {
            getCities: getCities,
            getChosenStates: getChosenStates,
            getXeditableGroups: getXeditableGroups,
            ready: ready
        };

        return service;

        //================================================================

        function getXeditableGroups() {

            return $http.get('/api/xeditable-groups')
                .then(getDataComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getxEditableTableData')(message);
                    $location.url('/dashboard');
                });

            function getDataComplete(results, status, headers, config) {
                return results.data;
            }
        }

        function getCities() {
            return $http.get('/api/cities')
                .then(getCitiesComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getCities')(message);
                    $location.url('/dashboard');
                });

            function getCitiesComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getChosenStates() {
            return $http.get('/api/chosen-states')
                .then(getChosenStatesComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getChosenStates')(message);
                    $location.url('/dashboard');
                });

            function getChosenStatesComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getReady() {
            if (!readyPromise) {
                // Apps often pre-fetch session data ("prime the app")
                // before showing the first view.
                // This app doesn't need priming but we add a
                // no-op implementation to show how it would work.
                logger.info('Primed the app data');
                readyPromise = $q.when(service);
            }
            return readyPromise;
        }

        function ready(promisesArray) {
            return getReady()
                .then(function() {
                    return promisesArray ? $q.all(promisesArray) : readyPromise;
                })
                .catch(exception.catcher('"ready" function failed'));
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('app.forms')
        .controller('FormDemoCtrl', FormDemoCtrl);

    FormDemoCtrl.$inject = ['$q', 'logger', 'formsDataservice'];

    function FormDemoCtrl($q, logger, formsDataservice) {

        // required for inner references
        var vm = this;

        vm.title = "FormDemoCtrl";
        vm.cities = [];
        vm.states = [];
        vm.alertSubmit = alertSubmit;

        activate();

        ///////////////////////////////////////

        function activate() {
            var promises = [getCities(), getChosenStates()];
            return $q.all(promises).then(function() {
                logger.info('Activated Form View');
            });
        }

        function getCities() {
            return formsDataservice.getCities().then(function (data) {
                vm.cities = data;
                return vm.cities;
            });
        }

        function getChosenStates() {
            return formsDataservice.getChosenStates().then(function (data) {
                vm.states = data;
                return vm.states;
            });
        }

        function alertSubmit() {
            logger.info('Form submitted!');
            return false;
        }
    }
})();

/**=========================================================
 * Module: form-imgcrop.js
 * Image crop controller
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.forms')
        .controller('ImageCropController', ImageCropController);

    ImageCropController.$inject = ['$scope'];

    function ImageCropController($scope) {

        $scope.reset = function () {
            $scope.myImage = '';
            $scope.myCroppedImage = '';
            $scope.imgcropType = "square";
        };

        $scope.reset();

        var handleFileSelect = function (evt) {
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.myImage = evt.target.result;
                });
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        };
        angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    }
})();
/**=========================================================
 * Module: uiselect.js
 * uiSelect controller
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.forms')
        .controller('uiSelectController', uiSelectController);

    uiSelectController.$inject = ['$scope', '$http'];

    function uiSelectController($scope, $http) {
        $scope.disabled = undefined;

        $scope.enable = function () {
            $scope.disabled = false;
        };

        $scope.disable = function () {
            $scope.disabled = true;
        };

        $scope.clear = function () {
            $scope.person.selected = undefined;
            $scope.address.selected = undefined;
            $scope.country.selected = undefined;
        };

        $scope.person = {};
        $scope.people = [
            {name: 'Adam', email: 'adam@email.com', age: 10},
            {name: 'Amalie', email: 'amalie@email.com', age: 12},
            {name: 'Wladimir', email: 'wladimir@email.com', age: 30},
            {name: 'Samantha', email: 'samantha@email.com', age: 31},
            {name: 'Estefanía', email: 'estefanía@email.com', age: 16},
            {name: 'Natasha', email: 'natasha@email.com', age: 54},
            {name: 'Nicole', email: 'nicole@email.com', age: 43},
            {name: 'Adrian', email: 'adrian@email.com', age: 21}
        ];

        $scope.address = {};
        $scope.refreshAddresses = function (address) {
            var params = {address: address, sensor: false};
            return $http.get(
                'http://maps.googleapis.com/maps/api/geocode/json',
                {params: params}
            ).then(function (response) {
                    $scope.addresses = response.data.results;
                });
        };

        $scope.country = {};
        $scope.countries = [ // Taken from https://gist.github.com/unceus/6501985
            {name: 'Afghanistan', code: 'AF'},
            {name: 'Åland Islands', code: 'AX'},
            {name: 'Albania', code: 'AL'},
            {name: 'Algeria', code: 'DZ'},
            {name: 'American Samoa', code: 'AS'},
            {name: 'Andorra', code: 'AD'},
            {name: 'Angola', code: 'AO'},
            {name: 'Anguilla', code: 'AI'},
            {name: 'Antarctica', code: 'AQ'},
            {name: 'Antigua and Barbuda', code: 'AG'},
            {name: 'Argentina', code: 'AR'},
            {name: 'Armenia', code: 'AM'},
            {name: 'Aruba', code: 'AW'},
            {name: 'Australia', code: 'AU'},
            {name: 'Austria', code: 'AT'},
            {name: 'Azerbaijan', code: 'AZ'},
            {name: 'Bahamas', code: 'BS'},
            {name: 'Bahrain', code: 'BH'},
            {name: 'Bangladesh', code: 'BD'},
            {name: 'Barbados', code: 'BB'},
            {name: 'Belarus', code: 'BY'},
            {name: 'Belgium', code: 'BE'},
            {name: 'Belize', code: 'BZ'},
            {name: 'Benin', code: 'BJ'},
            {name: 'Bermuda', code: 'BM'},
            {name: 'Bhutan', code: 'BT'},
            {name: 'Bolivia', code: 'BO'},
            {name: 'Bosnia and Herzegovina', code: 'BA'},
            {name: 'Botswana', code: 'BW'},
            {name: 'Bouvet Island', code: 'BV'},
            {name: 'Brazil', code: 'BR'},
            {name: 'British Indian Ocean Territory', code: 'IO'},
            {name: 'Brunei Darussalam', code: 'BN'},
            {name: 'Bulgaria', code: 'BG'},
            {name: 'Burkina Faso', code: 'BF'},
            {name: 'Burundi', code: 'BI'},
            {name: 'Cambodia', code: 'KH'},
            {name: 'Cameroon', code: 'CM'},
            {name: 'Canada', code: 'CA'},
            {name: 'Cape Verde', code: 'CV'},
            {name: 'Cayman Islands', code: 'KY'},
            {name: 'Central African Republic', code: 'CF'},
            {name: 'Chad', code: 'TD'},
            {name: 'Chile', code: 'CL'},
            {name: 'China', code: 'CN'},
            {name: 'Christmas Island', code: 'CX'},
            {name: 'Cocos (Keeling) Islands', code: 'CC'},
            {name: 'Colombia', code: 'CO'},
            {name: 'Comoros', code: 'KM'},
            {name: 'Congo', code: 'CG'},
            {name: 'Congo, The Democratic Republic of the', code: 'CD'},
            {name: 'Cook Islands', code: 'CK'},
            {name: 'Costa Rica', code: 'CR'},
            {name: 'Cote D\'Ivoire', code: 'CI'},
            {name: 'Croatia', code: 'HR'},
            {name: 'Cuba', code: 'CU'},
            {name: 'Cyprus', code: 'CY'},
            {name: 'Czech Republic', code: 'CZ'},
            {name: 'Denmark', code: 'DK'},
            {name: 'Djibouti', code: 'DJ'},
            {name: 'Dominica', code: 'DM'},
            {name: 'Dominican Republic', code: 'DO'},
            {name: 'Ecuador', code: 'EC'},
            {name: 'Egypt', code: 'EG'},
            {name: 'El Salvador', code: 'SV'},
            {name: 'Equatorial Guinea', code: 'GQ'},
            {name: 'Eritrea', code: 'ER'},
            {name: 'Estonia', code: 'EE'},
            {name: 'Ethiopia', code: 'ET'},
            {name: 'Falkland Islands (Malvinas)', code: 'FK'},
            {name: 'Faroe Islands', code: 'FO'},
            {name: 'Fiji', code: 'FJ'},
            {name: 'Finland', code: 'FI'},
            {name: 'France', code: 'FR'},
            {name: 'French Guiana', code: 'GF'},
            {name: 'French Polynesia', code: 'PF'},
            {name: 'French Southern Territories', code: 'TF'},
            {name: 'Gabon', code: 'GA'},
            {name: 'Gambia', code: 'GM'},
            {name: 'Georgia', code: 'GE'},
            {name: 'Germany', code: 'DE'},
            {name: 'Ghana', code: 'GH'},
            {name: 'Gibraltar', code: 'GI'},
            {name: 'Greece', code: 'GR'},
            {name: 'Greenland', code: 'GL'},
            {name: 'Grenada', code: 'GD'},
            {name: 'Guadeloupe', code: 'GP'},
            {name: 'Guam', code: 'GU'},
            {name: 'Guatemala', code: 'GT'},
            {name: 'Guernsey', code: 'GG'},
            {name: 'Guinea', code: 'GN'},
            {name: 'Guinea-Bissau', code: 'GW'},
            {name: 'Guyana', code: 'GY'},
            {name: 'Haiti', code: 'HT'},
            {name: 'Heard Island and Mcdonald Islands', code: 'HM'},
            {name: 'Holy See (Vatican City State)', code: 'VA'},
            {name: 'Honduras', code: 'HN'},
            {name: 'Hong Kong', code: 'HK'},
            {name: 'Hungary', code: 'HU'},
            {name: 'Iceland', code: 'IS'},
            {name: 'India', code: 'IN'},
            {name: 'Indonesia', code: 'ID'},
            {name: 'Iran, Islamic Republic Of', code: 'IR'},
            {name: 'Iraq', code: 'IQ'},
            {name: 'Ireland', code: 'IE'},
            {name: 'Isle of Man', code: 'IM'},
            {name: 'Israel', code: 'IL'},
            {name: 'Italy', code: 'IT'},
            {name: 'Jamaica', code: 'JM'},
            {name: 'Japan', code: 'JP'},
            {name: 'Jersey', code: 'JE'},
            {name: 'Jordan', code: 'JO'},
            {name: 'Kazakhstan', code: 'KZ'},
            {name: 'Kenya', code: 'KE'},
            {name: 'Kiribati', code: 'KI'},
            {name: 'Korea, Democratic People\'s Republic of', code: 'KP'},
            {name: 'Korea, Republic of', code: 'KR'},
            {name: 'Kuwait', code: 'KW'},
            {name: 'Kyrgyzstan', code: 'KG'},
            {name: 'Lao People\'s Democratic Republic', code: 'LA'},
            {name: 'Latvia', code: 'LV'},
            {name: 'Lebanon', code: 'LB'},
            {name: 'Lesotho', code: 'LS'},
            {name: 'Liberia', code: 'LR'},
            {name: 'Libyan Arab Jamahiriya', code: 'LY'},
            {name: 'Liechtenstein', code: 'LI'},
            {name: 'Lithuania', code: 'LT'},
            {name: 'Luxembourg', code: 'LU'},
            {name: 'Macao', code: 'MO'},
            {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'},
            {name: 'Madagascar', code: 'MG'},
            {name: 'Malawi', code: 'MW'},
            {name: 'Malaysia', code: 'MY'},
            {name: 'Maldives', code: 'MV'},
            {name: 'Mali', code: 'ML'},
            {name: 'Malta', code: 'MT'},
            {name: 'Marshall Islands', code: 'MH'},
            {name: 'Martinique', code: 'MQ'},
            {name: 'Mauritania', code: 'MR'},
            {name: 'Mauritius', code: 'MU'},
            {name: 'Mayotte', code: 'YT'},
            {name: 'Mexico', code: 'MX'},
            {name: 'Micronesia, Federated States of', code: 'FM'},
            {name: 'Moldova, Republic of', code: 'MD'},
            {name: 'Monaco', code: 'MC'},
            {name: 'Mongolia', code: 'MN'},
            {name: 'Montserrat', code: 'MS'},
            {name: 'Morocco', code: 'MA'},
            {name: 'Mozambique', code: 'MZ'},
            {name: 'Myanmar', code: 'MM'},
            {name: 'Namibia', code: 'NA'},
            {name: 'Nauru', code: 'NR'},
            {name: 'Nepal', code: 'NP'},
            {name: 'Netherlands', code: 'NL'},
            {name: 'Netherlands Antilles', code: 'AN'},
            {name: 'New Caledonia', code: 'NC'},
            {name: 'New Zealand', code: 'NZ'},
            {name: 'Nicaragua', code: 'NI'},
            {name: 'Niger', code: 'NE'},
            {name: 'Nigeria', code: 'NG'},
            {name: 'Niue', code: 'NU'},
            {name: 'Norfolk Island', code: 'NF'},
            {name: 'Northern Mariana Islands', code: 'MP'},
            {name: 'Norway', code: 'NO'},
            {name: 'Oman', code: 'OM'},
            {name: 'Pakistan', code: 'PK'},
            {name: 'Palau', code: 'PW'},
            {name: 'Palestinian Territory, Occupied', code: 'PS'},
            {name: 'Panama', code: 'PA'},
            {name: 'Papua New Guinea', code: 'PG'},
            {name: 'Paraguay', code: 'PY'},
            {name: 'Peru', code: 'PE'},
            {name: 'Philippines', code: 'PH'},
            {name: 'Pitcairn', code: 'PN'},
            {name: 'Poland', code: 'PL'},
            {name: 'Portugal', code: 'PT'},
            {name: 'Puerto Rico', code: 'PR'},
            {name: 'Qatar', code: 'QA'},
            {name: 'Reunion', code: 'RE'},
            {name: 'Romania', code: 'RO'},
            {name: 'Russian Federation', code: 'RU'},
            {name: 'Rwanda', code: 'RW'},
            {name: 'Saint Helena', code: 'SH'},
            {name: 'Saint Kitts and Nevis', code: 'KN'},
            {name: 'Saint Lucia', code: 'LC'},
            {name: 'Saint Pierre and Miquelon', code: 'PM'},
            {name: 'Saint Vincent and the Grenadines', code: 'VC'},
            {name: 'Samoa', code: 'WS'},
            {name: 'San Marino', code: 'SM'},
            {name: 'Sao Tome and Principe', code: 'ST'},
            {name: 'Saudi Arabia', code: 'SA'},
            {name: 'Senegal', code: 'SN'},
            {name: 'Serbia and Montenegro', code: 'CS'},
            {name: 'Seychelles', code: 'SC'},
            {name: 'Sierra Leone', code: 'SL'},
            {name: 'Singapore', code: 'SG'},
            {name: 'Slovakia', code: 'SK'},
            {name: 'Slovenia', code: 'SI'},
            {name: 'Solomon Islands', code: 'SB'},
            {name: 'Somalia', code: 'SO'},
            {name: 'South Africa', code: 'ZA'},
            {name: 'South Georgia and the South Sandwich Islands', code: 'GS'},
            {name: 'Spain', code: 'ES'},
            {name: 'Sri Lanka', code: 'LK'},
            {name: 'Sudan', code: 'SD'},
            {name: 'Suriname', code: 'SR'},
            {name: 'Svalbard and Jan Mayen', code: 'SJ'},
            {name: 'Swaziland', code: 'SZ'},
            {name: 'Sweden', code: 'SE'},
            {name: 'Switzerland', code: 'CH'},
            {name: 'Syrian Arab Republic', code: 'SY'},
            {name: 'Taiwan, Province of China', code: 'TW'},
            {name: 'Tajikistan', code: 'TJ'},
            {name: 'Tanzania, United Republic of', code: 'TZ'},
            {name: 'Thailand', code: 'TH'},
            {name: 'Timor-Leste', code: 'TL'},
            {name: 'Togo', code: 'TG'},
            {name: 'Tokelau', code: 'TK'},
            {name: 'Tonga', code: 'TO'},
            {name: 'Trinidad and Tobago', code: 'TT'},
            {name: 'Tunisia', code: 'TN'},
            {name: 'Turkey', code: 'TR'},
            {name: 'Turkmenistan', code: 'TM'},
            {name: 'Turks and Caicos Islands', code: 'TC'},
            {name: 'Tuvalu', code: 'TV'},
            {name: 'Uganda', code: 'UG'},
            {name: 'Ukraine', code: 'UA'},
            {name: 'United Arab Emirates', code: 'AE'},
            {name: 'United Kingdom', code: 'GB'},
            {name: 'United States', code: 'US'},
            {name: 'United States Minor Outlying Islands', code: 'UM'},
            {name: 'Uruguay', code: 'UY'},
            {name: 'Uzbekistan', code: 'UZ'},
            {name: 'Vanuatu', code: 'VU'},
            {name: 'Venezuela', code: 'VE'},
            {name: 'Vietnam', code: 'VN'},
            {name: 'Virgin Islands, British', code: 'VG'},
            {name: 'Virgin Islands, U.S.', code: 'VI'},
            {name: 'Wallis and Futuna', code: 'WF'},
            {name: 'Western Sahara', code: 'EH'},
            {name: 'Yemen', code: 'YE'},
            {name: 'Zambia', code: 'ZM'},
            {name: 'Zimbabwe', code: 'ZW'}
        ];


        // Multiple
        $scope.someGroupFn = function (item) {

            if (item.name[0] >= 'A' && item.name[0] <= 'M')
                return 'From A - M';

            if (item.name[0] >= 'N' && item.name[0] <= 'Z')
                return 'From N - Z';

        };

        $scope.counter = 0;
        $scope.someFunction = function (item, model) {
            $scope.counter++;
            $scope.eventResult = {item: item, model: model};
        };

        $scope.availableColors = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Maroon', 'Umbra', 'Turquoise'];

        $scope.multipleDemo = {};
        $scope.multipleDemo.colors = ['Blue', 'Red'];
        $scope.multipleDemo.selectedPeople = [$scope.people[5], $scope.people[4]];
        $scope.multipleDemo.selectedPeopleWithGroupBy = [$scope.people[8], $scope.people[6]];
        $scope.multipleDemo.selectedPeopleSimple = ['samantha@email.com', 'wladimir@email.com'];

    }
})();


/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
(function () {
    'use strict';

    angular
        .module('app.forms')
        .filter('propsFilter', propsFilter);

    function propsFilter() {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function (item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    }
})();
/**=========================================================
 * Module: upload.js
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.forms')
        .controller('FileUploadController', FileUploadController);

    FileUploadController.$inject = ['$scope', 'FileUploader'];

    function FileUploadController($scope, FileUploader) {

        var uploader = $scope.uploader = new FileUploader({
            url: 'server/upload.php'
        });

        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
    }
})();
/**=========================================================
 * Module: form-xeditable.js
 * Form xEditable controller
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.forms')
        .controller('FormxEditableController', FormxEditableController);

    FormxEditableController.$inject = ['$scope', '$q', 'editableOptions', 'editableThemes', '$filter', 'formsDataservice', 'logger'];

    function FormxEditableController($scope, $q, editableOptions, editableThemes, $filter, formsDataservice, logger) {
        // required for inner references
        var vm = this;

        vm.title = "FormxEditableController";
        vm.user = {};
        vm.user2 = {};
        vm.user3 = {};
        vm.user4 = {};
        vm.statuses = [];
        vm.groups = [];
        vm.states = [];

        vm.showStatus = showStatus;

        init();
        activate();

        ///////////////////////////////////////

        function activate() {
            var promises = [loadGroups()];
            return $q.all(promises).then(function() {
                logger.info('Activated FormxEditableController View');
            });
        }

        function init() {
            editableOptions.theme = 'bs3';

            editableThemes.bs3.inputClass = 'input-sm';
            editableThemes.bs3.buttonsClass = 'btn-sm';
            editableThemes.bs3.submitTpl = '<button type="submit" class="btn btn-success"><span class="fa fa-check"></span></button>';
            editableThemes.bs3.cancelTpl = '<button type="button" class="btn btn-default" ng-click="$form.$cancel()">' +
            '<span class="fa fa-times text-muted"></span>' +
            '</button>';

            vm.user = {
                email: 'email@example.com',
                tel: '123-45-67',
                number: 29,
                range: 10,
                url: 'http://example.com',
                search: 'blabla',
                color: '#6a4415',
                date: null,
                time: '12:30',
                datetime: null,
                month: null,
                week: null,
                desc: 'Sed pharetra euismod dolor, id feugiat ante volutpat eget. '
            };

            // Local select
            // -----------------------------------

            vm.user2 = {
                status: 2
            };

            vm.statuses = [
                {value: 1, text: 'status1'},
                {value: 2, text: 'status2'},
                {value: 3, text: 'status3'},
                {value: 4, text: 'status4'}
            ];

            // select remote
            // -----------------------------------

            vm.user3 = {
                id: 4,
                text: 'admin' // original value
            };

            $scope.$watch('vm.user3.id', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    var selected = $filter('filter')(vm.groups, {id: vm.user3.id});
                    vm.user3.text = selected.length ? selected[0].text : null;
                }
            });

            vm.groups = [];

            // Typeahead
            // -----------------------------------

            vm.user4 = {
                state: 'Arizona'
            };

            vm.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
        }

        function loadGroups() {
            return vm.groups.length ? null : formsDataservice.getXeditableGroups().then(function (data) {
                vm.groups = data;
            });
        }

        function showStatus() {
            var selected = $filter('filter')(vm.statuses, {value: vm.user2.status});
            return (vm.user2.status && selected.length) ? selected[0].text : 'Not set';
        }
    }
})();

(function() {
    'use strict';

    angular.module('app.tables', []);
})();

(function() {
    'use strict';

    angular
        .module('app.tables')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());

        function getStates() {
            return [
                {
                    state: 'app.table-standard',
                    config: {
                        url: '/table-standard',
                        title: 'Table Standard',
                        templateUrl: 'app/modules/tables/views/table-standard.html'
                    }
                },
                {
                    state: 'app.table-extended',
                    config: {
                        url: '/table-extended',
                        title: 'Table Extended',
                        templateUrl: 'app/modules/tables/views/table-extended.html'
                    }
                },
                {
                    state: 'app.table-datatable',
                    config: {
                        url: '/table-datatable',
                        title: 'Table Datatable',
                        templateUrl: 'app/modules/tables/views/table-datatable.html',
                        resolve: routerHelper.resolveFor('datatables', 'datatables-plugins')
                    }
                },
                {
                    state: 'app.table-xeditable',
                    config: {
                        url: '/table-xeditable',
                        templateUrl: 'app/modules/tables/views/table-xeditable.html',
                        resolve: routerHelper.resolveFor('xeditable')
                    }
                },
                {
                    state: 'app.table-ngtable',
                    config: {
                        url: '/table-ngtable',
                        templateUrl: 'app/modules/tables/views/table-ngtable.html',
                        resolve: routerHelper.resolveFor('ngTable', 'ngTableExport')
                    }
                },
                {
                    state: 'app.table-nggrid',
                    config: {
                        url: '/table-nggrid',
                        templateUrl: 'app/modules/tables/views/table-ng-grid.html',
                        resolve: routerHelper.resolveFor('ngGrid')
                    }
                }
            ];
        }
    }
})();


/**
 * @ngdoc service
 * @name ngTableDataService
 * @description
 *     Application data API.
 */
(function() {
    'use strict';

    angular
        .module('app.tables')
        .factory('ngTableDataService', ngTableDataService);

    ngTableDataService.$inject = ['$http', '$location', '$q', 'exception', 'logger', '$timeout'];

    /**
     * @ngdoc method
     * @name app.charts#ngTableDataService
     * @description
     *     Configures the dataservice.
     * @param  {[type]} $http
     * @param  {[type]} $location
     * @param  {[type]} $q
     * @param  {[type]} exception
     * @param  {[type]} logger
     * @return {Object} dataservice service
     */
    /* @ngInject */
    function ngTableDataService($http, $location, $q, exception, logger, $timeout) {
        /* jshint validthis:true */

        var self = this;
        var readyPromise;
        var isPrimed = false;
        var primePromise;
        var cache;

        var service = {
            getData: getData,
            ready: ready
        };

        return service;

        //================================================================

        function getData(params) {

            if (!self.cache) {
                return $http.get('/api/table-data')
                    .then(getDataComplete)
                    .catch(function(message) {
                        exception.catcher('XHR Failed for getTableData')(message);
                        $location.url('/dashboard');
                    });
            } else {
                return filterdata(params);
            }

            function getDataComplete(results, status, headers, config) {
                self.cache = results.data;
                return filterdata(params);
            }

            function filterdata(params) {
                return $timeout(function () {
                    var from = (params.page() - 1) * params.count();
                    var to = params.page() * params.count();
                    var filteredData = self.cache.result.slice(from, to);

                    params.total(self.cache.total);
                    return filteredData;
                }).then(function(data) {
                    return data;
                })
            }
        }

        function getReady() {
            if (!readyPromise) {
                // Apps often pre-fetch session data ("prime the app")
                // before showing the first view.
                // This app doesn't need priming but we add a
                // no-op implementation to show how it would work.
                logger.info('Primed the app data');
                readyPromise = $q.when(service);
            }
            return readyPromise;
        }

        function ready(promisesArray) {
            return getReady()
                .then(function() {
                    return promisesArray ? $q.all(promisesArray) : readyPromise;
                })
                .catch(exception.catcher('"ready" function failed'));
        }
    }
})();


/**
 * @ngdoc service
 * @name ngTableDataService
 * @description
 *     Application data API.
 */
(function() {
    'use strict';

    angular
        .module('app.tables')
        .factory('xEditableTableDataService', xEditableTableDataService);

    xEditableTableDataService.$inject = ['$http', '$location', '$q', 'exception', 'logger'];

    /**
     * @ngdoc method
     * @name app.tables#xEditableTableDataService
     * @description
     *     Configures the dataservice.
     * @param  {[type]} $http
     * @param  {[type]} $location
     * @param  {[type]} $q
     * @param  {[type]} exception
     * @param  {[type]} logger
     * @return {Object} dataservice service
     */
    /* @ngInject */
    function xEditableTableDataService($http, $location, $q, exception, logger) {
        /* jshint validthis:true */
        var self = this;
        var readyPromise;
        var cache;

        var service = {
            getData: getData,
            ready: ready
        };

        return service;

        //================================================================

        function getData() {

            return $http.get('/api/xeditable-groups')
                .then(getDataComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getxEditableTableData')(message);
                    $location.url('/dashboard');
                });

            function getDataComplete(results, status, headers, config) {
                return results.data;
            }
        }

        function getReady() {
            if (!readyPromise) {
                // Apps often pre-fetch session data ("prime the app")
                // before showing the first view.
                // This app doesn't need priming but we add a
                // no-op implementation to show how it would work.
                logger.info('Primed the app data');
                readyPromise = $q.when(service);
            }
            return readyPromise;
        }

        function ready(promisesArray) {
            return getReady()
                .then(function() {
                    return promisesArray ? $q.all(promisesArray) : readyPromise;
                })
                .catch(exception.catcher('"ready" function failed'));
        }
    }
})();

/**=========================================================
 * Module: datatable,js
 * Datatable component
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.tables')
        .controller('DataTableController', DataTableController);

    DataTableController.$inject = ['$scope', '$q', '$timeout', 'logger'];

    function DataTableController($scope, $q, $timeout, logger) {

        var vm = this;
        vm.title = 'Datatables';

        // Define global instance we'll use to destroy later
        vm.dtInstance1;
        vm.dtInstance2;
        vm.dtInstance3;
        vm.dtInstance4;

        activate();

        function activate() {
            return init().then(function () {
                logger.info('Activated Datatable View');
            });
        }

        /**
         * Construct a few datatables.
         * @returns {*}
         */
        function init() {
            return $timeout(function () {

                if (!$.fn.dataTable) return;

                /**
                 * Zero configuration
                 */
                vm.dtInstance1 = $('#datatable1').dataTable({
                    'paging': true,  // Table pagination
                    'ordering': true,  // Column ordering
                    'info': true,  // Bottom left status text
                    // Text translation options
                    // Note the required keywords between underscores (e.g _MENU_)
                    oLanguage: {
                        sSearch: 'Search all columns:',
                        sLengthMenu: '_MENU_ records per page',
                        info: 'Showing page _PAGE_ of _PAGES_',
                        zeroRecords: 'Nothing found - sorry',
                        infoEmpty: 'No records available',
                        infoFiltered: '(filtered from _MAX_ total records)'
                    }
                });

                /**
                 * Filtering by Columns
                 */
                vm.dtInstance2 = $('#datatable2').dataTable({
                    'paging': true,  // Table pagination
                    'ordering': true,  // Column ordering
                    'info': true,  // Bottom left status text
                    // Text translation options
                    // Note the required keywords between underscores (e.g _MENU_)
                    oLanguage: {
                        sSearch: 'Search all columns:',
                        sLengthMenu: '_MENU_ records per page',
                        info: 'Showing page _PAGE_ of _PAGES_',
                        zeroRecords: 'Nothing found - sorry',
                        infoEmpty: 'No records available',
                        infoFiltered: '(filtered from _MAX_ total records)'
                    }
                });
                var inputSearchClass = 'datatable_input_col_search';
                var columnInputs = $('tfoot .' + inputSearchClass);

                // On input keyup trigger filtering
                columnInputs.keyup(function () {
                    vm.dtInstance2.fnFilter(this.value, columnInputs.index(this));
                });

                /**
                 * Column Visibilty Extension
                 */
                vm.dtInstance3 = $('#datatable3').dataTable({
                    'paging': true,  // Table pagination
                    'ordering': true,  // Column ordering
                    'info': true,  // Bottom left status text
                    // Text translation options
                    // Note the required keywords between underscores (e.g _MENU_)
                    oLanguage: {
                        sSearch: 'Search all columns:',
                        sLengthMenu: '_MENU_ records per page',
                        info: 'Showing page _PAGE_ of _PAGES_',
                        zeroRecords: 'Nothing found - sorry',
                        infoEmpty: 'No records available',
                        infoFiltered: '(filtered from _MAX_ total records)'
                    },
                    // set columns options
                    'aoColumns': [
                        {'bVisible': false},
                        {'bVisible': true},
                        {'bVisible': true},
                        {'bVisible': true},
                        {'bVisible': true}
                    ],
                    sDom: 'C<"clear">lfrtip',
                    colVis: {
                        order: 'alfa',
                        'buttonText': 'Show/Hide Columns'
                    }
                });

                vm.dtInstance4 = $('#datatable4').dataTable({
                    'paging': true,  // Table pagination
                    'ordering': true,  // Column ordering
                    'info': true,  // Bottom left status text
                    sAjaxSource: 'api/datatable',
                    aoColumns: [
                        {mData: 'engine'},
                        {mData: 'browser'},
                        {mData: 'platform'},
                        {mData: 'version'},
                        {mData: 'grade'}
                    ]
                });
            }).then(function () {
                console.log('Init complete');
            })
        }

        // When scope is destroyed we unload all DT instances
        // Also ColVis requires special attention since it attaches
        // elements to body and will not be removed after unload DT
        $scope.$on('$destroy', function () {
            vm.dtInstance1.fnDestroy();
            vm.dtInstance2.fnDestroy();
            vm.dtInstance3.fnDestroy();
            vm.dtInstance4.fnDestroy();
            $('[class*=ColVis]').remove();
        });

    }
})();

/**=========================================================
 * Module: ng-grid.js
 * ngGrid demo
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.tables')
        .controller('NGGridController', NGGridController);

    NGGridController.$inject = ['$scope', '$http', '$timeout', 'logger'];

    function NGGridController($scope, $http, $timeout, logger) {
        // required for inner references
        var vm = this;

        vm.title = "NGTable";
        vm.setPagingData = setPagingData;
        vm.getPagedDataAsync = getPagedDataAsync;

        activate();

        function activate() {
            logger.info('Activated NGGridController View');
            init();
        }


        ////////////////////////

        function setPagingData(data, page, pageSize) {
            // calc for pager
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            // Store data from server
            vm.myData = pagedData;
            // Update server side data length
            vm.totalServerItems = data.length;

            if (!vm.$$phase) {
                vm.$apply();
            }

        };

        // TODO: move to dataservice
        function getPagedDataAsync(pageSize, page, searchText) {
            var ngGridResourcePath = 'server/data/ng-grid-data.json';

            $timeout(function () {

                if (searchText) {
                    var ft = searchText.toLowerCase();
                    $http.get(ngGridResourcePath).success(function (largeLoad) {
                        var data = largeLoad.filter(function (item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });
                        vm.setPagingData(data, page, pageSize);
                    });
                } else {
                    $http.get(ngGridResourcePath).success(function (largeLoad) {
                        vm.setPagingData(largeLoad, page, pageSize);
                    });
                }
            }, 100);
        };

        /**
         * Construct a few ng-tables.
         * @returns {*}
         */
        function init() {

            vm.filterOptions = {
                filterText: "",
                useExternalFilter: true
            };
            vm.totalServerItems = 0;
            vm.pagingOptions = {
                pageSizes: [250, 500, 1000],  // page size options
                pageSize: 250,              // default page size
                currentPage: 1                 // initial page
            };

            vm.gridOptions = {
                data: 'myData',
                enablePaging: true,
                showFooter: true,
                rowHeight: 36,
                headerRowHeight: 38,
                totalServerItems: 'totalServerItems',
                pagingOptions: vm.pagingOptions,
                filterOptions: vm.filterOptions
            };
            $scope.$watch('pagingOptions', function (newVal, oldVal) {
                if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                    vm.getPagedDataAsync(vm.pagingOptions.pageSize, vm.pagingOptions.currentPage, vm.filterOptions.filterText);
                }
            }, true);
            $scope.$watch('filterOptions', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    vm.getPagedDataAsync(vm.pagingOptions.pageSize, vm.pagingOptions.currentPage, vm.filterOptions.filterText);
                }
            }, true);

            vm.getPagedDataAsync(vm.pagingOptions.pageSize, vm.pagingOptions.currentPage);
        }

    }
})();

/**=========================================================
 * Module: NGTableCtrl.js
 * Controller for ngTables
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.tables')
        .controller('NGTableCtrl', NGTableCtrl);

    NGTableCtrl.$inject = ['$filter', 'ngTableParams', '$resource', '$timeout', 'ngTableDataService', 'logger'];

    function NGTableCtrl($filter, ngTableParams, $resource, $timeout, ngTableDataService, logger) {
        // required for inner references
        var vm = this;

        vm.title = "NGTable";

        activate();

        function activate() {
            logger.info('Activated NGTable View');
            init();
        }

        /**
         * Construct a few ng-tables.
         * @returns {*}
         */
        function init() {

            var data = [
                {name: "Moroni", age: 50, money: -10},
                {name: "Tiancum", age: 43, money: 120},
                {name: "Jacob", age: 27, money: 5.5},
                {name: "Nephi", age: 29, money: -54},
                {name: "Enos", age: 34, money: 110},
                {name: "Tiancum", age: 43, money: 1000},
                {name: "Jacob", age: 27, money: -201},
                {name: "Nephi", age: 29, money: 100},
                {name: "Enos", age: 34, money: -52.5},
                {name: "Tiancum", age: 43, money: 52.1},
                {name: "Jacob", age: 27, money: 110},
                {name: "Nephi", age: 29, money: -55},
                {name: "Enos", age: 34, money: 551},
                {name: "Tiancum", age: 43, money: -1410},
                {name: "Jacob", age: 27, money: 410},
                {name: "Nephi", age: 29, money: 100},
                {name: "Enos", age: 34, money: -100}
            ];

            // SELECT ROWS
            // -----------------------------------

            vm.data = data;

            vm.tableParams3 = new ngTableParams({
                page: 1,            // show first page
                count: 10          // count per page
            }, {
                total: data.length, // length of data
                getData: function ($defer, params) {
                    // use build-in angular filter
                    var filteredData = params.filter() ?
                        $filter('filter')(data, params.filter()) :
                        data;
                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        data;

                    params.total(orderedData.length); // set total for recalc pagination
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

            vm.changeSelection = function (user) {
                // console.info(user);
            };

            // EXPORT CSV
            // -----------------------------------

            var data4 = [{name: "Moroni", age: 50},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34}];

            vm.tableParams4 = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: data4.length, // length of data4
                getData: function ($defer, params) {
                    $defer.resolve(data4.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });


            // SORTING
            // -----------------------------------


            vm.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    name: 'asc'     // initial sorting
                }
            }, {
                total: data.length, // length of data
                getData: function ($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                        $filter('orderBy')(data, params.orderBy()) :
                        data;

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

            // FILTERS
            // -----------------------------------

            vm.tableParams2 = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                filter: {
                    name: '',
                    age: ''
                    // name: 'M'       // initial filter
                }
            }, {
                total: data.length, // length of data
                getData: function ($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.filter() ?
                        $filter('filter')(data, params.filter()) : data;

                    vm.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); // set total for recalc pagination
                    $defer.resolve(vm.users);
                }
            });

            vm.tableParams5 = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: 0,           // length of data
                counts: [],         // hide page counts control
                getData: function ($defer, params) {

                    // Service using cache to avoid mutiple requests
                    return ngTableDataService.getData(params).then(function (data) {
                        return data;
                    });

                    /* direct ajax request to api (perform result pagination on the server)
                     Api.get(params.url(), function(data) {
                     $timeout(function() {
                     // update table params
                     params.total(data.total);
                     // set new data
                     $defer.resolve(data.result);
                     }, 500);
                     });
                     */
                }
            });
        }
    }
})();

/**=========================================================
 * Module: app.tables
 * Provides a demo for xeditable tables
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.tables')
        .controller('TablexEditableController', TablexEditableController);

    TablexEditableController.$inject = ['$filter', '$q', 'logger', 'xEditableTableDataService'];

    function TablexEditableController($filter, $q, logger, xEditableTableDataService) {
        // required for inner references
        var vm = this;

        vm.title = "TablexEditable";
        vm.loadGroups = loadGroups;
        vm.showGroup = showGroup;
        vm.showStatus = showStatus;
        vm.checkName = checkName;
        vm.saveUser = saveUser;
        vm.removeUser = removeUser;
        vm.addUser = addUser;
        vm.saveColumn = saveColumn;
        vm.filterUser = filterUser;
        vm.deleteUser = deleteUser;
        vm.cancel = cancel;
        vm.saveTable = saveTable;

        activate();

        function activate() {
            logger.info('Activated TablexEditableController View');
            init();
        }

        /**
         * Construct a few datatables.
         * @returns {*}
         */
        function init() {
            // editable row
            // -----------------------------------
            vm.users = [
                {id: 1, name: 'awesome user1', status: 2, group: 4, groupName: 'admin'},
                {id: 2, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
                {id: 3, name: 'awesome user3', status: 2, group: null}
            ];

            vm.statuses = [
                {value: 1, text: 'status1'},
                {value: 2, text: 'status2'},
                {value: 3, text: 'status3'},
                {value: 4, text: 'status4'}
            ];

            vm.groups = [];
        }

        function loadGroups() {
            return vm.groups.length ? null :
                xEditableTableDataService.getData().then(function (data) {
                    vm.groups = data;
                });
        }

        function showGroup(user) {
            if (user.group && vm.groups.length) {
                var selected = $filter('filter')(vm.groups, {id: user.group});
                return selected.length ? selected[0].text : 'Not set';
            } else {
                return user.groupName || 'Not set';
            }
        }

        function showStatus(user) {
            var selected = [];
            if (user.status) {
                selected = $filter('filter')(vm.statuses, {value: user.status});
            }
            return selected.length ? selected[0].text : 'Not set';
        }

        function checkName(data, id) {
            if (id === 2 && data !== 'awesome') {
                return "Username 2 should be `awesome`";
            }
        }

        function saveUser(data, id) {
            //$scope.user not updated yet
            angular.extend(data, {id: id});
            logger.info('Saving user: ' + id);
            // return $http.post('/saveUser', data);
        }

        // remove user
        function removeUser(index) {
            vm.users.splice(index, 1);
        }

        // add user
        function addUser() {
            vm.inserted = {
                id: vm.users.length + 1,
                name: '',
                status: null,
                group: null,
                isNew: true
            };
            vm.users.push(vm.inserted);
        }

        // editable column
        // -----------------------------------


        function saveColumn(column) {
            var results = [];
            angular.forEach(vm.users, function (user) {
                // results.push($http.post('/saveColumn', {column: column, value: user[column], id: user.id}));
                logger.info('Saving column: ' + column);
            });
            return $q.all(results);
        }

        // editable table
        // -----------------------------------

        // filter users to show
        function filterUser(user) {
            return user.isDeleted !== true;
        }

        // mark user as deleted
        function deleteUser(id) {
            var filtered = $filter('filter')(vm.users, {id: id});
            if (filtered.length) {
                filtered[0].isDeleted = true;
            }
        }

        // cancel all changes
        function cancel() {
            for (var i = vm.users.length; i--;) {
                var user = vm.users[i];
                // undelete
                if (user.isDeleted) {
                    delete user.isDeleted;
                }
                // remove new
                if (user.isNew) {
                    vm.users.splice(i, 1);
                }
            }
        }

        // save edits
        function saveTable() {
            var results = [];
            for (var i = vm.users.length; i--;) {
                var user = vm.users[i];
                // actually delete user
                if (user.isDeleted) {
                    vm.users.splice(i, 1);
                }
                // mark as not new
                if (user.isNew) {
                    user.isNew = false;
                }

                // send on server
                // results.push($http.post('/saveUser', user));
                logger.info('Saving Table...');
            }

            return $q.all(results);
        }
    }
})();

(function() {
    'use strict';

    angular.module('app.sidebar', []);
})();

/**=========================================================
 * Module: sidebar-menu.js
 * Handle sidebar collapsible elements
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.sidebar')
        .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$rootScope', '$scope', '$state', '$http', '$timeout', 'Utils'];


    function SidebarController($rootScope, $scope, $state, $http, $timeout, Utils) {

        var collapseList = [];

        // demo: when switch from collapse to hover, close all items
        $rootScope.$watch('app.layout.asideHover', function (oldVal, newVal) {
            if (newVal === false && oldVal === true) {
                closeAllBut(-1);
            }
        });

        // Check item and children active state
        var isActive = function (item) {

            if (!item) return;

            if (!item.sref || item.sref == '#') {
                var foundActive = false;
                angular.forEach(item.submenu, function (value, key) {
                    if (isActive(value)) foundActive = true;
                });
                return foundActive;
            }
            else
                return $state.is(item.sref) || $state.includes(item.sref);
        };

        // Load menu from json file
        // -----------------------------------

        $scope.getMenuItemPropClasses = function (item) {
            return (item.heading ? 'nav-heading' : '') +
                (isActive(item) ? ' active' : '');
        };

        // TODO: move to dataservice
        $scope.loadSidebarMenu = function () {

            var menuJson = 'api/sidebar',
                menuURL = menuJson; // + '?v=' + (new Date().getTime()); // jumps cache

            // TODO: move to dataservice
            $http.get(menuURL)
                .success(function (items) {
                    $scope.menuItems = items;
                })
                .error(function (data, status, headers, config) {
                    alert('Failure loading menu');
                });
        };

        $scope.loadSidebarMenu();

        // Handle sidebar collapse items
        // -----------------------------------

        $scope.addCollapse = function ($index, item) {
            collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
        };

        $scope.isCollapse = function ($index) {
            return (collapseList[$index]);
        };

        $scope.toggleCollapse = function ($index, isParentItem) {

            // collapsed sidebar doesn't toggle drodopwn
            if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) return true;

            // make sure the item index exists
            if (angular.isDefined(collapseList[$index])) {
                if (!$scope.lastEventFromChild) {
                    collapseList[$index] = !collapseList[$index];
                    closeAllBut($index);
                }
            } else if (isParentItem) {
                closeAllBut(-1);
            }

            $scope.lastEventFromChild = isChild($index);

            return true;
        };

        function closeAllBut(index) {
            index += '';
            for (var i in collapseList) {
                if (index < 0 || index.indexOf(i) < 0)
                    collapseList[i] = true;
            }
        }

        function isChild($index) {
            return (typeof $index === 'string') && !($index.indexOf('-') < 0);
        }

    }
})();

(function () {
    'use strict';

    angular
        .module('app.sidebar')
        .controller('UserBlockController', UserBlockController);

    UserBlockController.$inject = ['$scope'];

    function UserBlockController($scope) {
        $scope.userBlockVisible = true;
        $scope.$on('toggleUserBlock', function (event, args) {
            $scope.userBlockVisible = !$scope.userBlockVisible;
        });
    }
})();
(function() {
    'use strict';

    angular.module('app.documentation', []);
})();

(function() {
    'use strict';

    angular
        .module('app.documentation')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());

        function getStates() {
            return [
                {
                    state: 'app.documentation',
                    config: {
                        url: '/documentation',
                        title: 'Documentation',
                        templateUrl: 'app/modules/documentation/views/documentation.html',
                        resolve: routerHelper.resolveFor('flatdoc')
                    }
                }
            ];
        }
    }
})();
