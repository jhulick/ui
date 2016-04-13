/* jshint -W117, -W030 */
describe('ngtables.dataservice', function() {
    var ngData = mockData.getMockNgTable();
    var en = mockData.getEnData();
    var $httpFlush;

    var tableParams;

    var data = [
        {name: "Moroni", age: 50, money: -10},
        {name: "Tiancum", age: 43, money: 120},
        {name: "Jacob", age: 27, money: 5.5},
        {name: "Nephi", age: 29, money: -54},
        {name: "Enos", age: 34, money: 110},
        {name: "Tiancum", age: 43, money: 1000},
        {name: "Jacob", age: 27, money: -201},
        {name: "Nephi", age: 29, money: 100},
        {name: "Enos", age: 34, money: -52.5},
        {name: "Tiancum", age: 43, money: 52.1},
        {name: "Jacob", age: 27, money: 110},
        {name: "Nephi", age: 29, money: -55},
        {name: "Enos", age: 34, money: 551},
        {name: "Tiancum", age: 43, money: -1410},
        {name: "Jacob", age: 27, money: 410},
        {name: "Nephi", age: 29, money: 100},
        {name: "Enos", age: 34, money: -100}
    ];

    beforeEach(function() {
        bard.appModule('app.tables', 'app.core');
        bard.inject(this, '$httpBackend', '$http', '$location', '$q', '$log', 'exception', 'logger', '$timeout', 'routerHelper', '$rootScope', 'ngTableDataService');

        tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            filter: {
                name: '',
                age: ''
                // name: 'M'       // initial filter
            }
        }, {
            total: data.length, // length of data
            getData: function ($defer, params) {
                // use build-in angular filter
                var orderedData = params.filter() ?
                    $filter('filter')(data, params.filter()) : data;

                vm.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(vm.users);
            }
        });
    });

    beforeEach(function() {
        $httpBackend.when('GET', '/api/table-data').respond(200, ngData);
        $httpBackend.when('GET', 'build/i18n/en.json').respond(200, en);

        $httpFlush = $httpBackend.flush;
        //$httpFlush();
    });

    //beforeEach(function() {
    //    sinon.stub(ngTableDataService, 'getData').
    //        returns($q.when(mockData.getMockNgTable()));
    //});

    //bard.verifyNoOutstandingHttpRequests();

    it('should be registered', function() {
        expect(ngTableDataService).not.to.equal(null);
    });

    describe('getData function', function() {
        it('should exist', function() {
            expect(ngTableDataService.getData).not.to.equal(null);
        });

        //it('should return total of 15', function(done) {
        //    ngTableDataService.getData(tableParams).then(function(data) {
        //        expect(data["total"]).to.equal(15);
        //    }).then(done, done);
        //    $httpFlush();
        //});
        //
        //it('should contain 15 Sales', function(done) {
        //    ngTableDataService.getData().then(function(data) {
        //        expect(data["result"].length).to.equal(15);
        //    }).then(done, done);
        //    $httpFlush();
        //});
    });

    describe('ready function', function() {
        it('should exist', function() {
            expect(ngTableDataService.ready).to.be.defined;
        });

        it('should return a resolved promise with the ngTableDataService itself', function(done) {
            ngTableDataService.ready().then(function(data) {
                expect(data).to.equal(ngTableDataService);
            })
                .then(done, done);
            $rootScope.$apply(); // no $http so just flush
        });
    });
});



/**
 * @ngdoc service
 * @name ngTable.factory:NgTableParams
 * @description Parameters manager for ngTable
 */

