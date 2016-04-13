var args = require('yargs').argv;
var browserSync = require('browser-sync');
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jade = require('gulp-jade')
var less = require('gulp-less')
var livereload = require('gulp-livereload'); // Livereload plugin needed: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
var marked = require('marked'); // For :markdown filter in jade
var path = require('path');
var changed = require('gulp-changed');
var rename = require('gulp-rename');
var del = require('del');
var flip = require('css-flip');
var through = require('through2');
var gutil = require('gulp-util');
var minifyCSS = require('gulp-minify-css');
var gulpFilter = require('gulp-filter');
var glob = require('glob');
var expect = require('gulp-expect-file');
var gulpsync = require('gulp-sync')(gulp);
var sourcemaps = require('gulp-sourcemaps');
var ngGraph = require('gulp-angular-architecture-graph');
var karma = require('karma').server;

var config = require('./gulp.config')();

var $ = require('gulp-load-plugins')({lazy: true});

var colors = $.util.colors;
var env = $.util.env;
var port = process.env.PORT || config.defaultPort;

/**
 * yargs variables can be passed in to alter the behavior, when present.
 * Example: gulp serve-dev
 *
 * --verbose  : Various tasks will produce more output to the console.
 * --nosync   : Don't launch the browser with browser-sync when serving code.
 * --debug    : Launch debugger with node-inspector.
 * --debug-brk: Launch debugger and break on 1st line with node-inspector.
 * --startServers: Will start servers for midway tests on the test task.
 */

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
//gulp.task('default', ['help']);

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function() {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'))
        .pipe($.jscs());
});

/**
 * Create a visualizer report
 */
gulp.task('plato', function(done) {
    log('Analyzing source with Plato');
    log('Browse to /report/plato/index.html to see Plato results');

    startPlatoVisualizer(done);
});

/**
 * serve the dev environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-dev', function() {
    serve(true /*isDev*/);
});

/**
 * serve the build environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-build', ['build-dev'], function() {
    serve(false /*isDev*/);
});

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
//gulp.task('test', ['vet', 'templatecache'], function(done) {
gulp.task('test', ['templatecache'], function(done) {
    startTests(true /*singleRun*/ , done);
});

/**
 * Generate modules dependencies graph with graphviz.
 *
 * @return {Stream}
 */
gulp.task('graph', function(){
    gulp.src(config.source.scripts.app)
        .pipe(ngGraph({
            dest: 'architecture'
        }));
});

// JS APP
gulp.task('scripts:app', function () {
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(config.source.scripts.app)
        .pipe(config.useSourceMaps ? sourcemaps.init() : gutil.noop())
        .pipe(concat(config.build.scripts.app.main))
        //.pipe(injector())
        //.pipe(ngAnnotate())
        .on("error", handleError)
        .pipe(config.isProduction ? uglify({preserveComments: 'some'}) : gutil.noop())
        .on("error", handleError)
        .pipe(config.useSourceMaps ? sourcemaps.write() : gutil.noop())
        .pipe(gulp.dest(config.build.scripts.app.dir));
});

/**
 * Run the spec runner
 * @return {Stream}
 */
gulp.task('serve-specs', ['build-specs'], function(done) {
    log('run the spec runner');
    serve(true /* isDev */, true /* specRunner */);
    done();
});

/**
 * Inject all the spec files into the specs.html
 * @return {Stream}
 */
gulp.task('build-specs', ['templatecache'], function(done) {
    log('building the spec runner');

    var wiredep = require('wiredep').stream;
    var templateCache = config.temp + config.templateCache.file;
    var options = config.getWiredepDefaultOptions();
    var specs = config.specs;

    if (args.startServers) {
        specs = [].concat(specs, config.serverIntegrationSpecs);
    }
    options.devDependencies = true;

    return gulp
        .src(config.specRunner)
        .pipe(wiredep(options))
        .pipe(inject(config.js, '', config.jsOrder))
        .pipe(inject(config.testlibraries, 'testlibraries'))
        .pipe(inject(config.specHelpers, 'spechelpers'))
        .pipe(inject(specs, 'specs', ['**/*']))
        .pipe(inject(templateCache, 'templates'))
        .pipe(gulp.dest(config.client));
});

// VENDOR BUILD
gulp.task('scripts:vendor', ['scripts:vendor:base', 'scripts:vendor:app']);

//  This will be included vendor files statically
gulp.task('scripts:vendor:base', function () {

    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(config.vendor.base.source)
        .pipe(expect(config.vendor.base.source))
        .pipe(uglify())
        .pipe(concat(config.vendor.base.name))
        .pipe(gulp.dest(config.vendor.base.dest));
});

// copy file from bower folder into the app vendor folder
gulp.task('scripts:vendor:app', function () {

    var jsFilter = gulpFilter('**/*.js');
    var cssFilter = gulpFilter('**/*.css');

    return gulp.src(config.vendor.app.source, {base: 'bower_components'})
        .pipe(expect(config.vendor.app.source))
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(minifyCSS())
        .pipe(cssFilter.restore())
        .pipe(gulp.dest(config.vendor.app.dest));
});

