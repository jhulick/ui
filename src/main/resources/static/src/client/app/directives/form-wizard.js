/**=========================================================
 * Module: form-wizard.js
 * Handles form wizard plugin and validation
 =========================================================*/
(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('formWizard', FormWizard);

    FormWizard.$inject = ['$parse'];

    function FormWizard($parse) {

        var directive = {
            restrict: 'A',
            scope: true,
            link: function (scope, element, attribute) {
                var validate = $parse(attribute.validateSteps)(scope),
                    wiz = new Wizard(attribute.steps, !!validate, element);
                scope.wizard = wiz.init();

            }
        };
        return directive;

        /////////////////////////////////////

        function Wizard(quantity, validate, element) {

            var self = this;
            self.quantity = parseInt(quantity, 10);
            self.validate = validate;
            self.element = element;

            self.init = function () {
                self.createsteps(self.quantity);
                self.go(1); // always start at fist step
                return self;
            };

            self.go = function (step) {
                if (angular.isDefined(self.steps[step])) {
                    if (self.validate && step !== 1) {
                        var form = $(self.element),
                            group = form.children().children('div').get(step - 2);

                        if (false === form.parsley().validate(group.id)) {
                            return false;
                        }
                    }
                    self.cleanall();
                    self.steps[step] = true;
                }
            }

            self.active = function (step) {
                return !!self.steps[step];
            }

            self.cleanall = function () {
                for (var i in self.steps) {
                    self.steps[i] = false;
                }
            }

            self.createsteps = function (q) {
                self.steps = [];
                for (var i = 1; i <= q; i++) self.steps[i] = false;
            }
        }
    }
})();
