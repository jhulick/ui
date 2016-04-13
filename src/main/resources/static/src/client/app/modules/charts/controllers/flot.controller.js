/**=========================================================
 * Module: app.charts
 * Setup options and data for flot chart directive
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.charts')
        .controller('Flot', Flot);

    Flot.$inject = ['$rootScope', 'ChartDataservice', '$timeout', 'logger', '$q'];

    function Flot($rootScope, dataservice, $timeout, logger, $q) {
        // required for inner references
        var vm = this;

        // Generate random data for realtime demo
        var data = [], totalPoints = 300;

        vm.title = 'FlotChart';

        vm.barData = [];
        vm.barStackeData = [];
        vm.splineData = [];
        vm.getAreaChart = [];
        vm.realTimeData = [];
        vm.areaData = [];
        vm.lineData =  [];
        vm.pieData = [];
        vm.donutData = [];

        activate();

        function activate() {
            var promises = [
                getBarChart(),
                getBarstackedChart(),
                getSplineChart(),
                getAreaChart(),
                getLineChart(),
                getPieChart(),
                getDonutChart(),
                update()
            ];
            return $q.all(promises).then(function() {
                logger.info('Activated FlotChart View');
            });
        }

        function getBarChart() {
            return dataservice.getBarChart().then(function(data) {
                vm.barData = data;
                return vm.barData;
            });
        }

        function getBarstackedChart() {
            return dataservice.getBarstackedChart().then(function(data) {
                vm.barStackeData = data;
                return vm.barStackeData;
            });
        }

        function getSplineChart() {
            return dataservice.getSplineChart().then(function(data) {
                vm.splineData = data;
                return vm.splineData;
            });
        }

        function getAreaChart() {
            return dataservice.getAreaChart().then(function(data) {
                vm.areaData = data;
                return vm.areaData;
            });
        }

        function getLineChart() {
            return dataservice.getLineChart().then(function(data) {
                vm.lineData = data;
                return vm.lineData;
            });
        }

        function getPieChart() {
            return dataservice.getPieChart().then(function(data) {
                vm.pieData = data;
                return vm.pieData;
            });
        }

        function getDonutChart() {
            return dataservice.getDonutChart().then(function(data) {
                vm.donutData = data;
                return vm.donutData;
            });
        }

        // BAR
        // -----------------------------------
        vm.barOptions = {
            series: {
                bars: {
                    align: 'center',
                    lineWidth: 0,
                    show: true,
                    barWidth: 0.6,
                    fill: 0.9
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function (label, x, y) {
                    return x + ' : ' + y;
                }
            },
            xaxis: {
                tickColor: '#fcfcfc',
                mode: 'categories'
            },
            yaxis: {
                position: ($rootScope.app.layout.isRTL ? 'right' : 'left'),
                tickColor: '#eee'
            },
            shadowSize: 0
        };

        // BAR STACKED
        // -----------------------------------
        vm.barStackedOptions = {
            series: {
                stack: true,
                bars: {
                    align: 'center',
                    lineWidth: 0,
                    show: true,
                    barWidth: 0.6,
                    fill: 0.9
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function (label, x, y) {
                    return x + ' : ' + y;
                }
            },
            xaxis: {
                tickColor: '#fcfcfc',
                mode: 'categories'
            },
            yaxis: {
                min: 0,
                max: 200, // optional: use it for a clear represetation
                position: ($rootScope.app.layout.isRTL ? 'right' : 'left'),
                tickColor: '#eee'
            },
            shadowSize: 0
        };

        // SPLINE
        // -----------------------------------
        vm.splineOptions = {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true,
                    radius: 4
                },
                splines: {
                    show: true,
                    tension: 0.4,
                    lineWidth: 1,
                    fill: 0.5
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function (label, x, y) {
                    return x + ' : ' + y;
                }
            },
            xaxis: {
                tickColor: '#fcfcfc',
                mode: 'categories'
            },
            yaxis: {
                min: 0,
                max: 150, // optional: use it for a clear represetation
                tickColor: '#eee',
                position: ($rootScope.app.layout.isRTL ? 'right' : 'left'),
                tickFormatter: function (v) {
                    return v/* + ' visitors'*/;
                }
            },
            shadowSize: 0
        };

        // AREA
        // -----------------------------------
        vm.areaOptions = {
            series: {
                lines: {
                    show: true,
                    fill: 0.8
                },
                points: {
                    show: true,
                    radius: 4
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function (label, x, y) {
                    return x + ' : ' + y;
                }
            },
            xaxis: {
                tickColor: '#fcfcfc',
                mode: 'categories'
            },
            yaxis: {
                min: 0,
                tickColor: '#eee',
                position: ($rootScope.app.layout.isRTL ? 'right' : 'left'),
                tickFormatter: function (v) {
                    return v + ' visitors';
                }
            },
            shadowSize: 0
        };

        // LINE
        // -----------------------------------
        vm.lineOptions = {
            series: {
                lines: {
                    show: true,
                    fill: 0.01
                },
                points: {
                    show: true,
                    radius: 4
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function (label, x, y) {
                    return x + ' : ' + y;
                }
            },
            xaxis: {
                tickColor: '#eee',
                mode: 'categories'
            },
            yaxis: {
                position: ($rootScope.app.layout.isRTL ? 'right' : 'left'),
                tickColor: '#eee'
            },
            shadowSize: 0
        };

        // PIE
        // -----------------------------------
        vm.pieOptions = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0,
                    label: {
                        show: true,
                        radius: 0.8,
                        formatter: function (label, series) {
                            return '<div class="flot-pie-label">' +
                                    //label + ' : ' +
                                Math.round(series.percent) +
                                '%</div>';
                        },
                        background: {
                            opacity: 0.8,
                            color: '#222'
                        }
                    }
                }
            }
        };

        // DONUT
        // -----------------------------------
        vm.donutOptions = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.5 // This makes the donut shape
                }
            }
        };

        // REALTIME
        // -----------------------------------
        vm.realTimeOptions = {
            series: {
                lines: {show: true, fill: true, fillColor: {colors: ['#a0e0f3', '#23b7e5']}},
                shadowSize: 0 // Drawing is faster without shadows
            },
            grid: {
                show: false,
                borderWidth: 0,
                minBorderMargin: 20,
                labelMargin: 10
            },
            xaxis: {
                tickFormatter: function () {
                    return "";
                }
            },
            yaxis: {
                min: 0,
                max: 110
            },
            legend: {
                show: true
            },
            colors: ["#23b7e5"]
        };



        function getRandomData() {
            if (data.length > 0)
                data = data.slice(1);
            // Do a random walk
            while (data.length < totalPoints) {
                var prev = data.length > 0 ? data[data.length - 1] : 50,
                    y = prev + Math.random() * 10 - 5;
                if (y < 0) {
                    y = 0;
                } else if (y > 100) {
                    y = 100;
                }
                data.push(y);
            }
            // Zip the generated y values with the x values
            var res = [];
            for (var i = 0; i < data.length; ++i) {
                res.push([i, data[i]]);
            }
            return [res];
        }

        function update() {
            vm.realTimeData = getRandomData();
            $timeout(update, 30);
        }

        // end random data generation
    }
})();

