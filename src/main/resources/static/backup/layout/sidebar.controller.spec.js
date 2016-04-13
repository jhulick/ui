/* jshint -W117, -W030 */
describe('Sidebar Controller', function() {
    var controller;
    var en = mockData.getEnData();
    var sidebar = mockData.getSidebarMenu();
    var $httpFlush;
    var scope, state;

    beforeEach(function() {
        bard.appModule('app.layout', 'max-ui');
        bard.inject(this, '$httpBackend', '$controller', '$http', '$rootScope', '$state', '$timeout', 'Utils');
    });

    beforeEach(function() {
        $httpBackend.when('GET', 'build/i18n/en.json').respond(200, en);
        $httpBackend.when('GET', 'api/sidebar').respond(200, sidebar);
        $httpFlush = $httpBackend.flush;

        scope = $rootScope.$new();
        $state.current = {
            title: "Shell"
        };
        controller = $controller('SidebarController', {$scope: scope});
        $rootScope.$apply();
    });

    //bard.verifyNoOutstandingHttpRequests();

    describe('Sidebar controller', function() {
        it('should be created successfully', function() {
            expect(controller).to.be.defined;
        });

        //describe('menu after activate', function() {
        //    it('should have three menu items', function() {
        //        expect(scope.menuItems).to.have.length(3);
        //    });
        //});

    });
});
