/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/

/**
 * @ngdoc constant
 * @name max-ui
 * @description Defines the AngularJs application constants
 */
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('toastr', window.toastr)
        .constant('APP_COLORS', {
            'primary': '#5d9cec',
            'success': '#27c24c',
            'info': '#23b7e5',
            'warning': '#ff902b',
            'danger': '#f05050',
            'inverse': '#131e26',
            'green': '#37bc9b',
            'pink': '#f532e5',
            'purple': '#7266ba',
            'dark': '#3a3f51',
            'yellow': '#fad732',
            'gray-darker': '#232735',
            'gray-dark': '#3a3f51',
            'gray': '#dde6e9',
            'gray-light': '#e4eaec',
            'gray-lighter': '#edf1f2'
        })
        .constant('APP_MEDIAQUERY', {
            'desktopLG': 1200,
            'desktop': 992,
            'tablet': 768,
            'mobile': 480
        })
        .constant('APP_REQUIRES', {
            // jQuery based and standalone scripts
            scripts: {
                'whirl': ['build/vendor/whirl/dist/whirl.css'],
                'classyloader': ['build/vendor/jquery-classyloader/js/jquery.classyloader.min.js'],
                'animo': ['build/vendor/animo.js/animo.js'],
                'fastclick': ['build/vendor/fastclick/lib/fastclick.js'],
                'modernizr': ['build/vendor/modernizr/modernizr.js'],
                'animate': ['build/vendor/animate.css/animate.min.css'],
                'icons': [
                    'build/vendor/fontawesome/css/font-awesome.min.css',
                    'build/vendor/simple-line-icons/css/simple-line-icons.css'
                ],
                'sparklines': ['build/vendor/sparklines/jquery.sparkline.min.js'],
                'slider': [
                    'build/vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
                    'build/vendor/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css'
                ],
                'wysiwyg': ['build/vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                    'build/vendor/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
                'slimscroll': ['build/vendor/slimScroll/jquery.slimscroll.min.js'],
                'screenfull': ['build/vendor/screenfull/dist/screenfull.js'],
                'vector-map': [
                    'build/vendor/ika.jvectormap/jquery-jvectormap-2.0.2.min.js',
                    'build/vendor/ika.jvectormap/jquery-jvectormap-2.0.2.css'
                ],
                'loadGoogleMapsJS': ['build/vendor/gmap/load-google-maps.js'],
                'google-map': ['build/vendor/jQuery-gMap/jquery.gmap.min.js'],
                'flot-chart': ['build/vendor/Flot/jquery.flot.js'],
                'flot-chart-plugins': [
                    'build/vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
                    'build/vendor/Flot/jquery.flot.resize.js',
                    'build/vendor/Flot/jquery.flot.pie.js',
                    'build/vendor/Flot/jquery.flot.time.js',
                    'build/vendor/Flot/jquery.flot.categories.js',
                    'build/vendor/flot-spline/js/jquery.flot.spline.min.js'],
                // jquery core and widgets
                'jquery-ui': [
                    'build/vendor/jquery-ui/ui/core.js',
                    'build/vendor/jquery-ui/ui/widget.js'],
                // loads only jquery required modules and touch support
                'jquery-ui-widgets': [
                    'build/vendor/jquery-ui/ui/core.js',
                    'build/vendor/jquery-ui/ui/widget.js',
                    'build/vendor/jquery-ui/ui/mouse.js',
                    'build/vendor/jquery-ui/ui/draggable.js',
                    'build/vendor/jquery-ui/ui/droppable.js',
                    'build/vendor/jquery-ui/ui/sortable.js',
                    'build/vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'
                ],
                'moment': ['build/vendor/moment/min/moment-with-locales.min.js'],
                'inputmask': ['build/vendor/jquery.inputmask/dist/jquery.inputmask.bundle.min.js'],
                'flatdoc': ['build/vendor/flatdoc/flatdoc.js'],
                'codemirror': [
                    'build/vendor/codemirror/lib/codemirror.js',
                    'build/vendor/codemirror/lib/codemirror.css'
                ],
                // modes for common web files
                'codemirror-modes-web': [
                    'build/vendor/codemirror/mode/javascript/javascript.js',
                    'build/vendor/codemirror/mode/xml/xml.js',
                    'build/vendor/codemirror/mode/htmlmixed/htmlmixed.js',
                    'build/vendor/codemirror/mode/css/css.js'
                ],
                'taginput': [
                    'build/vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
                    'build/vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js'
                ],
                'filestyle': ['build/vendor/bootstrap-filestyle/src/bootstrap-filestyle.js'],
                'parsley': ['build/vendor/parsleyjs/dist/parsley.min.js'],
                'datatables': [
                    'build/vendor/datatables/media/js/jquery.dataTables.min.js',
                    'build/vendor/datatable-bootstrap/css/dataTables.bootstrap.css'
                ],
                'datatables-plugins': [
                    'build/vendor/datatable-bootstrap/js/dataTables.bootstrap.js',
                    'build/vendor/datatable-bootstrap/js/dataTables.bootstrapPagination.js',
                    'build/vendor/datatables-colvis/js/dataTables.colVis.js',
                    'build/vendor/datatables-colvis/css/dataTables.colVis.css'],
                'fullcalendar': [
                    'build/vendor/fullcalendar/dist/fullcalendar.min.js',
                    'build/vendor/fullcalendar/dist/fullcalendar.css'
                ],
                'gcal': ['build/vendor/fullcalendar/dist/gcal.js'],
                'nestable': ['build/vendor/nestable/jquery.nestable.js'],
                'chartjs': ['build/vendor/Chart.js/Chart.js']
            },
            // Angular based script (use the right module name)
            modules: [
                {
                    name: 'toaster',
                    files: [
                        'build/vendor/angularjs-toaster/toaster.js',
                        'build/vendor/angularjs-toaster/toaster.css'
                    ]
                },
                {
                    name: 'localytics.directives',
                    files: [
                        'build/vendor/chosen_v1.2.0/chosen.jquery.min.js',
                        'build/vendor/chosen_v1.2.0/chosen.min.css',
                        'build/vendor/angular-chosen-localytics/chosen.js'
                    ]
                },
                {
                    name: 'ngDialog',
                    files: [
                        'build/vendor/ngDialog/js/ngDialog.min.js',
                        'build/vendor/ngDialog/css/ngDialog.min.css',
                        'build/vendor/ngDialog/css/ngDialog-theme-default.min.css'
                    ]
                },
                {
                    name: 'ngWig',
                    files: ['build/vendor/ngWig/dist/ng-wig.min.js']},
                {
                    name: 'ngTable',
                    files: [
                        'build/vendor/ng-table/dist/ng-table.min.js',
                        'build/vendor/ng-table/dist/ng-table.min.css'
                    ]
                },
                {
                    name: 'ngTableExport',
                    files: ['build/vendor/ng-table-export/ng-table-export.js']
                },
                {
                    name: 'angularBootstrapNavTree',
                    files: [
                        'build/vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                        'build/vendor/angular-bootstrap-nav-tree/dist/abn_tree.css'
                    ]
                },
                {
                    name: 'htmlSortable',
                    files: [
                        'build/vendor/html.sortable/dist/html.sortable.js',
                        'build/vendor/html.sortable/dist/html.sortable.angular.js'
                    ]
                },
                {
                    name: 'xeditable',
                    files: [
                        'build/vendor/angular-xeditable/dist/js/xeditable.js',
                        'build/vendor/angular-xeditable/dist/css/xeditable.css'
                    ]
                },
                {
                    name: 'angularFileUpload',
                    files: ['build/vendor/angular-file-upload/angular-file-upload.js']
                },
                {
                    name: 'ngImgCrop',
                    files: [
                        'build/vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
                        'build/vendor/ng-img-crop/compile/unminified/ng-img-crop.css'
                    ]
                },
                {
                    name: 'ui.select',
                    files: [
                        'build/vendor/angular-ui-select/dist/select.js',
                        'build/vendor/angular-ui-select/dist/select.css'
                    ]
                },
                {
                    name: 'ui.codemirror',
                    files: ['build/vendor/angular-ui-codemirror/ui-codemirror.js']},
                {
                    name: 'angular-carousel',
                    files: [
                        'build/vendor/angular-carousel/dist/angular-carousel.css',
                        'build/vendor/angular-carousel/dist/angular-carousel.js'
                    ]
                },
                {
                    name: 'ngGrid',
                    files: [
                        'build/vendor/ng-grid/build/ng-grid.min.js',
                        'build/vendor/ng-grid/ng-grid.css'
                    ]
                },
                {
                    name: 'infinite-scroll',
                    files: ['build/vendor/ngInfiniteScroll/build/ng-infinite-scroll.js']
                }
            ]
        })
})();
