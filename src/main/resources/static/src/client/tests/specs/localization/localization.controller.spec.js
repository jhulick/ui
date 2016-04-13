/* jshint -W117, -W030 */
describe('LocalizationController', function() {
    var controller;
    var en = mockData.getEnData();
    var $httpFlush;

    beforeEach(function() {
        bard.appModule('app.localization', 'app.core');
        bard.inject(this, '$httpBackend', '$controller', '$q', '$rootScope', '$timeout', 'logger');
    });

    beforeEach(function() {

        $httpBackend.when('GET', 'build/i18n/en.json').respond(200, en);
        $httpFlush = $httpBackend.flush;

        controller = $controller('LocalizationController');
        $rootScope.$apply();
        $httpFlush();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('LocalizationController controller', function() {
        it('should be created successfully', function() {
            expect(controller).to.be.defined;
        });
    });
});
