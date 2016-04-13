/**=========================================================
 * Module: chart.js
 * Wrapper directive for chartJS.
 * Based on https://gist.github.com/AndreasHeiberg/9837868
 =========================================================*/

(function () {
    'use strict';

    var app = angular.module('max-ui');

    function ChartJS(type) {

        var directive = {
            restrict: "A",
            scope: {
                data: "=",
                options: "=",
                id: "@",
                width: "=",
                height: "=",
                resize: "=",
                chart: "@",
                segments: "@",
                responsive: "=",
                tooltip: "=",
                legend: "="
            },
            link: link
        };

        return directive;

        ////////////////////////////////////////////

        function link($scope, $elem) {
            var ctx = $elem[0].getContext("2d");
            var autosize = false;

            $scope.size = function () {
                if ($scope.width <= 0) {
                    $elem.width($elem.parent().width());
                    ctx.canvas.width = $elem.width();
                } else {
                    ctx.canvas.width = $scope.width || ctx.canvas.width;
                    autosize = true;
                }

                if ($scope.height <= 0) {
                    $elem.height($elem.parent().height());
                    ctx.canvas.height = ctx.canvas.width / 2;
                } else {
                    ctx.canvas.height = $scope.height || ctx.canvas.height;
                    autosize = true;
                }
            };

            $scope.$watch("data", function (newVal, oldVal) {
                if (chartCreated)
                    chartCreated.destroy();

                // if data not defined, exit
                if (!newVal) {
                    return;
                }
                if ($scope.chart) {
                    type = $scope.chart;
                }

                if (autosize) {
                    $scope.size();
                    chart = new Chart(ctx);
                }

                if ($scope.responsive || $scope.resize)
                    $scope.options.responsive = true;

                if ($scope.responsive !== undefined)
                    $scope.options.responsive = $scope.responsive;

                chartCreated = chart[type]($scope.data, $scope.options);
                chartCreated.update();
                if ($scope.legend)
                    angular.element($elem[0]).parent().after(chartCreated.generateLegend());
            }, true);

            $scope.$watch("tooltip", function (newVal, oldVal) {
                if (chartCreated)
                    chartCreated.draw();
                if (newVal === undefined || !chartCreated.segments)
                    return;
                if (!isFinite(newVal) || newVal >= chartCreated.segments.length || newVal < 0)
                    return;
                var activeSegment = chartCreated.segments[newVal];
                activeSegment.save();
                activeSegment.fillColor = activeSegment.highlightColor;
                chartCreated.showTooltip([activeSegment]);
                activeSegment.restore();
            }, true);

            $scope.size();
            var chart = new Chart(ctx);
            var chartCreated;
        }

    }

    /* Aliases for various chart types */
    app.directive("chartjs", function () {
        return ChartJS();
    });
    app.directive("linechart", function () {
        return ChartJS("Line");
    });
    app.directive("barchart", function () {
        return ChartJS("Bar");
    });
    app.directive("radarchart", function () {
        return ChartJS("Radar");
    });
    app.directive("polarchart", function () {
        return ChartJS("PolarArea");
    });
    app.directive("piechart", function () {
        return ChartJS("Pie");
    });
    app.directive("doughnutchart", function () {
        return ChartJS("Doughnut");
    });
    app.directive("donutchart", function () {
        return ChartJS("Doughnut");
    });

})();
