
/**
 * @ngdoc module
 * @name app
 * @description
 *   Defines the AngularJs application module and initializes sub-modules
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
    'app.tables',
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
            };

            $rootScope.user = {
                name: 'Jeremy',
                job: 'ng-Dev',
                picture: 'ui/img/dummy.png'
            }
        }
    }

})();


/**
 * @ngdoc module
 * @name app.core
 * @description
 *   Defines the core AngularJs application module and initializes sub-modules
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
        'blocks.auth',

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

(function() {
    'use strict';

    angular.module('blocks.auth', [
        'LocalStorageModule',
        'ui.router'
    ]);

})();


(function() {
    'use strict';

    angular
        .module('blocks.auth')
        .provider('Principal', Principal);


    function Principal() {

        /**
         * @name Principal#options
         * @type {Object}
         * @propertyOf blocks.auth#Principal
         */
        var opts = {};

        /**
         * @ngdoc function
         * @methodOf Principal
         * @name Principal#configure
         * @param  {String} cfg the config options
         * @description
         * Public provider configuration function.
         * Use within a angular.config block.
         */
        this.configure = function(cfg) {
            if (typeof cfg !== 'object') {
                throw new Error('Principal: configure expects an object');
            }
            opts = angular.extend(opts, cfg);
        };

        var identity, authenticated = false;

        /**
         * Inject services used within your service here
         */
        /* @ngInject */
        this.$get = function principle($q, $http, $rootScope) {

            var service = {
                isIdentityResolved: isIdentityResolved,
                isAuthenticated: isAuthenticated,
                isInRole: isInRole,
                isInAnyRole: isInAnyRole,
                authenticate: authenticate,
                identity: identity
            };

            return service;

            ////////////////////////////////////////////////////////

            function isIdentityResolved() {
                return angular.isDefined(identity);
            }

            function isAuthenticated() {
                return authenticated;
            }

            function isInRole(role) {
                if (!authenticated || !identity.roles) {
                    return false;
                }
                return identity.roles.indexOf(role) !== -1;
            }

            function isInAnyRole(roles) {
                if (!authenticated || !identity.roles) {
                    return false;
                }
                for (var i = 0; i < roles.length; i++) {
                    if (this.isInRole(roles[i])) {
                        return true;
                    }
                }
                return false;
            }

            function authenticate(identity) {
                identity = identity;
                authenticated = identity !== null;
            }

            function identity(force) {
                //var deferred = $q.defer();
                //if (force === true) {
                //    identity = undefined;
                //}
                //
                //// check and see if we have retrieved the identity data from the server.
                //// if we have, reuse it by immediately resolving
                //if (angular.isDefined(identity)) {
                //    deferred.resolve(identity);
                //    return deferred.promise;
                //}

                return $http.get('ui/user').success(function (account) {
                    if (account) {
                        identity = account;
                        $rootScope.account = account;
                        authenticated = true;
                    } else {
                        identity = null;
                        authenticated = false;
                    }
                }).error(function () {
                    identity = null;
                    authenticated = false;
                });
            }
        }
    }

})();


/**
 * @ngdoc service
 * @name Auth
 * @description
 *     Authentication service
 */

