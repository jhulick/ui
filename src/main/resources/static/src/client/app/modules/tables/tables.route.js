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
