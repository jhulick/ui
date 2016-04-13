module.exports = function(app) {
    var api = '/api/';
    var data = '/../data/';
    var jsonfileservice = require('../utils/jsonfileservice')();
    var four0four = require('../utils/404')();

    app.get(api + 'sidebar', getSidebarMenu);

    app.get(api + 'chart/bar', getBarData);
    app.get(api + 'chart/barstacked', getBarstackedData);
    app.get(api + 'chart/spline', getSplineData);
    app.get(api + 'chart/area', getAreaData);
    app.get(api + 'chart/line', getLineData);
    app.get(api + 'chart/pie', getPieData);
    app.get(api + 'chart/donut', getDonutData);

    app.get(api + 'datatable', getDatatableData);
    app.get(api + 'table-data', getTableData);
    app.get(api + 'xeditable-groups', getXeditableGroups);
    app.get(api + 'cities', getCities);
    app.get(api + 'chosen-states', getChosenStates);

    app.get(api + '*', four0four.notFoundMiddleware);

    //function getCustomer(req, res, next) {
    //    var id = req.params.id;
    //    var msg = 'customer id ' + id + ' not found. ';
    //    try {
    //        var json = jsonfileservice.getJsonFromFile(data + 'customers.json');
    //        var customer = json.filter(function(c) {
    //            return c.id === parseInt(id);
    //        });
    //        if (customer && customer[0]) {
    //            res.send(customer[0]);
    //        } else {
    //            four0four.send404(req, res, msg);
    //        }
    //    }
    //    catch (ex) {
    //        four0four.send404(req, res, msg + ex.message);
    //    }
    //}
    //
    //function getCustomers(req, res, next) {
    //    var msg = 'customers not found. ';
    //    try {
    //        var json = jsonfileservice.getJsonFromFile(data + 'customers.json');
    //        if (json) {
    //            res.send(json);
    //        } else {
    //            four0four.send404(req, req, msg);
    //        }
    //    }
    //    catch (ex) {
    //        four0four.send404(req, res, msg + ex.message);
    //    }
    //}

    function getSidebarMenu(req, res, next) {
        var msg = 'sidebar data not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'sidebar-menu.json');
            if (json) {
                res.send(json);
            } else {
                four0four.send404(req, req, msg);
            }
        }
        catch (ex) {
            four0four.send404(req, res, msg + ex.message);
        }
    }

    function getCities(req, res, next) {
        var msg = 'cities data not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'cities.json');
            if (json) {
                res.send(json);
            } else {
                four0four.send404(req, req, msg);
            }
        }
        catch (ex) {
            four0four.send404(req, res, msg + ex.message);
        }
    }

    function getChosenStates(req, res, next) {
        var msg = 'chose states data not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'chosen-states.json');
            if (json) {
                res.send(json);
            } else {
                four0four.send404(req, req, msg);
            }
        }
        catch (ex) {
            four0four.send404(req, res, msg + ex.message);
        }
    }

    function getBarData(req, res, next) {
        var msg = 'bar chart data not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'chart/bar.json');
            if (json) {
                res.send(json);
            } else {
                four0four.send404(req, req, msg);
            }
        }
        catch (ex) {
            four0four.send404(req, res, msg + ex.message);
        }
    }

    function getBarstackedData(req, res, next) {
        var msg = 'bar chart data not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'chart/barstacked.json');
            if (json) {
                res.send(json);
            } else {
                four0four.send404(req, req, msg);
            }
        }
        catch (ex) {
            four0four.send404(req, res, msg + ex.message);
        }
    }

    function getSplineData(req, res, next) {
        var msg = 'spline chart data not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'chart/splinev3.json');
            if (json) {
                res.send(json);
            } else {
                four0four.send404(req, req, msg);
            }
        }
        catch (ex) {
            four0four.send404(req, res, msg + ex.message);
        }
    }

    function getAreaData(req, res, next) {
        var msg = 'area chart data not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'chart/area.json');
            if (json) {
                res.send(json);
            } else {
                four0four.send404(req, req, msg);
            }
        }
        catch (ex) {
            four0four.send404(req, res, msg + ex.message);
        }
    }

    function getLineData(req, res, next) {
        var msg = 'line chart data not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'chart/line.json');
            if (json) {
                res.send(json);
            } else {
                four0four.send404(req, req, msg);
            }
        }
        catch (ex) {
            four0four.send404(req, res, msg + ex.message);
        }
    }

    function getPieData(req, res, next) {
        var msg = 'pie chart data not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'chart/pie.json');
            if (json) {
                res.send(json);
            } else {
                four0four.send404(req, req, msg);
            }
        }
        catch (ex) {
            four0four.send404(req, res, msg + ex.message);
        }
    }

    function getDonutData(req, res, next) {
        var msg = 'pie chart data not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'chart/donut.json');
            if (json) {
                res.send(json);
            } else {
                four0four.send404(req, req, msg);
            }
        }
        catch (ex) {
            four0four.send404(req, res, msg + ex.message);
        }
    }

    function getDatatableData(req, res, next) {
        var msg = 'datatable data not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'datatable.json');
            if (json) {
                res.send(json);
            } else {
                four0four.send404(req, req, msg);
            }
        }
        catch (ex) {
            four0four.send404(req, res, msg + ex.message);
        }
    }

    function getTableData(req, res, next) {
        var msg = 'table data not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'table-data.json');
            if (json) {
                res.send(json);
            } else {
                four0four.send404(req, req, msg);
            }
        }
        catch (ex) {
            four0four.send404(req, res, msg + ex.message);
        }
    }

    function getXeditableGroups(req, res, next) {
        var msg = 'xeditable groups data not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'xeditable-groups.json');
            if (json) {
                res.send(json);
            } else {
                four0four.send404(req, req, msg);
            }
        }
        catch (ex) {
            four0four.send404(req, res, msg + ex.message);
        }
    }
};
