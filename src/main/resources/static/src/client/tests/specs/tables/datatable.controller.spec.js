/* jshint -W117, -W030 */
describe('app.tables', function() {
    var controller;
    var scope;
    var en = mockData.getEnData();

    beforeEach(function() {
        bard.appModule('app.tables', 'app.core');
        bard.inject(this, '$httpBackend', '$controller', '$timeout',  '$q', '$rootScope', 'logger');
    });

    beforeEach(function() {
        $httpBackend.when('GET', 'build/i18n/en.json').respond(200, en);
        $httpFlush = $httpBackend.flush;

        scope = $rootScope.$new();
        controller = $controller('DataTableController', {$scope: scope, $q: $q, $timeout: $timeout, logger: logger});
        $rootScope.$apply();
        $httpFlush();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('DataTable controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {

            //it('should have logged "Activated"', function() {
            //    expect($log.info.logs).to.match(/Activated/);
            //});

            it('should have dtInstance1 instance', function() {
                expect(controller.dtInstance1).to.be.defined;
            });

            it('should have dtInstance2 instance', function() {
                expect(controller.dtInstance2).to.be.defined;
            });

            it('should have dtInstance3 instance', function() {
                expect(controller.dtInstance3).to.be.defined;
            });

            it('should have dtInstance4 instance', function() {
                expect(controller.dtInstance4).to.be.defined;
            });

        });
    });
});
