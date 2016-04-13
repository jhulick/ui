/* jshint -W117, -W030 */
describe('blocks.exception', function() {
    var exceptionHandlerProvider;
    beforeEach(function() {
        bard.appModule('blocks.exception', function(_exceptionHandlerProvider_) {
            exceptionHandlerProvider = _exceptionHandlerProvider_;
        });
        bard.inject(this, '$rootScope');
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('$exceptionHandler', function() {
        it('should have a dummy test', inject(function() {
            expect(true).to.equal(true);
        }));

        it('should be defined', inject(function($exceptionHandler) {
            expect($exceptionHandler).to.be.defined;
        }));

        it('should have configuration', inject(function($exceptionHandler) {
            expect($exceptionHandler.config).to.be.defined;
        }));
    });

});
