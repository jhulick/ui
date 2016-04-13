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
