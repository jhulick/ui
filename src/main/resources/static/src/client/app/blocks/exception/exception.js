
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