(function() {
    'use strict';

    angular
        .module('blocks.auth')
        .factory('Auth', Auth);

    function Auth($rootScope, $state, Principal, AuthServerProvider) {

        var service = {
            logout: logout,
            authorize: authorize
        };

        return service;

        /////////////////////////////////////////////////////////////

        function logout() {
            AuthServerProvider.logout();
            Principal.authenticate(null);
        }

        function authorize() {
            return Principal
                .identity()
                .then(gotPrinciple);

            function gotPrinciple() {
                var isAuthenticated = Principal.isAuthenticated();

                //if ($rootScope.toState.data.roles &&
                //    $rootScope.toState.data.roles.length > 0 &&
                //    !Principal.isInAnyRole($rootScope.toState.data.roles)) {
                //
                //    if (isAuthenticated) {
                //        // user is signed in but not authorized for desired state
                //        $state.go('accessdenied');
                //    } else {
                //        // user is not authenticated. stow the state they wanted before you
                //        // send them to the login, so you can return them when you're done
                //        $rootScope.returnToState = $rootScope.toState;
                //        $rootScope.returnToStateParams = $rootScope.toStateParams;
                //
                //        // now, send them to the login page so they can log in
                //        $state.go('login');
                //    }
                //}
            }
        }
    }
})();


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
            return 'ui/views/' + uri;
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
                return 'ui/views/' + uri;
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
 * @description
 *   Defines the AngularJs application constants
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
                'whirl': ['ui/vendor/whirl/dist/whirl.css'],
                'classyloader': ['ui/vendor/jquery-classyloader/js/jquery.classyloader.min.js'],
                'animo': ['ui/vendor/animo.js/animo.js'],
                'fastclick': ['ui/vendor/fastclick/lib/fastclick.js'],
                'modernizr': ['ui/vendor/modernizr/modernizr.js'],
                'animate': ['ui/vendor/animate.css/animate.min.css'],
                'icons': [
                    'ui/vendor/fontawesome/css/font-awesome.min.css',
                    'ui/vendor/simple-line-icons/css/simple-line-icons.css'
                ],
                'sparklines': ['ui/vendor/sparklines/jquery.sparkline.min.js'],
                'slider': [
                    'ui/vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
                    'ui/vendor/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css'
                ],
                'wysiwyg': ['ui/vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                    'ui/vendor/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
                'slimscroll': ['ui/vendor/slimScroll/jquery.slimscroll.min.js'],
                'screenfull': ['ui/vendor/screenfull/dist/screenfull.js'],
                'vector-map': [
                    'ui/vendor/ika.jvectormap/jquery-jvectormap-2.0.2.min.js',
                    'ui/vendor/ika.jvectormap/jquery-jvectormap-2.0.2.css'
                ],
                'loadGoogleMapsJS': ['ui/vendor/gmap/load-google-maps.js'],
                'google-map': ['ui/vendor/jQuery-gMap/jquery.gmap.min.js'],
                'flot-chart': ['ui/vendor/Flot/jquery.flot.js'],
                'flot-chart-plugins': [
                    'ui/vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
                    'ui/vendor/Flot/jquery.flot.resize.js',
                    'ui/vendor/Flot/jquery.flot.pie.js',
                    'ui/vendor/Flot/jquery.flot.time.js',
                    'ui/vendor/Flot/jquery.flot.categories.js',
                    'ui/vendor/flot-spline/js/jquery.flot.spline.min.js'],
                // jquery core and widgets
                'jquery-ui': [
                    'ui/vendor/jquery-ui/ui/core.js',
                    'ui/vendor/jquery-ui/ui/widget.js'],
                // loads only jquery required modules and touch support
                'jquery-ui-widgets': [
                    'ui/vendor/jquery-ui/ui/core.js',
                    'ui/vendor/jquery-ui/ui/widget.js',
                    'ui/vendor/jquery-ui/ui/mouse.js',
                    'ui/vendor/jquery-ui/ui/draggable.js',
                    'ui/vendor/jquery-ui/ui/droppable.js',
                    'ui/vendor/jquery-ui/ui/sortable.js',
                    'ui/vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'
                ],
                'moment': ['ui/vendor/moment/min/moment-with-locales.min.js'],
                'inputmask': ['ui/vendor/jquery.inputmask/dist/jquery.inputmask.bundle.min.js'],
                'flatdoc': ['ui/vendor/flatdoc/flatdoc.js'],
                'codemirror': [
                    'ui/vendor/codemirror/lib/codemirror.js',
                    'ui/vendor/codemirror/lib/codemirror.css'
                ],
                // modes for common web files
                'codemirror-modes-web': [
                    'ui/vendor/codemirror/mode/javascript/javascript.js',
                    'ui/vendor/codemirror/mode/xml/xml.js',
                    'ui/vendor/codemirror/mode/htmlmixed/htmlmixed.js',
                    'ui/vendor/codemirror/mode/css/css.js'
                ],
                'taginput': [
                    'ui/vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
                    'ui/vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js'
                ],
                'filestyle': ['ui/vendor/bootstrap-filestyle/src/bootstrap-filestyle.js'],
                'parsley': ['ui/vendor/parsleyjs/dist/parsley.min.js'],
                'datatables': [
                    'ui/vendor/datatables/media/js/jquery.dataTables.min.js',
                    'ui/vendor/datatable-bootstrap/css/dataTables.bootstrap.css'
                ],
                'datatables-plugins': [
                    'ui/vendor/datatable-bootstrap/js/dataTables.bootstrap.js',
                    'ui/vendor/datatable-bootstrap/js/dataTables.bootstrapPagination.js',
                    'ui/vendor/datatables-colvis/js/dataTables.colVis.js',
                    'ui/vendor/datatables-colvis/css/dataTables.colVis.css'],
                'fullcalendar': [
                    'ui/vendor/fullcalendar/dist/fullcalendar.min.js',
                    'ui/vendor/fullcalendar/dist/fullcalendar.css'
                ],
                'gcal': ['ui/vendor/fullcalendar/dist/gcal.js'],
                'nestable': ['ui/vendor/nestable/jquery.nestable.js'],
                'chartjs': ['ui/vendor/Chart.js/Chart.js']
            },
            // Angular based script (use the right module name)
            modules: [
                {
                    name: 'toaster',
                    files: [
                        'ui/vendor/angularjs-toaster/toaster.js',
                        'ui/vendor/angularjs-toaster/toaster.css'
                    ]
                },
                {
                    name: 'localytics.directives',
                    files: [
                        'ui/vendor/chosen_v1.2.0/chosen.jquery.min.js',
                        'ui/vendor/chosen_v1.2.0/chosen.min.css',
                        'ui/vendor/angular-chosen-localytics/chosen.js'
                    ]
                },
                {
                    name: 'ngDialog',
                    files: [
                        'ui/vendor/ngDialog/js/ngDialog.min.js',
                        'ui/vendor/ngDialog/css/ngDialog.min.css',
                        'ui/vendor/ngDialog/css/ngDialog-theme-default.min.css'
                    ]
                },
                {
                    name: 'ngWig',
                    files: ['ui/vendor/ngWig/dist/ng-wig.min.js']},
                {
                    name: 'ngTable',
                    files: [
                        'ui/vendor/ng-table/dist/ng-table.min.js',
                        'ui/vendor/ng-table/dist/ng-table.min.css'
                    ]
                },
                {
                    name: 'ngTableExport',
                    files: ['ui/vendor/ng-table-export/ng-table-export.js']
                },
                {
                    name: 'angularBootstrapNavTree',
                    files: [
                        'ui/vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                        'ui/vendor/angular-bootstrap-nav-tree/dist/abn_tree.css'
                    ]
                },
                {
                    name: 'htmlSortable',
                    files: [
                        'ui/vendor/html.sortable/dist/html.sortable.js',
                        'ui/vendor/html.sortable/dist/html.sortable.angular.js'
                    ]
                },
                {
                    name: 'xeditable',
                    files: [
                        'ui/vendor/angular-xeditable/dist/js/xeditable.js',
                        'ui/vendor/angular-xeditable/dist/css/xeditable.css'
                    ]
                },
                {
                    name: 'angularFileUpload',
                    files: ['ui/vendor/angular-file-upload/angular-file-upload.js']
                },
                {
                    name: 'ngImgCrop',
                    files: [
                        'ui/vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
                        'ui/vendor/ng-img-crop/compile/unminified/ng-img-crop.css'
                    ]
                },
                {
                    name: 'ui.select',
                    files: [
                        'ui/vendor/angular-ui-select/dist/select.js',
                        'ui/vendor/angular-ui-select/dist/select.css'
                    ]
                },
                {
                    name: 'ui.codemirror',
                    files: ['ui/vendor/angular-ui-codemirror/ui-codemirror.js']},
                {
                    name: 'angular-carousel',
                    files: [
                        'ui/vendor/angular-carousel/dist/angular-carousel.css',
                        'ui/vendor/angular-carousel/dist/angular-carousel.js'
                    ]
                },
                {
                    name: 'ngGrid',
                    files: [
                        'ui/vendor/ng-grid/build/ng-grid.min.js',
                        'ui/vendor/ng-grid/ng-grid.css'
                    ]
                },
                {
                    name: 'infinite-scroll',
                    files: ['ui/vendor/ngInfiniteScroll/build/ng-infinite-scroll.js']
                }
            ]
        })

        // Dashboard controller state that survives the controller's routine creation and destruction.
        // Saves a network trip when simply toggling among the views.
        // - dashboardFilterText: the most recent filtering search text
        // - selectedTodoId: the id of the most recently selected todo
        // - commentHeaders: a "headers" projection of the comments of the selectedTodo
        .value( 'todo.state', {});
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

    configure.$inject = ['$locationProvider', '$urlRouterProvider', 'routerHelperProvider', '$httpProvider'];

    function configure($locationProvider, $urlRouterProvider, routerHelperProvider, $httpProvider) {

        // Set the following to true to send cookies with each request
        $httpProvider.defaults.withCredentials = true;

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
                    templateUrl: 'ui/pages/page.html',
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
                    templateUrl: 'ui/pages/recover.html'
                }
            },
            {
                state: 'page.lock',
                config: {
                    url: '/lock',
                    title: "Lock",
                    templateUrl: 'ui/pages/lock.html'
                }
            },
            {
                state: 'page.404',
                config: {
                    url: '/404',
                    title: "Not Found",
                    templateUrl: 'ui/pages/404.html'
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
            prefix: 'ui/i18n/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useLocalStorage();
        $translateProvider.usePostCompiling(true);
    }


    dynamicLocale.$inject = ['tmhDynamicLocaleProvider'];

    function dynamicLocale(tmhDynamicLocaleProvider) {
        tmhDynamicLocaleProvider.localeLocationPattern('ui/vendor/angular-i18n/angular-locale_{{locale}}.js');
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
                        templateUrl: 'app/modules/dashboard/views/dashboard.html'
                    }
                },
                {
                    state: 'app.dashboard.list',
                    config: {
                        url: '/dashboard/list',
                        title: 'Dashboard',
                        templateUrl: 'app/modules/dashboard/views/dashboard-list.html'
                    }
                },
                {
                    state: 'app.dashboard.add',
                    config: {
                        url: '/dashboard/add',
                        title: 'Dashboard',
                        templateUrl: 'app/modules/dashboard/views/dashboard-add.html'
                    }
                },
                {
                    state: 'app.dashboard.edit',
                    config: {
                        url: '/dashboard/edit',
                        title: 'Dashboard',
                        templateUrl: 'app/modules/dashboard/views/dashboard-edit.html'
                    }
                },
                {
                    state: 'app-h.dashboard_v2',
                    config: {
                        url: '/dashboard_v2',
                        title: 'Dashboard v2',
                        templateUrl: 'app/modules/dashboard/views/dashboard.html',
                        controller: function ($rootScope, $scope) {
                            $rootScope.app.layout.horizontal = true;
                            $scope.$on('$destroy', function () {
                                $rootScope.app.layout.horizontal = false;
                            });
                        }
                    }
                }
            ];
        }
    }
})();


