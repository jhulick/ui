/* jshint -W117, -W030 */
describe('Shell Controller', function() {
    var controller;
    var en = mockData.getEnData();
    var $httpFlush;
    var scope, state;

    beforeEach(function() {
        bard.appModule('app.layout', 'max-ui');
        bard.inject(this, '$httpBackend', '$controller', '$q', '$rootScope', '$state', '$translate', '$window', '$localStorage', '$timeout', 'toggleStateService', 'colors', 'browser', 'cfpLoadingBar');
    });

    beforeEach(function() {
        $httpBackend.when('GET', 'build/i18n/en.json').respond(200, en);
        $httpFlush = $httpBackend.flush;

        scope = $rootScope.$new();
        $state.current = {
            title: "Shell"
        };
        controller = $controller('Shell', {$scope: scope});
        $rootScope.$apply();
    });

    //bard.verifyNoOutstandingHttpRequests();

    describe('Shell controller', function() {
        it('should be created successfully', function() {
            expect(controller).to.be.defined;
        });

        describe('i18n after activate', function() {
            it('should have listIsOpen false', function() {
                expect(scope.language.listIsOpen).to.equal(false);
            });
            it('should have en as an option', function() {
                expect(scope.language.available['en']).to.equal('English');
            });
        });

        it('should have currTitle equal to state.current.title', function() {
            expect($rootScope.currTitle).to.equal($state.current.title);
        });
    });
});
