/* jshint -W117, -W030 */
describe('ChartJS Controller', function() {
    var controller;
    var en = mockData.getEnData();
    var $httpFlush;

    beforeEach(function() {
        bard.appModule('app.charts', 'max-ui');
        bard.inject(this, '$httpBackend', '$controller', '$q', '$rootScope', 'colors', 'logger');
    });

    beforeEach(function() {
        $httpBackend.when('GET', 'build/i18n/en.json').respond(200, en);
        $httpFlush = $httpBackend.flush;

        controller = $controller('ChartJSController', {colors: colors, logger: logger});
        $rootScope.$apply();
        $httpFlush()
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('ChartJSController controller', function() {
        it('should be created successfully', function() {
            expect(controller).to.be.defined;
        });

        describe('lineData after activate', function() {

            it('should have at least 1 label', function() {
                expect(controller.lineData.labels).to.have.length.above(0);
            });

            it('should have 2 datasets', function() {
                expect(controller.lineData.datasets).to.have.length(2);
            });
        });
    });
});
