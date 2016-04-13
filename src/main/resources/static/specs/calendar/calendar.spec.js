describe('app.calendar', function() {
    var controller;

    beforeEach(function() {
        module('app.calendar', function($provide) {
            specHelper.fakeStateProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function($controller, $q, $rootScope, dataservice) {});
    });

    beforeEach(function () {
        controller = $controller('CalendarController');
        $rootScope.$apply();
    });

    describe('Calendar controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have 6 events', function() {
                expect(controller.demoEvents.length).to.equal(6);
            });

        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});
