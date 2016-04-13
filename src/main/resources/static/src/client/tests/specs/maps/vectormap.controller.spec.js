/* jshint -W117, -W030 */
describe('VectorMap Controller', function() {
    var controller;
    var en = mockData.getEnData();
    var $httpFlush;
    var scope;

    beforeEach(function() {
        bard.appModule('app.maps', 'app.core');
        bard.inject(this, '$httpBackend', '$controller', '$q', '$rootScope');
    });

    beforeEach(function() {

        $httpBackend.when('GET', 'build/i18n/en.json').respond(200, en);
        $httpFlush = $httpBackend.flush;

        scope = $rootScope.$new();
        controller = $controller('VectorMapController', {$scope: scope});
        $rootScope.$apply();
    });

    //bard.verifyNoOutstandingHttpRequests();

    describe('VectorMap controller', function() {
        it('should be created successfully', function() {
            expect(controller).to.be.defined;
        });

        describe('data after activate', function() {

            it('should have seriesData', function() {
                expect(scope.seriesData).to.be.defined;
            });

            it('should have markersData at least 1', function() {
                expect(scope.markersData).to.have.length.above(0);
            });
        });
    });
});
