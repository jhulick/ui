/* jshint -W117, -W030 */
describe('Flot Controller', function() {
    var controller;
    var barChart = mockData.getBarChart();
    var barstackedChart = mockData.getBarstackedChart();
    var splineChart = mockData.getSplineChart();
    var areaChart = mockData.getAreaChart();
    var lineChart = mockData.getLineChart();
    var pieChart = mockData.getPieChart();
    var donutChart = mockData.getDonutChart();
    var en = mockData.getEnData();
    var $httpFlush;
    var scope;

    beforeEach(function() {
        bard.appModule('app.charts');
        bard.inject(this, '$httpBackend', '$controller', '$q', '$rootScope', 'ChartDataservice');
    });

    beforeEach(function() {
        sinon.stub(ChartDataservice, 'getBarChart').
            returns($q.when(mockData.getBarChart()));

        sinon.stub(ChartDataservice, 'getBarstackedChart').
            returns($q.when(mockData.getBarstackedChart()));

        sinon.stub(ChartDataservice, 'getSplineChart').
            returns($q.when(mockData.getSplineChart()));

        sinon.stub(ChartDataservice, 'getAreaChart').
            returns($q.when(mockData.getAreaChart()));

        sinon.stub(ChartDataservice, 'getLineChart').
            returns($q.when(mockData.getLineChart()));

        sinon.stub(ChartDataservice, 'getPieChart').
            returns($q.when(mockData.getPieChart()));

        sinon.stub(ChartDataservice, 'getDonutChart').
            returns($q.when(mockData.getDonutChart()));

        $httpBackend.when('GET', '/api/chart/bar').respond(200, barChart);
        $httpBackend.when('GET', '/api/chart/barstacked').respond(200, barstackedChart);
        $httpBackend.when('GET', '/api/chart/spline').respond(200, splineChart);
        $httpBackend.when('GET', '/api/chart/area').respond(200, areaChart);
        $httpBackend.when('GET', '/api/chart/line').respond(200, lineChart);
        $httpBackend.when('GET', '/api/chart/pie').respond(200, pieChart);
        $httpBackend.when('GET', '/api/chart/donut').respond(200, donutChart);
        $httpBackend.when('GET', 'build/i18n/en.json').respond(200, en);
        $httpFlush = $httpBackend.flush;

        scope = $rootScope.$new();
        $rootScope.app = {
            layout: {
                isRTL: false
            }
        };

        controller = $controller('Flot', {$scope: scope});
        $rootScope.$apply();
    });

    //bard.verifyNoOutstandingHttpRequests();

    describe('FlotChart controller', function() {
        it('should be created successfully', function() {
            expect(controller).to.be.defined;
        });

        describe('barData after activate', function() {

            describe('should have called ChartDataservice.getBarChart', function() {
                it('1 time', function() {
                    expect(ChartDataservice.getBarChart).to.have.been.calledOnce;
                });
            });

            describe('should have called ChartDataservice.getBarstackedChart', function() {
                it('1 time', function() {
                    expect(ChartDataservice.getBarstackedChart).to.have.been.calledOnce;
                });
            });

            describe('should have called ChartDataservice.getSplineChart', function() {
                it('1 time', function() {
                    expect(ChartDataservice.getSplineChart).to.have.been.calledOnce;
                });
            });

            describe('should have called ChartDataservice.getAreaChart', function() {
                it('1 time', function() {
                    expect(ChartDataservice.getAreaChart).to.have.been.calledOnce;
                });
            });

            describe('should have called ChartDataservice.getLineChart', function() {
                it('1 time', function() {
                    expect(ChartDataservice.getLineChart).to.have.been.calledOnce;
                });
            });

            describe('should have called ChartDataservice.getPieChart', function() {
                it('1 time', function() {
                    expect(ChartDataservice.getPieChart).to.have.been.calledOnce;
                });
            });

            describe('should have called ChartDataservice.getDonutChart', function() {
                it('1 time', function() {
                    expect(ChartDataservice.getDonutChart).to.have.been.calledOnce;
                });
            });

            it('should have title of FlotChart', function() {
                expect(controller.title).to.equal('FlotChart');
            });

            //it('should have totalPoints equal to 300', function() {
            //    expect(controller.totalPoints).to.equal('300');
            //});

            it('should have barData at least 1', function() {
                expect(controller.barData).to.have.length.above(0);
            });

            it('should have barStackeData at least 1', function() {
                expect(controller.barStackeData).to.have.length.above(0);
            });

            it('should have splineData at least 1', function() {
                expect(controller.splineData).to.have.length.above(0);
            });

            it('should have areaData at least 1', function() {
                expect(controller.areaData).to.have.length.above(0);
            });

            it('should have lineData at least 1', function() {
                expect(controller.lineData).to.have.length.above(0);
            });

            it('should have pieData at least 1', function() {
                expect(controller.pieData).to.have.length.above(0);
            });

            it('should have donutData at least 1', function() {
                expect(controller.donutData).to.have.length.above(0);
            });

            it('should have realTimeData at least 1', function() {
                expect(controller.realTimeData).to.have.length.above(0);
            });

            it('should have barOptions.series.bars.align to equal center', function() {
                expect(controller.barOptions.series.bars.align).to.equal('center');
            });
        });
    });
});
