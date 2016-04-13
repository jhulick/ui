/* jshint -W117, -W030 */
describe('app.tables', function() {
    var controller;
    var scope;
    var en = mockData.getEnData();

    beforeEach(function() {
        bard.appModule('app.tables', 'app.core');
        bard.inject(this, '$httpBackend', '$controller', '$timeout', '$log', '$q', '$rootScope', 'logger', '$http');
    });

    beforeEach(function() {
        $httpBackend.when('GET', 'build/i18n/en.json').respond(200, en);
        $httpFlush = $httpBackend.flush;

        scope = $rootScope.$new();
        controller = $controller('NGGridController', {$scope: scope, $http: $http, $timeout: $timeout, logger: logger});
        $rootScope.$apply();
        $httpFlush();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('NGGridController controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

    });
});
