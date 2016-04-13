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
