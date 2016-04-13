/* jshint -W117, -W030 */
describe('xeditable.dataservice', function() {
    var tableData = mockData.getMockXeditableTable();
    var en = mockData.getEnData();
    var $httpFlush;

    beforeEach(function() {
        bard.appModule('app.tables', 'app.core');
        bard.inject(this, '$httpBackend', '$http', '$location', '$q', 'exception', 'logger', '$timeout', 'routerHelper', '$rootScope', 'xEditableTableDataService');
    });

    beforeEach(function() {
        $httpBackend.when('GET', '/api/xeditable-groups').respond(200, tableData);
        $httpBackend.when('GET', 'build/i18n/en.json').respond(200, en);

        $httpFlush = $httpBackend.flush;
        $httpFlush();
    });

    bard.verifyNoOutstandingHttpRequests();

    it('should be registered', function() {
        expect(xEditableTableDataService).not.to.equal(null);
    });

    describe('getData function', function() {
        it('should exist', function() {
            expect(xEditableTableDataService.getData).not.to.equal(null);
        });

        it('should return length of 4', function(done) {
            xEditableTableDataService.getData().then(function(data) {
                expect(data.length).to.equal(4);
            }).then(done, done);
            $httpFlush();
        });

        it('should contain user', function(done) {
            xEditableTableDataService.getData().then(function(data) {
                expect(data[0]["text"]).to.equal("user");
            }).then(done, done);
            $httpFlush();
        });
    });

    describe('ready function', function() {
        it('should exist', function() {
            expect(xEditableTableDataService.ready).to.be.defined;
        });

        it('should return a resolved promise with the xEditableTableDataService itself', function(done) {
            xEditableTableDataService.ready().then(function(data) {
                expect(data).to.equal(xEditableTableDataService);
            })
                .then(done, done);
            $rootScope.$apply(); // no $http so just flush
        });
    });
});
