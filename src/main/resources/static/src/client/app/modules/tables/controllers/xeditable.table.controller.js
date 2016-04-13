/**=========================================================
 * Module: app.tables
 * Provides a demo for xeditable tables
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.tables')
        .controller('TablexEditableController', TablexEditableController);

    TablexEditableController.$inject = ['$filter', '$q', 'logger', 'xEditableTableDataService'];

    function TablexEditableController($filter, $q, logger, xEditableTableDataService) {
        // required for inner references
        var vm = this;

        vm.title = "TablexEditable";
        vm.loadGroups = loadGroups;
        vm.showGroup = showGroup;
        vm.showStatus = showStatus;
        vm.checkName = checkName;
        vm.saveUser = saveUser;
        vm.removeUser = removeUser;
        vm.addUser = addUser;
        vm.saveColumn = saveColumn;
        vm.filterUser = filterUser;
        vm.deleteUser = deleteUser;
        vm.cancel = cancel;
        vm.saveTable = saveTable;

        activate();

        function activate() {
            logger.info('Activated TablexEditableController View');
            init();
        }

        /**
         * Construct a few datatables.
         * @returns {*}
         */
        function init() {
            // editable row
            // -----------------------------------
            vm.users = [
                {id: 1, name: 'awesome user1', status: 2, group: 4, groupName: 'admin'},
                {id: 2, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
                {id: 3, name: 'awesome user3', status: 2, group: null}
            ];

            vm.statuses = [
                {value: 1, text: 'status1'},
                {value: 2, text: 'status2'},
                {value: 3, text: 'status3'},
                {value: 4, text: 'status4'}
            ];

            vm.groups = [];
        }

        function loadGroups() {
            return vm.groups.length ? null :
                xEditableTableDataService.getData().then(function (data) {
                    vm.groups = data;
                });
        }

        function showGroup(user) {
            if (user.group && vm.groups.length) {
                var selected = $filter('filter')(vm.groups, {id: user.group});
                return selected.length ? selected[0].text : 'Not set';
            } else {
                return user.groupName || 'Not set';
            }
        }

        function showStatus(user) {
            var selected = [];
            if (user.status) {
                selected = $filter('filter')(vm.statuses, {value: user.status});
            }
            return selected.length ? selected[0].text : 'Not set';
        }

        function checkName(data, id) {
            if (id === 2 && data !== 'awesome') {
                return "Username 2 should be `awesome`";
            }
        }

        function saveUser(data, id) {
            //$scope.user not updated yet
            angular.extend(data, {id: id});
            logger.info('Saving user: ' + id);
            // return $http.post('/saveUser', data);
        }

        // remove user
        function removeUser(index) {
            vm.users.splice(index, 1);
        }

        // add user
        function addUser() {
            vm.inserted = {
                id: vm.users.length + 1,
                name: '',
                status: null,
                group: null,
                isNew: true
            };
            vm.users.push(vm.inserted);
        }

        // editable column
        // -----------------------------------


        function saveColumn(column) {
            var results = [];
            angular.forEach(vm.users, function (user) {
                // results.push($http.post('/saveColumn', {column: column, value: user[column], id: user.id}));
                logger.info('Saving column: ' + column);
            });
            return $q.all(results);
        }

        // editable table
        // -----------------------------------

        // filter users to show
        function filterUser(user) {
            return user.isDeleted !== true;
        }

        // mark user as deleted
        function deleteUser(id) {
            var filtered = $filter('filter')(vm.users, {id: id});
            if (filtered.length) {
                filtered[0].isDeleted = true;
            }
        }

        // cancel all changes
        function cancel() {
            for (var i = vm.users.length; i--;) {
                var user = vm.users[i];
                // undelete
                if (user.isDeleted) {
                    delete user.isDeleted;
                }
                // remove new
                if (user.isNew) {
                    vm.users.splice(i, 1);
                }
            }
        }

        // save edits
        function saveTable() {
            var results = [];
            for (var i = vm.users.length; i--;) {
                var user = vm.users[i];
                // actually delete user
                if (user.isDeleted) {
                    vm.users.splice(i, 1);
                }
                // mark as not new
                if (user.isNew) {
                    user.isNew = false;
                }

                // send on server
                // results.push($http.post('/saveUser', user));
                logger.info('Saving Table...');
            }

            return $q.all(results);
        }
    }
})();
