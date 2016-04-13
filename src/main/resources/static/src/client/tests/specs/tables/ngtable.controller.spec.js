/* jshint -W117, -W030 */
describe('app.tables', function() {
    var controller;
    var scope;
    var en = mockData.getEnData();
    var tableData = mockData.getMockNgTable();

    beforeEach(function() {
        bard.appModule('app.tables', 'app.core', 'ngTable');
        bard.inject(this, '$httpBackend', '$controller', '$filter', '$log', '$q', '$rootScope', '$resource', '$timeout', 'logger', 'ngTableDataService');
    });

    beforeEach(function() {
        sinon.stub(ngTableDataService, 'getData').returns($q.when(tableData));
        $httpBackend.when('GET', 'build/i18n/en.json').respond(200, en);
        $httpFlush = $httpBackend.flush;

        scope = $rootScope.$new();
        controller = $controller('NGTableCtrl', {$scope: scope, $q: $q, $timeout: $timeout, logger: logger});
        $rootScope.$apply();
    });

    //bard.verifyNoOutstandingHttpRequests();

    describe('NGTableCtrl controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            //it('should have called ngTableDataService.getData 1 time', function () {
            //    expect(ngTableDataService.getData).to.have.been.calledOnce;
            //});

            it('should have title of NGTable', function() {
                expect(controller.title).to.equal('NGTable');
            });

            it('should have 17 records', function() {
                expect(controller.data).to.have.length(17);
            });

            it('should have logged "Activated"', function() {
                expect($log.info.logs).to.match(/Activated/);
            });
        });
    });
});
