/* global calendarDataservice, */
describe('calendarDataservice', function () {
    var scope;
    var mocks = {};

    beforeEach(function () {
        module('app.calendar', function($provide) {
            specHelper.fakeStateProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function($httpBackend, $rootScope, calendarDataservice) {});

        mocks.events = [{
            data: {results: mockData.getMockEvents()}
        }];
        // sinon.stub(calendarDataservice, 'getEvents', function () {
        //     var deferred = $q.defer();
        //     deferred.resolve(mockData.getMockEvents());
        //     return deferred.promise;
        // });
    });

    it('should be registered', function() {
        expect(calendarDataservice).not.to.equal(null);
    });

    describe('getEvents function', function () {
        it('should exist', function () {
            expect(calendarDataservice.getEvents).not.to.equal(null);
        });

        it('should return 6 Events', function () {
            var data = calendarDataservice.getCustomers();
            expect(data.length).to.equal(6);
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});
