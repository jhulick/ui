/* jshint -W117, -W030 */
describe('chart.dataservice', function() {
    var barChart = mockData.getBarChart();
    var barstackedChart = mockData.getBarstackedChart();
    var splineChart = mockData.getSplineChart();
    var areaChart = mockData.getAreaChart();
    var lineChart = mockData.getLineChart();
    var pieChart = mockData.getPieChart();
    var donutChart = mockData.getDonutChart();
    var en = mockData.getEnData();
    var $httpFlush;

    beforeEach(function() {
        bard.appModule('app.charts');
        bard.inject(this, '$httpBackend', 'routerHelper', '$rootScope', 'ChartDataservice');
    });

    beforeEach(function() {
        $httpBackend.when('GET', '/api/chart/bar').respond(200, barChart);
        $httpBackend.when('GET', '/api/chart/barstacked').respond(200, barstackedChart);
        $httpBackend.when('GET', '/api/chart/spline').respond(200, splineChart);
        $httpBackend.when('GET', '/api/chart/area').respond(200, areaChart);
        $httpBackend.when('GET', '/api/chart/line').respond(200, lineChart);
        $httpBackend.when('GET', '/api/chart/pie').respond(200, pieChart);
        $httpBackend.when('GET', '/api/chart/donut').respond(200, donutChart);
        $httpBackend.when('GET', 'build/i18n/en.json').respond(200, en);
        $httpFlush = $httpBackend.flush;
        $httpFlush();
    });

    bard.verifyNoOutstandingHttpRequests();

    it('should be registered', function() {
        expect(ChartDataservice).not.to.equal(null);
    });

    describe('getBarChart function', function() {
        it('should exist', function() {
            expect(ChartDataservice.getBarChart).not.to.equal(null);
        });

        it('should return 10 sales points', function(done) {
            ChartDataservice.getBarChart().then(function(data) {
                expect(data[0]["data"].length).to.equal(10);
            }).then(done, done);
            $httpFlush();
        });

        it('should contain label Sales', function(done) {
            ChartDataservice.getBarChart().then(function(data) {
                expect(data[0].label).to.equal('Sales');
            }).then(done, done);
            $httpFlush();
        });
    });

    describe('barstackedChart function', function() {
        it('should exist', function() {
            expect(ChartDataservice.getBarstackedChart).not.to.equal(null);
        });

        it('jan should have 56 tweets', function(done) {
            ChartDataservice.getBarstackedChart().then(function(data) {
                expect(data[0]["data"][0][1]).to.equal(56);
            }).then(done, done);
            $httpFlush();
        });

        it('should contain label Tweets', function(done) {
            ChartDataservice.getBarstackedChart().then(function(data) {
                expect(data[0].label).to.equal('Tweets');
            }).then(done, done);
            $httpFlush();
        });
    });

    describe('splineChart function', function() {
        it('should exist', function() {
            expect(ChartDataservice.getSplineChart).not.to.equal(null);
        });

        it('jan should have 15 entries', function(done) {
            ChartDataservice.getSplineChart().then(function(data) {
                expect(data[0]["data"].length).to.equal(15);
            }).then(done, done);
            $httpFlush();
        });

        it('should contain label Home', function(done) {
            ChartDataservice.getSplineChart().then(function(data) {
                expect(data[0].label).to.equal('Home');
            }).then(done, done);
            $httpFlush();
        });
    });

    describe('areaChart function', function() {
        it('should exist', function() {
            expect(ChartDataservice.getAreaChart).not.to.equal(null);
        });

        it('jan should have 7 entries', function(done) {
            ChartDataservice.getAreaChart().then(function(data) {
                expect(data[0]["data"].length).to.equal(7);
            }).then(done, done);
            $httpFlush();
        });

        it('should contain label Uniques', function(done) {
            ChartDataservice.getAreaChart().then(function(data) {
                expect(data[0].label).to.equal('Uniques');
            }).then(done, done);
            $httpFlush();
        });
    });

    describe('lineChart function', function() {
        it('should exist', function() {
            expect(ChartDataservice.getLineChart).not.to.equal(null);
        });

        it('should have 9 entries', function(done) {
            ChartDataservice.getLineChart().then(function(data) {
                expect(data[0]["data"].length).to.equal(9);
            }).then(done, done);
            $httpFlush();
        });

        it('should contain labels Complete, In Progress and Cancelled', function(done) {
            ChartDataservice.getLineChart().then(function(data) {
                expect(data[0].label).to.equal('Complete');
                expect(data[1].label).to.equal('In Progress');
                expect(data[2].label).to.equal('Cancelled');
            }).then(done, done);
            $httpFlush();
        });
    });

    describe('pieChart function', function() {
        it('should exist', function() {
            expect(ChartDataservice.getPieChart).not.to.equal(null);
        });

        it('jan should have 5 entries', function(done) {
            ChartDataservice.getPieChart().then(function(data) {
                expect(data.length).to.equal(5);
            }).then(done, done);
            $httpFlush();
        });

        it('should contain labels jQuery, CSS, LESS, SASS and Jade', function(done) {
            ChartDataservice.getPieChart().then(function(data) {
                expect(data[0].label).to.equal('jQuery');
                expect(data[1].label).to.equal('CSS');
                expect(data[2].label).to.equal('LESS');
                expect(data[3].label).to.equal('SASS');
                expect(data[4].label).to.equal('Jade');
            }).then(done, done);
            $httpFlush();
        });
    });

    describe('donutChart function', function() {
        it('should exist', function() {
            expect(ChartDataservice.getDonutChart).not.to.equal(null);
        });

        it('jan should have 5 entries', function(done) {
            ChartDataservice.getDonutChart().then(function(data) {
                expect(data.length).to.equal(5);
            }).then(done, done);
            $httpFlush();
        });

        it('should contain labels Coffee, CSS, LESS, Jade and AngularJS', function(done) {
            ChartDataservice.getDonutChart().then(function(data) {
                expect(data[0].label).to.equal('Coffee');
                expect(data[1].label).to.equal('CSS');
                expect(data[2].label).to.equal('LESS');
                expect(data[3].label).to.equal('Jade');
                expect(data[4].label).to.equal('AngularJS');
            }).then(done, done);
            $httpFlush();
        });
    });

    describe('ready function', function() {
        it('should exist', function() {
            expect(ChartDataservice.ready).to.be.defined;
        });

        it('should return a resolved promise with the dataservice itself', function(done) {
            ChartDataservice.ready().then(function(data) {
                expect(data).to.equal(ChartDataservice);
            })
                .then(done, done);
            $rootScope.$apply(); // no $http so just flush
        });
    });
});
