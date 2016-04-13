describe('animations', function () {
    var htmlTemplate = 'js/modules/animations/views/animations.html';
    var animationsState = 'app.animations';

    describe('route', function () {
        beforeEach(function() {
            module('app.animations', specHelper.fakeLogger);
            specHelper.injector(function($location, $rootScope, $state, $templateCache) {});
            $templateCache.put(htmlTemplate, '');
        });

        it('should map /animations state to animations View template', function () {
            var state = $state.get(animationsState);
            expect(state.templateUrl).to.equal(htmlTemplate);
        });

        describe('when routing to /animations', function() {
            it('state should be animations', function () {
                $location.path('/animations');
                $rootScope.$apply();
                expect($state.current.name).to.equal(animationsState);
            });

            it('template should be animations.html', function () {
                $location.path('/animations');
                $rootScope.$apply();
                expect($state.current.templateUrl).to.equal(htmlTemplate);
            });
        });

        describe('when going to state app.animations', function() {
            it('state should be app.animations', function () {
                $state.go(animationsState);
                $rootScope.$apply();
                expect($state.current.name).to.equal(animationsState);
            });

            it('template should be animations.html', function () {
                $state.go(animationsState);
                $rootScope.$apply();
                expect($state.current.templateUrl).to.equal(htmlTemplate);
            });
        });
    });
});
