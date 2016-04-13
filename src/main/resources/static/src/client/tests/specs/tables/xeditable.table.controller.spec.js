/* jshint -W117, -W030 */
describe('app.tables', function() {
    var controller;
    var scope;
    var en = mockData.getEnData();

    beforeEach(function() {
        bard.appModule('app.tables', 'app.core');
        bard.inject(this, '$httpBackend', '$controller', '$filter', '$log', '$q', '$rootScope', 'logger', 'xEditableTableDataService');
    });

    beforeEach(function() {
        //sinon.stub(ngTableDataService, 'getData').returns($q.when(tableData));
        $httpBackend.when('GET', 'build/i18n/en.json').respond(200, en);
        $httpFlush = $httpBackend.flush;

        scope = $rootScope.$new();
        controller = $controller('TablexEditableController', {$scope: scope, $q: $q, logger: logger});
        $rootScope.$apply();
        $httpFlush();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('TablexEditableController controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });
    });
});
