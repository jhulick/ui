/* jshint -W117, -W030 */
describe('GMapController', function() {
    var controller;
    var en = mockData.getEnData();
    var $httpFlush;

    beforeEach(function() {
        bard.appModule('app.maps', 'app.core');
        bard.inject(this, '$httpBackend', '$controller', '$q', '$rootScope', '$timeout', 'logger');
    });

    beforeEach(function() {

        $httpBackend.when('GET', 'build/i18n/en.json').respond(200, en);
        $httpFlush = $httpBackend.flush;

        controller = $controller('GMapController');
        $rootScope.$apply();
        $httpFlush();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('GMapController controller', function() {
        it('should be created successfully', function() {
            expect(controller).to.be.defined;
        });

        describe('data after activate', function() {

            it('should have mapAddress 276 N TUSTIN ST, ORANGE, CA 92867', function() {
                expect(controller.mapAddress).to.equal('');
            });

            it('should have mapLoading false', function() {
                expect(controller.mapLoading).to.equal(true);
            });
        });
    });
});
