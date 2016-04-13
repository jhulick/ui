/* jshint -W117, -W030 */
describe('charts.route', function() {
    describe('state', function() {
        var controller;
        var views = {
            flot: 'app/modules/charts/views/chart-flot.html',
            radial: 'app/modules/charts/views/chart-radial.html',
            js: 'app/modules/charts/views/chart-js.html'
        };

        beforeEach(function() {
            module('app.charts', bard.fakeToastr);
            bard.inject(this, '$location', '$rootScope', '$state', '$templateCache');
            $templateCache.put(views.flot, '');
        });

        //it('should map /chart-flot route to flot View template', function() {
        //    expect($state.get('app.chart-flot').templateUrl).to.equal(views.flot);
        //});
        //
        //it('should map state app.chart-flot to url /chart-flot ', function() {
        //    expect($state.href('app.chart-flot', {})).to.equal('/chart-flot');
        //});
        //
        //it('of app.chart-flot should work with $state.go', function() {
        //    $state.go('app.chart-flot');
        //    $rootScope.$apply();
        //    expect($state.is('app.chart-flot'));
        //});
    });
});
