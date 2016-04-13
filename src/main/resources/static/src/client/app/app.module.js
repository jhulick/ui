
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
