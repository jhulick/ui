describe('app.buttons', function() {
    var controller;

    beforeEach(function() {
        module('app.buttons', function($provide) {
            specHelper.fakeStateProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function($controller, $q, $rootScope, dataservice) {});
    });

    beforeEach(function () {
        controller = $controller('ButtonsCtrl');
        $rootScope.$apply();
    });

    describe('Buttons controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have radioModel of Middle', function() {
                expect(controller.radioModel).to.equal('Middle');
            });

            it('should have 5 Buttons', function() {
                expect(controller.checkModel).to.exist;
            });
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});