// APP LESS
gulp.task('styles:app', function () {
    return gulp.src(config.source.styles.app.main)
        .pipe(config.useSourceMaps ? sourcemaps.init() : gutil.noop())
        .pipe(less({
            paths: [config.source.styles.app.dir]
        }))
        .on("error", handleError)
        .pipe(config.isProduction ? minifyCSS() : gutil.noop())
        .pipe(config.useSourceMaps ? sourcemaps.write() : gutil.noop())
        .pipe(gulp.dest(config.build.styles));
});

// APP RTL
gulp.task('styles:app:rtl', function () {
    return gulp.src(config.source.styles.app.main)
        .pipe(config.useSourceMaps ? sourcemaps.init() : gutil.noop())
        .pipe(less({
            paths: [config.source.styles.app.dir]
        }))
        .on("error", handleError)
        .pipe(flipcss())
        .pipe(config.isProduction ? minifyCSS() : gutil.noop())
        .pipe(config.useSourceMaps ? sourcemaps.write() : gutil.noop())
        .pipe(rename(function (path) {
            path.basename += "-rtl";
            return path;
        }))
        .pipe(gulp.dest(config.build.styles));
});

// LESS THEMES
gulp.task('styles:themes', function () {
    return gulp.src(config.source.styles.themes.main)
        .pipe(less({
            paths: [config.source.styles.themes.dir]
        }))
        .on("error", handleError)
        .pipe(gulp.dest(config.build.styles));
});

// BOOSTRAP
gulp.task('bootstrap', function () {
    return gulp.src(config.source.bootstrap.main)
        .pipe(less({
            paths: [config.source.bootstrap.dir]
        }))
        .on("error", handleError)
        .pipe(gulp.dest(config.build.styles));
});

// JADE
gulp.task('templates:views', function () {
    return gulp.src(source.templates.views.files)
        .pipe(changed(build.templates.views, {extension: '.html'}))
        .pipe(jade())
        .on("error", handleError)
        .pipe(prettify({
            indent_char: ' ',
            indent_size: 3,
            unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u']
        }))
        // .pipe(htmlify({
        //     customPrefixes: ['ui-']
        // }))
        // .pipe(w3cjs( W3C_OPTIONS ))
        .pipe(gulp.dest(build.templates.views));
});

//---------------
// WATCH
//---------------

// Rerun the task when a file changes
gulp.task('watch', function () {
    livereload.listen();

    gulp.watch(config.source.scripts.watch, ['scripts:app']);
    gulp.watch(config.source.styles.app.watch, ['styles:app', 'styles:app:rtl']);
    gulp.watch(config.source.styles.themes.watch, ['styles:themes']);
    gulp.watch(config.source.bootstrap.watch, ['styles:app']); //bootstrap
    //gulp.watch(config.source.templates.views.watch, ['templates:views']);

    gulp.watch([
        './build/**'
    ]).on('change', function (event) {
        livereload.changed(event.path);
    });

});

// build for production (minify)
gulp.task('build', ['prod', 'default']);
gulp.task('build-dev', ['default']);
gulp.task('prod', function () {
    config.isProduction = true;
});

// build with sourcemaps (no minify)
gulp.task('sourcemaps', ['usesources', 'default']);
gulp.task('usesources', function () {
    config.useSourceMaps = true;
});

// default (no minify)
gulp.task('default', gulpsync.sync([
    'scripts:vendor',
    'scripts:app',
    'start'
]), function () {
    gutil.log(gutil.colors.cyan('************'));
    gutil.log(gutil.colors.cyan('* All Done *'), 'You can start editing your code, LiveReload will update your browser after any change..');
    gutil.log(gutil.colors.cyan('************'));
});

gulp.task('start', [
    'styles:app',
    'styles:app:rtl',
    'styles:themes'
    /*'templates:views'*/
    /*'watch'*/
]);

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function() {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'))
        .pipe($.jscs());
});

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', ['clean-code'], function() {
    log('Creating an AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.if(args.verbose, $.bytediff.start()))
        .pipe($.minifyHtml({empty: true}))
        .pipe($.if(args.verbose, $.bytediff.stop(bytediffFormatter)))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
});

/**
 * Remove all js and html from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-code', function(done) {
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + 'app/**/*.js'
        //config.build + '**/*.html'
    );
    clean(files, done);
});

