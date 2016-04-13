/* jshint -W117, -W030 */
describe('FormDemoCtrl Controller', function() {
    var controller;
    var en = mockData.getEnData();
    var $httpFlush;

    beforeEach(function() {
        bard.appModule('app.forms', 'app.core');
        bard.inject(this, '$httpBackend', '$controller', '$q', '$rootScope', 'colors', 'logger', 'formsDataservice');
    });

    beforeEach(function() {

        sinon.stub(formsDataservice, 'getCities').
            returns($q.when(mockData.getCities()));

        sinon.stub(formsDataservice, 'getChosenStates').
            returns($q.when(mockData.getStates()));

        $httpBackend.when('GET', 'build/i18n/en.json').respond(200, en);
        $httpFlush = $httpBackend.flush;

        controller = $controller('FormDemoCtrl', {colors: colors, logger: logger});
        $rootScope.$apply();
        $httpFlush();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('FormDemoCtrl controller', function() {
        it('should be created successfully', function() {
            expect(controller).to.be.defined;
        });

        describe('should have called formsDataservice.getCities', function() {
            it('1 time', function() {
                expect(formsDataservice.getCities).to.have.been.calledOnce;
            });
        });

        describe('should have called formsDataservice.getChosenStates', function() {
            it('1 time', function() {
                expect(formsDataservice.getChosenStates).to.have.been.calledOnce;
            });
        });

        describe('cities after activate', function() {

            it('should have at least 1 city', function() {
                expect(controller.cities).to.have.length.above(0);
            });
        });

        describe('states after activate', function() {

            it('should have at least 1 state', function() {
                expect(controller.states).to.have.length.above(0);
            });
        });
    });
});