/**
 * @ngdoc service
 * @name dashboardDataService
 * @description
 *     Dashboard data API.
 */
(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .factory('dashboardDataService', dashboardDataService);

    dashboardDataService.$inject = ['$http', '$location', '$q', 'exception', 'logger', '$timeout'];

    /**
     * @ngdoc method
     * @name app.dashboard#dashboardDataServiceDataService
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
    function dashboardDataService($http, $location, $q, exception, logger, $timeout) {
        /* jshint validthis:true */

        var self = this;
        var readyPromise;
        var isPrimed = false;
        var primePromise;
        var cache;

        var service = {
            getUser: getUser,
            getSession: getSession,
            getData: getData,
            getTodo: getTodo,
            saveTodo: saveTodo,
            deleteTodo: deleteTodo,
            ready: ready
        };

        return service;

        //================================================================

        // get user
        function getUser() {
            logger.info('Retrieving user');
            return $http.get('/user');  // ui server!
        }

        // get user
        function getSession() {
            logger.info('Retrieving user session');
            return $http.get('/resource/'); // resource server!
        }

        function getData(params) {

            return $http.get('/resource/todos')
                    .then(getDataComplete)
                    .catch(function(message) {
                        exception.catcher('XHR Failed for getDashboardData')(message);
                        $location.url('/dashboard');
                    });

            function getDataComplete(results, status, headers, config) {
                //return filterdata(params);
                return results.data;
            }

            /**
             * Pagination for dashboard table
             *
             * @param params
             * @returns {*}
             */
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
                logger.info('Primed the dashboard data');
                readyPromise = $q.when(service);
            }
            return readyPromise;
        }

        function saveTodo(data, id) {
            //$scope.user not updated yet
            angular.extend(data, {id: id});
            logger.info('Saving todo: ' + id);
            return $http.post('/resource/rest/todo', data);
        }

        // remove list item
        function getTodo(id) {
            logger.info('Retrieving todo: ' + id);
            return $http.get('/resource/rest/todo', data);
        }

        // remove list item
        function deleteTodo(id) {
            logger.info('Deleting todo: ' + id);
            return $http.delete('/resource/rest/todo', data);
        }

        function ready(promisesArray) {
            return getReady()
                .then(function () {
                    return promisesArray ? $q.all(promisesArray) : readyPromise;
                })
                .catch(exception.catcher('"ready" function failed'));
        }
    }
})();


