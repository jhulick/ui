// Karma configuration

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',

        // frameworks to use
        // some available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai', 'sinon', 'chai-sinon'],

        // list of files / patterns to load in the browser
        files: [
            './src/client/tests/lib/bindPolyfill.js',

            './node_modules/ng-midway-tester/src/ngMidwayTester.js',

            "./bower_components/jquery/dist/jquery.js",
            "./bower_components/angular/angular.js",
            "./bower_components/angular-route/angular-route.js",
            "./bower_components/angular-cookies/angular-cookies.js",
            "./bower_components/angular-animate/angular-animate.js",
            "./bower_components/angular-aria/angular-aria.js",
            "./bower_components/angular-material/angular-material.js",
            "./bower_components/angular-touch/angular-touch.js",
            "./bower_components/angular-ui-router/release/angular-ui-router.js",
            "./bower_components/ngstorage/ngStorage.js",
            "./bower_components/angular-ui-utils/ui-utils.js",
            "./bower_components/angular-sanitize/angular-sanitize.js",
            "./bower_components/angular-resource/angular-resource.js",
            "./bower_components/angular-translate/angular-translate.js",
            "./bower_components/angular-translate-loader-url/angular-translate-loader-url.js",
            "./bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
            "./bower_components/angular-translate-storage-local/angular-translate-storage-local.js",
            "./bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js",
            "./bower_components/oclazyload/dist/ocLazyLoad.js",
            "./bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
            "./bower_components/angular-loading-bar/build/loading-bar.js",
            "./bower_components/angular-dynamic-locale/dist/tmhDynamicLocale.js",
            "./bower_components/toastr/toastr.js",
            "./bower_components/diff_match_patch/javascript/diff_match_patch.js",
            "./bower_components/angular-diff-match-patch/angular-diff-match-patch.js",
            "./bower_components/ng-idle/angular-idle.js",

            './bower_components/angular-mocks/angular-mocks.js',
            './bower_components/bardjs/dist/bard.js',

            "./bower_components/datatables/media/js/jquery.dataTables.min.js",
            "./bower_components/datatables-colvis/js/dataTables.colVis.js",
            "./bower_components/datatables-colvis/css/dataTables.colVis.css",
            "./bower_components/parsleyjs/dist/parsley.min.js",
            "./bower_components/bootstrap-filestyle/src/bootstrap-filestyle.js",
            "./bower_components/ngWig/dist/ng-wig.min.js",
            "./bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.css",
            "./bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js",
            "./bower_components/marked/lib/marked.js",
            //"./bower_components/codemirror/lib/codemirror.js",
            //"./bower_components/codemirror/lib/codemirror.css",
            //"./bower_components/codemirror/addon/mode/overlay.js",
            //"./bower_components/codemirror/mode/**/*",
            //"./bower_components/codemirror/theme/*",
            //"./bower_components/angular-ui-codemirror/ui-codemirror.js",
            "./bower_components/ngDialog/js/ngDialog.min.js",
            "./bower_components/ngDialog/css/ngDialog.min.css",
            "./bower_components/ngDialog/css/ngDialog-theme-default.min.css",
            "./bower_components/jQuery-gMap/jquery.gmap.min.js",
            "./bower_components/whirl/dist/whirl.css",
            "./bower_components/jquery-classyloader/js/jquery.classyloader.min.js",
            "./bower_components/animo.js/animo.js",
            "./bower_components/modernizr/modernizr.js",
            "./bower_components/fastclick/lib/fastclick.js",
            "./bower_components/fontawesome/css/font-awesome.min.css",
            //"./bower_components/fontawesome/fonts/*",
            "./bower_components/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js",
            "./bower_components/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css",
            "./bower_components/bootstrap-wysiwyg/bootstrap-wysiwyg.js",
            "./bower_components/bootstrap-wysiwyg/external/jquery.hotkeys.js",
            "./bower_components/slimScroll/jquery.slimscroll.min.js",
            "./bower_components/screenfull/dist/screenfull.js",
            "./bower_components/ika.jvectormap/jquery-jvectormap-1.2.2.min.js",
            "./bower_components/ika.jvectormap/jquery-jvectormap-world-mill-en.js",
            "./bower_components/ika.jvectormap/jquery-jvectormap-us-mill-en.js",
            "./bower_components/ika.jvectormap/jquery-jvectormap-1.2.2.css",
            "./bower_components/Flot/jquery.flot.js",
            "./bower_components/flot.tooltip/js/jquery.flot.tooltip.min.js",
            "./bower_components/Flot/jquery.flot.resize.js",
            "./bower_components/Flot/jquery.flot.pie.js",
            "./bower_components/Flot/jquery.flot.time.js",
            "./bower_components/Flot/jquery.flot.categories.js",
            "./bower_components/flot-spline/js/jquery.flot.spline.min.js",
            "./bower_components/jquery-ui/jquery-ui.min.js",
            "./bower_components/jquery-ui/ui/*.js",
            "./bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min.js",
            "./bower_components/moment/min/moment-with-locales.min.js",
            "./bower_components/jquery.inputmask/dist/jquery.inputmask.bundle.min.js",
            "./bower_components/flatdoc/flatdoc.js",
            "./bower_components/angularjs-toaster/toaster.js",
            //"./bower_components/angularjs-toaster/toaster.css",
            "./bower_components/chosen_v1.2.0/chosen.jquery.min.js",
            //"./bower_components/chosen_v1.2.0/chosen.min.css",
            "./bower_components/angular-chosen-localytics/chosen.js",
            "./bower_components/fullcalendar/dist/fullcalendar.min.js",
            //"./bower_components/fullcalendar/dist/fullcalendar.css",
            "./bower_components/fullcalendar/dist/gcal.js",
            //"./bower_components/animate.css/animate.min.css",
            "./bower_components/ng-table/dist/ng-table.min.js",
            "./bower_components/ng-table/dist/ng-table.min.css",
            "./bower_components/ng-table-export/ng-table-export.js",
            //"./bower_components/simple-line-icons/css/simple-line-icons.css",
            //"./bower_components/simple-line-icons/fonts/*",
            "./bower_components/angular-bootstrap-nav-tree/dist/abn_tree_directive.js",
            //"./bower_components/angular-bootstrap-nav-tree/dist/abn_tree.css",
            "./bower_components/html.sortable/dist/html.sortable.js",
            "./bower_components/html.sortable/dist/html.sortable.angular.js",
            "./bower_components/nestable/jquery.nestable.js",
            "./bower_components/angular-xeditable/dist/js/xeditable.js",
            //"./bower_components/angular-xeditable/dist/css/xeditable.css",
            "./bower_components/angular-file-upload/angular-file-upload.js",
            "./bower_components/ng-img-crop/compile/unminified/ng-img-crop.js",
            //"./bower_components/ng-img-crop/compile/unminified/ng-img-crop.css",
            "./bower_components/angular-ui-select/dist/select.js",
            //"./bower_components/angular-ui-select/dist/select.css",
            //"./bower_components/angular-carousel/dist/angular-carousel.css",
            "./bower_components/angular-carousel/dist/angular-carousel.js",
            "./bower_components/angular-i18n/angular-locale_en.js",
            "./bower_components/ng-grid/build/ng-grid.min.js",
            //"./bower_components/ng-grid/ng-grid.css",
            "./bower_components/ng-grid/plugins/*.js",
            "./bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js",
            "./bower_components/Chart.js/Chart.js",

            /* MOCHA */
            './src/client/tests/lib/specHelper.js',
            './src/client/tests/lib/mockData.js',

            './src/client/app/app.module.js',
            './src/client/app/**/*.module.js',
            './src/client/app/**/*.js',

            // all specs ... comment out during early test training
            './src/client/tests/**/*.spec.js'
        ],

        // list of files to exclude
        exclude: [
            // Excluding midway tests for now; comment this line out when you want to run them
            './src/client/test/midway/**/*.spec.js',
            //'./src/client/test/specs/auth-services.spec.js',
            './src/client/app/**/*spaghetti.js',
            //'./src/client/app/blocks/auth/auth.module.js',
            //'./src/client/app/blocks/auth/config.route.js',
            './src/client/app/blocks/logger/logger.enhanced.js',
            './src/client/app/modules/charts/tests/**/*.js',

            './src/client/app/loader.js'
        ],

        proxies: {
            '/': 'http://localhost:8888/'
        },

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/client/app/modules/**/*.js': 'coverage'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'coverage'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        coverageReporter: {
            type: 'lcov',
            dir: 'test/coverage'
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
//        browsers: ['Chrome', 'ChromeCanary', 'FirefoxAurora', 'Safari', 'PhantomJS'],
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
