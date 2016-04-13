describe('app.carousel', function() {
    var controller;

    beforeEach(function() {
        module('app.carousel', function($provide) {
            specHelper.fakeStateProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function($controller, $q, $rootScope, dataservice) {});
    });

    beforeEach(function () {
        controller = $controller('AngularCarouselController');
        $rootScope.$apply();
    });

    describe('Carousel controller', function() {
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