gulp.task('done', function () {
    console.log('All Done!! You can start editing your code, LiveReload will update your browser after any change..');
});

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
    var child;
    var excludeFiles = [];
    var spawn = require('child_process').spawn;

    if (env.startServers) {
        log('Starting servers');
        var savedEnv = process.env;
        savedEnv.NODE_ENV = 'dev';
        savedEnv.PORT = 8888;
        child = spawn('node', ['../server/app.js'], {env: savedEnv}, childProcessCompleted);
    } else {
        excludeFiles.push('./app/test/midway/**/*.spec.js');
    }

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        exclude: excludeFiles,
        singleRun: !!singleRun
    }, karmaCompleted);


    ////////////////
    function childProcessCompleted(error, stdout, stderr) {
        log('stdout: ' + stdout);
        log('stderr: ' + stderr);
        if (error !== null) {
            log('exec error: ' + error);
        }
    }

    function karmaCompleted() {
        if (child) {child.kill();}
        done();
    }
}


/**
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name
 * @param   {Array} order   glob pattern for sort order of the files
 * @returns {Stream}   The stream
 */
function inject(src, label, order) {
    var options = {read: false};
    if (label) {
        options.name = 'inject:' + label;
    }

    return $.inject(orderSrc(src, order), options);
}

/**
 * Start Plato inspector and visualizer
 */
function startPlatoVisualizer(done) {
    log('Running Plato');

    var files = glob.sync(config.plato.js);
    var excludeFiles = /.*\.spec\.js/;
    var plato = require('plato');

    var options = {
        title: 'Plato Inspections Report',
        exclude: excludeFiles
    };
    var outputDir = config.report + '/plato';

    plato.inspect(files, outputDir, options, platoCompleted);

    function platoCompleted(report) {
        var overview = plato.getOverviewReport(report);
        if (args.verbose) {
            log(overview.summary);
        }
        if (done) { done(); }
    }
}

/**
 * Order a stream
 * @param   {Stream} src   The gulp.src stream
 * @param   {Array} order Glob array pattern
 * @returns {Stream} The ordered stream
 */
function orderSrc (src, order) {
    //order = order || ['**/*'];
    return gulp
        .src(src)
        .pipe($.if(order, $.order(order)));
}

/**
 * serve the code
 * --debug-brk or --debug
 * --nosync
 * @param  {Boolean} isDev - dev or build mode
 * @param  {Boolean} specRunner - server spec runner html
 */
function serve(isDev, specRunner) {
    var debug = args.debug || args.debugBrk;
    var debugMode = args.debug ? '--debug' : args.debugBrk ? '--debug-brk' : '';
    var nodeOptions = getNodeOptions(isDev);

    if (debug) {
        runNodeInspector();
        nodeOptions.nodeArgs = [debugMode + '=5858'];
    }

    if (args.verbose) {
        console.log(nodeOptions);
    }

    return $.nodemon(nodeOptions)
        .on('restart', ['vet'], function(ev) {
            log('*** nodemon restarted');
            log('files changed:\n' + ev);
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                browserSync.reload({stream: false});
            }, config.browserReloadDelay);
        })
        .on('start', function () {
            log('*** nodemon started');
            startBrowserSync(isDev, specRunner);
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });
}

/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}


/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

function runNodeInspector() {
    log('Running node-inspector.');
    log('Browse to http://localhost:8080/debug?port=5858');
    var exec = require('child_process').exec;
    exec('node-inspector');
}

function getNodeOptions(isDev) {
    return {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };
}

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from ' +
        (data.startSize / 1000).toFixed(2) + ' kB to ' +
        (data.endSize / 1000).toFixed(2) + ' kB and is ' +
        formatPercent(1 - data.percent, 2) + '%' + difference;
}

/**
 * Format a number as a percentage
 * @param  {Number} num       Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {String}           Formatted perentage
 */
function formatPercent(num, precision) {
    return (num * 100).toFixed(precision);
}


/**
 * Start BrowserSync
 * --nosync will avoid browserSync
 */
function startBrowserSync(isDev, specRunner) {
    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting BrowserSync on port ' + port);

    // If build: watches the files, builds, and restarts browser-sync.
    // If dev: watches less, compiles it to css, browser-sync handles reload
    if (isDev) {
        gulp.watch([config.less], ['styles'])
            .on('change', changeEvent);
    } else {
        gulp.watch([config.less, config.js, config.html], ['optimize', browserSync.reload])
            .on('change', changeEvent);
    }

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: isDev ? [
            config.client + '**/*.*',
            '!' + config.less,
            config.temp + '**/*.css'
        ] : [],
        ghostMode: { // these are the defaults t,f,t,t
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 0 //1000
    };
    if (specRunner) {
        options.startPath = config.specRunnerFile;
    }

    browserSync(options);
}

/**
 * When files change, log it
 * @param  {Object} event - event that fired
 */
function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

// Error handler
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

// Mini gulp plugin to flip css (rtl)
function flipcss(opt) {

    if (!opt) opt = {};

    // creating a stream through which each file will pass
    var stream = through.obj(function (file, enc, cb) {
        if (file.isNull()) return cb(null, file);

        if (file.isStream()) {
            console.log("todo: isStream!");
        }

        var flippedCss = flip(String(file.contents), opt);
        file.contents = new Buffer(flippedCss);
        cb(null, file);
    });

    // returning the file stream
    return stream;
}
