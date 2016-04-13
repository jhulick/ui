module.exports = function() {
    var client = './src/client/';
    var server = './src/server/';
    var clientApp = client + 'app/';
    var report = './report/';
    var root = './';
    var specRunnerFile = 'specs.html';
    var temp = './.tmp/';
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({devDependencies: true})['js'];
    var bower = {
        json: require('./bower.json'),
        directory: './bower_components/',
        ignorePath: '../..'
    };
    var nodeModules = 'node_modules';

    // ignore everything that begins with underscore
    var hidden_files = '**/_*.*';
    var ignored_files = '!' + hidden_files;

    var config = {

        // production mode (see build task)
        isProduction: false,
        useSourceMaps: false,



        /**
         * File paths
         */
        // all javascript that we want to vet
        alljs: [
            './app/**/*.js',
            './*.js'
        ],
        build: './build/',
        client: client,
        css: temp + 'styles.css',
        fonts: bower.directory + 'font-awesome/fonts/**/*.*',
        html: client + '**/*.html',
        htmltemplates: clientApp + '**/*.html',
        images: client + 'images/**/*.*',
        index: client + 'index.html',
        // app js, with no specs
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        less: client + 'styles/styles.less',
        report: report,
        root: root,
        server: server,
        src: 'src/',

        source: {
            scripts: {
                app: [
                    'src/client/app/app.module.js',
                    'src/client/app/app.start.js',

                    'src/client/app/core/core.module.js',

                    'src/client/app/blocks/logger/logger.module.js',
                    'src/client/app/blocks/logger/logger.js',
                    'src/client/app/blocks/router/router-helper.provider.js',
                    'src/client/app/blocks/exception/exception.module.js',
                    'src/client/app/blocks/exception/exception.js',
                    'src/client/app/blocks/exception/exception-handler.provider.js',

                    'src/client/app/core/constants.js',
                    'src/client/app/core/config.js',
                    'src/client/app/core/services/*.js',

                    'src/client/app/layout/layout.module.js',
                    'src/client/app/layout/layout.route.js',
                    'src/client/app/layout/controllers/*.js',

                    'src/client/app/modules/controllers/*.js',

                    'src/client/app/directives/*.js',
                    'src/client/app/directives/navbarSearch/navbar-search.js',

                    'src/client/app/services/*.js',
                    'src/client/app/filters/*.js',

                    /* feature areas */


                    'src/client/app/modules/dashboard/dashboard.module.js',
                    'src/client/app/modules/dashboard/dashboard.route.js',

                    'src/client/app/modules/widgets/widgets.module.js',
                    'src/client/app/modules/widgets/widgets.route.js',

                    'src/client/app/modules/grid/grid.module.js',
                    'src/client/app/modules/grid/grid.route.js',

                    'src/client/app/modules/charts/charts.module.js',
                    'src/client/app/modules/charts/charts.route.js',
                    'src/client/app/modules/charts/services/chart.dataservice.js',
                    'src/client/app/modules/charts/controllers/*.js',

                    'src/client/app/modules/dialog/ngdialog.module.js',
                    'src/client/app/modules/dialog/ngdialog.route.js',
                    'src/client/app/modules/dialog/controllers/ngdialog.controller.js',

                    'src/client/app/modules/notifications/notifications.module.js',
                    'src/client/app/modules/notifications/notifications.route.js',
                    'src/client/app/modules/notifications/controllers/*.js',

                    'src/client/app/modules/maps/maps.module.js',
                    'src/client/app/modules/maps/maps.route.js',
                    'src/client/app/modules/maps/controllers/*.js',

                    'src/client/app/modules/forms/forms.module.js',
                    'src/client/app/modules/forms/forms.route.js',
                    'src/client/app/modules/forms/services/*.js',
                    'src/client/app/modules/forms/controllers/*.js',

                    'src/client/app/modules/tables/tables.module.js',
                    'src/client/app/modules/tables/tables.route.js',
                    'src/client/app/modules/tables/services/*.js',
                    'src/client/app/modules/tables/controllers/*.js',

                    'src/client/app/modules/calendar/calendar.module.js',
                    'src/client/app/modules/calendar/calendar.route.js',
                    'src/client/app/modules/calendar/controllers/*.js',
                    'src/client/app/modules/calendar/services/*.js',

                    'src/client/app/modules/carousel/carousel.module.js',
                    'src/client/app/modules/carousel/carousel.route.js',
                    'src/client/app/modules/carousel/controllers/*.js',

                    'src/client/app/modules/navtree/navtree.module.js',
                    'src/client/app/modules/navtree/navtree.route.js',
                    'src/client/app/modules/navtree/controllers/*.js',

                    'src/client/app/modules/nestable/nestable.module.js',
                    'src/client/app/modules/nestable/nestable.route.js',
                    'src/client/app/modules/nestable/controllers/*.js',

                    'src/client/app/modules/portlets/portlets.module.js',
                    'src/client/app/modules/portlets/portlets.route.js',
                    'src/client/app/modules/portlets/controllers/*.js',

                    'src/client/app/modules/sortable/sortable.module.js',
                    'src/client/app/modules/sortable/sortable.route.js',
                    'src/client/app/modules/sortable/controllers/*.js',

                    'src/client/app/modules/panels/panels.module.js',
                    'src/client/app/modules/panels/panels.route.js',
                    'src/client/app/modules/panels/controllers/*.js',

                    'src/client/app/modules/code-editor/code.editor.module.js',
                    'src/client/app/modules/code-editor/code.editor.route.js',
                    'src/client/app/modules/code-editor/controllers/*.js',

                    'src/client/app/modules/mailbox/mailbox.module.js',
                    'src/client/app/modules/mailbox/mailbox.route.js',
                    'src/client/app/modules/mailbox/services/*.js',
                    'src/client/app/modules/mailbox/controllers/*.js',

                    'src/client/app/modules/multilevel/multilevel.module.js',
                    'src/client/app/modules/multilevel/multilevel.route.js',

                    'src/client/app/modules/buttons/buttons.module.js',
                    'src/client/app/modules/buttons/buttons.route.js',
                    'src/client/app/modules/buttons/controllers/*.js',

                    'src/client/app/modules/invoice/invoice.module.js',
                    'src/client/app/modules/invoice/invoice.route.js',

                    'src/client/app/modules/todo/todo.module.js',
                    'src/client/app/modules/todo/todo.route.js',
                    'src/client/app/modules/todo/controllers/*.js',

                    'src/client/app/modules/interaction/interaction.module.js',
                    'src/client/app/modules/interaction/interaction.route.js',
                    'src/client/app/modules/interaction/controllers/*.js',

                    'src/client/app/sidebar/sidebar.module.js',
                    'src/client/app/sidebar/controllers/*.js',

                    'src/client/app/modules/register/register.module.js',
                    'src/client/app/modules/register/register.route.js',
                    'src/client/app/modules/register/controllers/*.js',

                    'src/client/app/modules/search/search.module.js',
                    'src/client/app/modules/search/search.route.js',
                    'src/client/app/modules/search/controllers/*.js',

                    'src/client/app/modules/login/login.module.js',
                    'src/client/app/modules/login/login.route.js',
                    'src/client/app/modules/login/controllers/*.js',

                    'src/client/app/modules/infinite-scroll/infinite.scroll.module.js',
                    'src/client/app/modules/infinite-scroll/infinite.scroll.route.js',
                    'src/client/app/modules/infinite-scroll/controllers/*.js',

                    'src/client/app/modules/timeline/timeline.module.js',
                    'src/client/app/modules/timeline/timeline.route.js',

                    'src/client/app/modules/profile/profile.module.js',
                    'src/client/app/modules/profile/profile.route.js',

                    'src/client/app/modules/spinners/spinners.module.js',
                    'src/client/app/modules/spinners/spinners.route.js',

                    'src/client/app/modules/animations/animations.module.js',
                    'src/client/app/modules/animations/animations.route.js',

                    'src/client/app/modules/autocomplete/autocomplete.module.js',
                    'src/client/app/modules/autocomplete/autocomplete.route.js',
                    'src/client/app/modules/autocomplete/controllers/*.js',
                    'src/client/app/modules/autocomplete/services/*.js',

                    'src/client/app/modules/colors/colors.editor.module.js',
                    'src/client/app/modules/colors/colors.editor.route.js',

                    'src/client/app/modules/typo/typo.module.js',
                    'src/client/app/modules/typo/typo.route.js',

                    'src/client/app/modules/icons/icons.module.js',
                    'src/client/app/modules/icons/icons.route.js',

                    'src/client/app/modules/documentation/documentation.module.js',
                    'src/client/app/modules/documentation/documentation.route.js',

                    'src/client/app/modules/template/template.module.js',
                    'src/client/app/modules/template/template.route.js',

                    'src/client/app/modules/diff/diff.module.js',
                    'src/client/app/modules/diff/diff.route.js',
                    'src/client/app/modules/diff/controllers/*.js',

                    'src/client/app/modules/idle/idle.module.js',
                    'src/client/app/modules/idle/idle.route.js',
                    'src/client/app/modules/idle/controllers/*.js'
                ],
                watch: ['src/client/app/**/*.js']
            },
            styles: {
                app: {
                    main: ['src/client/less/app.less', '!src/client/less/themes/*.less'],
                    dir: 'src/client/less',
                    watch: ['src/client/less/*.less', 'src/client/less/**/*.less', '!src/client/less/themes/*.less']
                },
                themes: {
                    main: ['src/client/less/themes/*.less', ignored_files],
                    dir: 'src/client/less/themes',
                    watch: ['src/client/less/themes/*.less']
                }
            },
            bootstrap: {
                main: 'src/client/less/bootstrap/bootstrap.less',
                dir: 'src/client/less/bootstrap',
                watch: ['src/client/less/bootstrap/*.less']
            }
        },

        build: {
            scripts: {
                app: {
                    main: 'app.js',
                    dir: './build/app'
                }
            },
            styles: './build/css',
            templates: {
                app: 'src/client',
                views: './build/views',
                pages: './build/pages'
            }
        },

        stubsjs: [
            bower.directory + 'angular-mocks/angular-mocks.js',
            client + 'stubs/**/*.js'
        ],
        temp: temp,

        // vendor scripts required to start the app
        vendor: {
            base: {
                source: require('./vendor.base.json'),
                dest: './build/app',
                name: 'base.js'
            },
            // vendor scripts to make to app work. Usually via lazy loading
            app: {
                source: require('./vendor.json'),
                dest: './build/vendor'
            }
        },

        /**
         * optimized files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        },

        /**
         * plato
         */
        plato: {js: clientApp + '**/*.js'},

        /**
         * browser sync
         */
        browserReloadDelay: 1000,

        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                root: 'app/',
                standAlone: false
            }
        },

        /**
         * Bower and NPM files
         */
        bower: bower,
        packages: [
            './package.json',
            './bower.json'
        ],

        /**
         * specs.html, our HTML spec runner
         */
        specRunner: client + specRunnerFile,
        specRunnerFile: specRunnerFile,

        /**
         * The sequence of the injections into specs.html:
         *  1 testlibraries
         *      mocha setup
         *  2 bower
         *  3 js
         *  4 spechelpers
         *  5 specs
         *  6 templates
         */
        testlibraries: [
            nodeModules + '/mocha/mocha.js',
            nodeModules + '/chai/chai.js',
            nodeModules + '/mocha-clean/index.js',
            nodeModules + '/sinon-chai/lib/sinon-chai.js'
        ],
        specHelpers: [client + 'test-helpers/*.js'],
        specs: [client + '/tests/**/*.spec.js'],
        serverIntegrationSpecs: [client + '/tests/server-integration/**/*.spec.js'],

        /**
         * Node settings
         */
        nodeServer: './src/server/app.js',
        defaultPort: '7203'
    };

    /**
     * wiredep and bower settings
     */
    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    /**
     * karma settings
     */
    config.karma = getKarmaOptions();

    return config;

    ////////////////

    function getKarmaOptions() {
        var options = {
            files: [].concat(
                bowerFiles,
                config.specHelpers,
                clientApp + '**/*.module.js',
                clientApp + '**/*.js',
                temp + config.templateCache.file,
                config.serverIntegrationSpecs
            ),
            exclude: [],
            coverage: {
                dir: report + 'coverage',
                reporters: [
                    // reporters not supporting the `file` property
                    {type: 'html', subdir: 'report-html'},
                    {type: 'lcov', subdir: 'report-lcov'},
                    // reporters supporting the `file` property, use `subdir` to directly
                    // output them in the `dir` directory.
                    // omit `file` to output to the console.
                    // {type: 'cobertura', subdir: '.', file: 'cobertura.txt'},
                    // {type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt'},
                    // {type: 'teamcity', subdir: '.', file: 'teamcity.txt'},
                    //{type: 'text'}, //, subdir: '.', file: 'text.txt'},
                    {type: 'text-summary'} //, subdir: '.', file: 'text-summary.txt'}
                ]
            },
            preprocessors: {}
        };
        options.preprocessors[clientApp + '**/!(*.spec)+(.js)'] = ['coverage'];
        return options;
    }
};
