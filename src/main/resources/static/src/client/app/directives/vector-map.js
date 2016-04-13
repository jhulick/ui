/**=========================================================
 * Module: vector-map.js.js
 * Init jQuery Vector Map plugin
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('max-ui')
        .directive('vectorMap', VectorMap);

    VectorMap.$inject = ['vectorMap'];

    function VectorMap(vectorMap) {

        var defaultColors = {
            markerColor: '#23b7e5',      // the marker points
            bgColor: 'transparent',  // the background
            scaleColors: ['#878c9a'],    // the color of the region in the serie
            regionFill: '#bbbec6'       // the base region color
        };

        var directive = {
            restrict: 'EA',
            link: link
        };
        return directive;

        /////////////////////////////////////

        function link(scope, element, attrs) {
            var mapHeight = attrs.height || '300',
                options = {
                    markerColor: attrs.markerColor || defaultColors.markerColor,
                    bgColor: attrs.bgColor || defaultColors.bgColor,
                    scale: attrs.scale || 1,
                    scaleColors: attrs.scaleColors || defaultColors.scaleColors,
                    regionFill: attrs.regionFill || defaultColors.regionFill,
                    mapName: attrs.mapName || 'world_mill_en'
                };

            element.css('height', mapHeight);
            vectorMap.init(element, options, scope.seriesData, scope.markersData);
        }
    }

})();
