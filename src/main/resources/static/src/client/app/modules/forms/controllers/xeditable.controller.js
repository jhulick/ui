/**=========================================================
 * Module: form-xeditable.js
 * Form xEditable controller
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.forms')
        .controller('FormxEditableController', FormxEditableController);

    FormxEditableController.$inject = ['$scope', '$q', 'editableOptions', 'editableThemes', '$filter', 'formsDataservice', 'logger'];

    function FormxEditableController($scope, $q, editableOptions, editableThemes, $filter, formsDataservice, logger) {
        // required for inner references
        var vm = this;

        vm.title = "FormxEditableController";
        vm.user = {};
        vm.user2 = {};
        vm.user3 = {};
        vm.user4 = {};
        vm.statuses = [];
        vm.groups = [];
        vm.states = [];

        vm.showStatus = showStatus;

        init();
        activate();

        ///////////////////////////////////////

        function activate() {
            var promises = [loadGroups()];
            return $q.all(promises).then(function() {
                logger.info('Activated FormxEditableController View');
            });
        }

        function init() {
            editableOptions.theme = 'bs3';

            editableThemes.bs3.inputClass = 'input-sm';
            editableThemes.bs3.buttonsClass = 'btn-sm';
            editableThemes.bs3.submitTpl = '<button type="submit" class="btn btn-success"><span class="fa fa-check"></span></button>';
            editableThemes.bs3.cancelTpl = '<button type="button" class="btn btn-default" ng-click="$form.$cancel()">' +
            '<span class="fa fa-times text-muted"></span>' +
            '</button>';

            vm.user = {
                email: 'email@example.com',
                tel: '123-45-67',
                number: 29,
                range: 10,
                url: 'http://example.com',
                search: 'blabla',
                color: '#6a4415',
                date: null,
                time: '12:30',
                datetime: null,
                month: null,
                week: null,
                desc: 'Sed pharetra euismod dolor, id feugiat ante volutpat eget. '
            };

            // Local select
            // -----------------------------------

            vm.user2 = {
                status: 2
            };

            vm.statuses = [
                {value: 1, text: 'status1'},
                {value: 2, text: 'status2'},
                {value: 3, text: 'status3'},
                {value: 4, text: 'status4'}
            ];

            // select remote
            // -----------------------------------

            vm.user3 = {
                id: 4,
                text: 'admin' // original value
            };

            $scope.$watch('vm.user3.id', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    var selected = $filter('filter')(vm.groups, {id: vm.user3.id});
                    vm.user3.text = selected.length ? selected[0].text : null;
                }
            });

            vm.groups = [];

            // Typeahead
            // -----------------------------------

            vm.user4 = {
                state: 'Arizona'
            };

            vm.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
        }

        function loadGroups() {
            return vm.groups.length ? null : formsDataservice.getXeditableGroups().then(function (data) {
                vm.groups = data;
            });
        }

        function showStatus() {
            var selected = $filter('filter')(vm.statuses, {value: vm.user2.status});
            return (vm.user2.status && selected.length) ? selected[0].text : 'Not set';
        }
    }
})();
