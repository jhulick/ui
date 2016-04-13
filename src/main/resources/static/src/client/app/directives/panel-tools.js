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