/**=========================================================
 * Module: app.dashboard
 *     Provides a demo for dashboard tables
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$rootScope', '$location', '$filter', '$q', 'logger', 'dashboardDataService', '$state', 'todo.state', 'Principal'];

    function DashboardController($rootScope, $location, $filter, $q, logger, dashboardDataService, $state, todoState, Principal) {
        // required for inner references
        var vm = this;

        vm.authenticated = false;
        vm.isLoadingTodos = false;
        vm.session = '';
        vm.user = '';
        vm.title = "Developer Todo list";
        vm.loadTodos = loadTodos;
        vm.saveTodo = saveTodo;
        vm.getTodo = getTodo;
        vm.edit = edit;
        vm.deleteTodo = deleteTodo;
        vm.toggleTodo = toggleTodo;
        vm.selectedTodo = null;

        vm.todos = [];
        vm.todo = {};

        vm.cancel = cancel;
        vm.select = select;

        activate();

        function activate() {
            var promises = [loadTodos(), loadPrincipal()];
            return $q.all(promises).then(function() {
                logger.info('Activated Dashboard View');
            });
        }

        function loadPrincipal() {
            return Principal.identity();
        }

        // Keep 'vm.selectedTodoId' in a 'todoState' ngValue object
        // where it survives creation and destruction of this controller
        function select(todo) {
            if (vm.selectedTodo === todo ) { return; }  // no change
            vm.selectedTodo = todo;
            var id = todo && todo.id;
            if (id && id !== todoState.selectedTodoId) {
                todoState.selectedTodoId = id;
            }
        }

        function edit(todo) {
            $state.go('app.menu', {productType : $stateParams.productType});
            $state.go('app.dashboard.edit', {todoId : $stateParams.productType});
        }

        function toggleTodo(todo) {
            //logger.info('Toggled Todo ' + todo.id);
            //todo.$update(function () {
            //    $location.path('/list');
            //});
        }

        function loadTodos() {
            vm.isLoadingTodos = true;

            return dashboardDataService.getData()
                .then(gotTodos)
                .finally(function() { vm.isLoadingTodos = false; });

            function gotTodos(todos) {
                vm.todos = todos;
                var id = todoState.selectedTodoId;
                if (id) {
                    var todo = todos.filter(function(c) { return c.id === id })[0];
                    select(todo);
                }
            }
        }

        function isSelected(todo) {
            return vm.selectedTodo === todo;
        }

        function saveTodo(todo) {
            logger.info('Saving todo');
            dashboardDataService.saveTodo(todo).then(function(data) {
                $location.path('/dashboard'); // redirecto to list
            });
        }

        function getTodo(id) {
            dashboardDataService.getTodo(id).then(function(data) {
                vm.todo = data;
            });
        }

        // deleted item
        function deleteTodo(id) {
            dashboardDataService.deleteTodo(id);
        }

        // cancel all changes
        function cancel() {
            return vm.selectedTodo = null;
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
                return $http.get('/resource/todos')
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
        vm.loadTodos = loadGroups;
        vm.showGroup = showGroup;
        vm.showStatus = showStatus;
        vm.checkName = checkName;
        vm.saveTodo = saveUser;
        vm.removeTodo = removeUser;
        vm.addTodo = addUser;
        vm.saveColumn = saveColumn;
        vm.filterUser = filterUser;
        vm.deleteTodo = deleteUser;
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

            vm.todos = [];
        }

        function loadGroups() {
            return vm.todos.length ? null :
                xEditableTableDataService.getData().then(function (data) {
                    vm.todos = data;
                });
        }

        function showGroup(user) {
            if (user.group && vm.todos.length) {
                var selected = $filter('filter')(vm.todos, {id: user.group});
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

            var menuJson = 'ui/sidebar',
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
