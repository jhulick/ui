/**=========================================================
 * Module: ng-grid.js
 * ngGrid demo
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.tables')
        .controller('NGGridController', NGGridController);

    NGGridController.$inject = ['$scope', '$http', '$timeout', 'logger'];

    function NGGridController($scope, $http, $timeout, logger) {
        // required for inner references
        var vm = this;

        vm.title = "NGTable";
        vm.setPagingData = setPagingData;
        vm.getPagedDataAsync = getPagedDataAsync;

        activate();

        function activate() {
            logger.info('Activated NGGridController View');
            init();
        }


        ////////////////////////

        function setPagingData(data, page, pageSize) {
            // calc for pager
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            // Store data from server
            vm.myData = pagedData;
            // Update server side data length
            vm.totalServerItems = data.length;

            if (!vm.$$phase) {
                vm.$apply();
            }

        };

        // TODO: move to dataservice
        function getPagedDataAsync(pageSize, page, searchText) {
            var ngGridResourcePath = 'server/data/ng-grid-data.json';

            $timeout(function () {

                if (searchText) {
                    var ft = searchText.toLowerCase();
                    $http.get(ngGridResourcePath).success(function (largeLoad) {
                        var data = largeLoad.filter(function (item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });
                        vm.setPagingData(data, page, pageSize);
                    });
                } else {
                    $http.get(ngGridResourcePath).success(function (largeLoad) {
                        vm.setPagingData(largeLoad, page, pageSize);
                    });
                }
            }, 100);
        };

        /**
         * Construct a few ng-tables.
         * @returns {*}
         */
        function init() {

            vm.filterOptions = {
                filterText: "",
                useExternalFilter: true
            };
            vm.totalServerItems = 0;
            vm.pagingOptions = {
                pageSizes: [250, 500, 1000],  // page size options
                pageSize: 250,              // default page size
                currentPage: 1                 // initial page
            };

            vm.gridOptions = {
                data: 'myData',
                enablePaging: true,
                showFooter: true,
                rowHeight: 36,
                headerRowHeight: 38,
                totalServerItems: 'totalServerItems',
                pagingOptions: vm.pagingOptions,
                filterOptions: vm.filterOptions
            };
            $scope.$watch('pagingOptions', function (newVal, oldVal) {
                if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                    vm.getPagedDataAsync(vm.pagingOptions.pageSize, vm.pagingOptions.currentPage, vm.filterOptions.filterText);
                }
            }, true);
            $scope.$watch('filterOptions', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    vm.getPagedDataAsync(vm.pagingOptions.pageSize, vm.pagingOptions.currentPage, vm.filterOptions.filterText);
                }
            }, true);

            vm.getPagedDataAsync(vm.pagingOptions.pageSize, vm.pagingOptions.currentPage);
        }

    }
})();
