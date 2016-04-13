(function () {
    'use strict';

    angular
        .module('app.forms')
        .controller('FormDemoCtrl', FormDemoCtrl);

    FormDemoCtrl.$inject = ['$q', 'logger', 'formsDataservice'];

    function FormDemoCtrl($q, logger, formsDataservice) {

        // required for inner references
        var vm = this;

        vm.title = "FormDemoCtrl";
        vm.cities = [];
        vm.states = [];
        vm.alertSubmit = alertSubmit;

        activate();

        ///////////////////////////////////////

        function activate() {
            var promises = [getCities(), getChosenStates()];
            return $q.all(promises).then(function() {
                logger.info('Activated Form View');
            });
        }

        function getCities() {
            return formsDataservice.getCities().then(function (data) {
                vm.cities = data;
                return vm.cities;
            });
        }

        function getChosenStates() {
            return formsDataservice.getChosenStates().then(function (data) {
                vm.states = data;
                return vm.states;
            });
        }

        function alertSubmit() {
            logger.info('Form submitted!');
            return false;
        }
    }
})();