function ngTableParams($q, $log) {

    var ngTableDefaults = {
        params: {},
        settings: {}
    };
    var isNumber = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    var NgTableParams = function(baseParameters, baseSettings) {
        var self = this,
            log = function() {
                if (settings.debugMode && $log.debug) {
                    $log.debug.apply(this, arguments);
                }
            };

        this.data = [];

        /**
         * @ngdoc method
         * @name ngTable.factory:NgTableParams#parameters
         * @methodOf ngTable.factory:NgTableParams
         * @description Set new parameters or get current parameters
         *
         * @param {string} newParameters      New parameters
         * @param {string} parseParamsFromUrl Flag if parse parameters like in url
         * @returns {Object} Current parameters or `this`
         */
        this.parameters = function(newParameters, parseParamsFromUrl) {
            parseParamsFromUrl = parseParamsFromUrl || false;
            if (angular.isDefined(newParameters)) {
                for (var key in newParameters) {
                    var value = newParameters[key];
                    if (parseParamsFromUrl && key.indexOf('[') >= 0) {
                        var keys = key.split(/\[(.*)\]/).reverse()
                        var lastKey = '';
                        for (var i = 0, len = keys.length; i < len; i++) {
                            var name = keys[i];
                            if (name !== '') {
                                var v = value;
                                value = {};
                                value[lastKey = name] = (isNumber(v) ? parseFloat(v) : v);
                            }
                        }
                        if (lastKey === 'sorting') {
                            params[lastKey] = {};
                        }
                        params[lastKey] = angular.extend(params[lastKey] || {}, value[lastKey]);
                    } else {
                        params[key] = (isNumber(newParameters[key]) ? parseFloat(newParameters[key]) : newParameters[key]);
                    }
                }
                log('ngTable: set parameters', params);
                return this;
            }
            return params;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:NgTableParams#settings
         * @methodOf ngTable.factory:NgTableParams
         * @description Set new settings for table
         *
         * @param {string} newSettings New settings or undefined
         * @returns {Object} Current settings or `this`
         */
        this.settings = function(newSettings) {
            if (angular.isDefined(newSettings)) {
                if (angular.isArray(newSettings.data)) {
                    //auto-set the total from passed in data
                    newSettings.total = newSettings.data.length;
                }
                settings = angular.extend(settings, newSettings);
                log('ngTable: set settings', settings);
                return this;
            }
            return settings;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:NgTableParams#page
         * @methodOf ngTable.factory:NgTableParams
         * @description If parameter page not set return current page else set current page
         *
         * @param {string} page Page number
         * @returns {Object|Number} Current page or `this`
         */
        this.page = function(page) {
            return angular.isDefined(page) ? this.parameters({
                'page': page
            }) : params.page;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:NgTableParams#total
         * @methodOf ngTable.factory:NgTableParams
         * @description If parameter total not set return current quantity else set quantity
         *
         * @param {string} total Total quantity of items
         * @returns {Object|Number} Current page or `this`
         */
        this.total = function(total) {
            return angular.isDefined(total) ? this.settings({
                'total': total
            }) : settings.total;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:NgTableParams#count
         * @methodOf ngTable.factory:NgTableParams
         * @description If parameter count not set return current count per page else set count per page
         *
         * @param {string} count Count per number
         * @returns {Object|Number} Count per page or `this`
         */
        this.count = function(count) {
            // reset to first page because can be blank page
            return angular.isDefined(count) ? this.parameters({
                'count': count,
                'page': 1
            }) : params.count;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:NgTableParams#filter
         * @methodOf ngTable.factory:NgTableParams
         * @description If parameter page not set return current filter else set current filter
         *
         * @param {string} filter New filter
         * @returns {Object} Current filter or `this`
         */
        this.filter = function(filter) {
            return angular.isDefined(filter) ? this.parameters({
                'filter': filter,
                'page': 1
            }) : params.filter;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:NgTableParams#sorting
         * @methodOf ngTable.factory:NgTableParams
         * @description If 'sorting' parameter is not set, return current sorting. Otherwise set current sorting.
         *
         * @param {string} sorting New sorting
         * @returns {Object} Current sorting or `this`
         */
        this.sorting = function(sorting) {
            if (arguments.length == 2) {
                var sortArray = {};
                sortArray[sorting] = arguments[1];
                this.parameters({
                    'sorting': sortArray
                });
                return this;
            }
            return angular.isDefined(sorting) ? this.parameters({
                'sorting': sorting
            }) : params.sorting;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:NgTableParams#isSortBy
         * @methodOf ngTable.factory:NgTableParams
         * @description Checks sort field
         *
         * @param {string} field     Field name
         * @param {string} direction Direction of sorting 'asc' or 'desc'
         * @returns {Array} Return true if field sorted by direction
         */
        this.isSortBy = function(field, direction) {
            return angular.isDefined(params.sorting[field]) && angular.equals(params.sorting[field], direction);
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:NgTableParams#orderBy
         * @methodOf ngTable.factory:NgTableParams
         * @description Return object of sorting parameters for angular filter
         *
         * @returns {Array} Array like: [ '-name', '+age' ]
         */
        this.orderBy = function() {
            var sorting = [];
            for (var column in params.sorting) {
                sorting.push((params.sorting[column] === "asc" ? "+" : "-") + column);
            }
            return sorting;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:NgTableParams#getData
         * @methodOf ngTable.factory:NgTableParams
         * @description Called when updated some of parameters for get new data
         *
         * @param {Object} $defer promise object
         * @param {Object} params New parameters
         */
        this.getData = function($defer, params) {
            if (angular.isArray(this.data) && angular.isObject(params)) {
                $defer.resolve(this.data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            } else {
                $defer.resolve([]);
            }
            return $defer.promise;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:NgTableParams#getGroups
         * @methodOf ngTable.factory:NgTableParams
         * @description Return groups for table grouping
         */
        this.getGroups = function($defer, column) {
            var defer = $q.defer();

            defer.promise.then(function(data) {
                var groups = {};
                angular.forEach(data, function(item) {
                    var groupName = angular.isFunction(column) ? column(item) : item[column];

                    groups[groupName] = groups[groupName] || {
                        data: []
                    };
                    groups[groupName]['value'] = groupName;
                    groups[groupName].data.push(item);
                });
                var result = [];
                for (var i in groups) {
                    result.push(groups[i]);
                }
                log('ngTable: refresh groups', result);
                $defer.resolve(result);
            });
            return this.getData(defer, self);
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:NgTableParams#generatePagesArray
         * @methodOf ngTable.factory:NgTableParams
         * @description Generate array of pages
         *
         * @param {boolean} currentPage which page must be active
         * @param {boolean} totalItems  Total quantity of items
         * @param {boolean} pageSize    Quantity of items on page
         * @returns {Array} Array of pages
         */
        this.generatePagesArray = function(currentPage, totalItems, pageSize) {
            var maxBlocks, maxPage, maxPivotPages, minPage, numPages, pages;
            maxBlocks = 11;
            pages = [];
            numPages = Math.ceil(totalItems / pageSize);
            if (numPages > 1) {
                pages.push({
                    type: 'prev',
                    number: Math.max(1, currentPage - 1),
                    active: currentPage > 1
                });
                pages.push({
                    type: 'first',
                    number: 1,
                    active: currentPage > 1,
                    current: currentPage === 1
                });
                maxPivotPages = Math.round((maxBlocks - 5) / 2);
                minPage = Math.max(2, currentPage - maxPivotPages);
                maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage));
                minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)));
                var i = minPage;
                while (i <= maxPage) {
                    if ((i === minPage && i !== 2) || (i === maxPage && i !== numPages - 1)) {
                        pages.push({
                            type: 'more',
                            active: false
                        });
                    } else {
                        pages.push({
                            type: 'page',
                            number: i,
                            active: currentPage !== i,
                            current: currentPage === i
                        });
                    }
                    i++;
                }
                pages.push({
                    type: 'last',
                    number: numPages,
                    active: currentPage !== numPages,
                    current: currentPage === numPages
                });
                pages.push({
                    type: 'next',
                    number: Math.min(numPages, currentPage + 1),
                    active: currentPage < numPages
                });
            }
            return pages;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:NgTableParams#url
         * @methodOf ngTable.factory:NgTableParams
         * @description Return groups for table grouping
         *
         * @param {boolean} asString flag indicates return array of string or object
         * @returns {Array} If asString = true will be return array of url string parameters else key-value object
         */
        this.url = function(asString) {
            asString = asString || false;
            var pairs = (asString ? [] : {});
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var item = params[key],
                        name = encodeURIComponent(key);
                    if (typeof item === "object") {
                        for (var subkey in item) {
                            if (!angular.isUndefined(item[subkey]) && item[subkey] !== "") {
                                var pname = name + "[" + encodeURIComponent(subkey) + "]";
                                if (asString) {
                                    pairs.push(pname + "=" + item[subkey]);
                                } else {
                                    pairs[pname] = item[subkey];
                                }
                            }
                        }
                    } else if (!angular.isFunction(item) && !angular.isUndefined(item) && item !== "") {
                        if (asString) {
                            pairs.push(name + "=" + encodeURIComponent(item));
                        } else {
                            pairs[name] = encodeURIComponent(item);
                        }
                    }
                }
            }
            return pairs;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:NgTableParams#reload
         * @methodOf ngTable.factory:NgTableParams
         * @description Reload table data
         */
        this.reload = function() {
            var $defer = $q.defer(),
                self = this,
                pData = null;

            if (!settings.$scope) {
                return;
            }

            settings.$loading = true;
            if (settings.groupBy) {
                pData = settings.getGroups($defer, settings.groupBy, this);
            } else {
                pData = settings.getData($defer, this);
            }
            log('ngTable: reload data');

            if (!pData) {
                // If getData resolved the $defer, and didn't promise us data,
                //   create a promise from the $defer. We need to return a promise.
                pData = $defer.promise;
            }
            return pData.then(function(data) {
                settings.$loading = false;
                log('ngTable: current scope', settings.$scope);
                if (settings.groupBy) {
                    self.data = data;
                    if (settings.$scope) settings.$scope.$groups = data;
                } else {
                    self.data = data;
                    if (settings.$scope) settings.$scope.$data = data;
                }
                if (settings.$scope) settings.$scope.pages = self.generatePagesArray(self.page(), self.total(), self.count());
                settings.$scope.$emit('ngTableAfterReloadData');
                return data;
            });
        };

        this.reloadPages = function() {
            var self = this;
            settings.$scope.pages = self.generatePagesArray(self.page(), self.total(), self.count());
        };

        var params = this.$params = {
            page: 1,
            count: 1,
            filter: {},
            sorting: {},
            group: {},
            groupBy: null
        };
        angular.extend(params, ngTableDefaults.params);

        var settings = {
            $scope: null, // set by ngTable controller
            $loading: false,
            data: null, //allows data to be set when table is initialized
            total: 0,
            defaultSort: 'desc',
            filterDelay: 750,
            counts: [10, 25, 50, 100],
            sortingIndicator: 'span',
            getGroups: this.getGroups,
            getData: this.getData
        };
        angular.extend(settings, ngTableDefaults.settings);

        this.settings(baseSettings);
        this.parameters(baseParameters, true);
        return this;
    };
    return NgTableParams;
}
