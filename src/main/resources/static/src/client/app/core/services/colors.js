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
