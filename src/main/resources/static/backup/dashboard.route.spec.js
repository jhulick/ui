/* jshint -W117, -W030 */
describe('dashboard', function() {
    describe('state', function() {
        var controller;
        var views = {
            dashboard: '/dashboard'
        };

        beforeEach(function() {
            module('app.dashboard', 'app.core', bard.fakeToastr);
            bard.inject(this, '$location', '$rootScope', '$state', '$templateCache', 'routerHelper');
            $templateCache.put(views.dashboard, '');
        });

        it('should map / route to dashboard View template', function() {
            expect($state.get('app.dashboard').templateUrl).to.equal(views.dashboard);
        });

        it('should map state dashboard to url / ', function() {
            expect($state.href('dashboard', {})).to.equal('/');
        });

        it('of dashboard should work with $state.go', function() {
            $state.go('dashboard');
            $rootScope.$apply();
            expect($state.is('dashboard'));
        });
    });
});
