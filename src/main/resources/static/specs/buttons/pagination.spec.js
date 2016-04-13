describe('app.buttons', function() {
    var controller;

    beforeEach(function() {
        module('app.buttons', function($provide) {
            specHelper.fakeStateProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function($controller, $q, $rootScope, dataservice) {});
    });

    beforeEach(function () {
        controller = $controller('PaginationCtrl');
        $rootScope.$apply();
    });

    describe('Pagination controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have 64 totalItems', function() {
                expect(controller.totalItems).to.equal(64);
            });

            it('should have currentPage set to 4', function() {
                expect(controller.currentPage).to.equal(4);
            });

            it('should have currentPage set to 5', function() {
                controller.setPage(5);
                expect(controller.currentPage).to.equal(5);
            });

            it('should have maxSize of 5', function() {
                expect(controller.maxSize).to.equal(5);
            });

            it('should have 175 bigTotalItems', function() {
                expect(controller.bigTotalItems).to.equal(175);
            });

            it('should have 1 bigCurrentPage', function() {
                expect(controller.bigCurrentPage).to.equal(1);
            });
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});