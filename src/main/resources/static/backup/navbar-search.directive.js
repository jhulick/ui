/* jshint -W117, -W030 */
/* jshint multistr:true */
describe('searchOpen directive: ', function () {
    var el;
    var searchElement;
    var isOpenAttribute = 'search-open';
    var scope;

    beforeEach(module('max-ui'));

    beforeEach(function() {
        bard.inject(this, '$compile', '$rootScope', 'oc.lazyLoad');
        // The minimum necessary template HTML for this spec.
        // Simulates an icon link that opens and closes a search box
        //
        // Note: the attribute value is supposed to be an expression that invokes a $scope method
        //       so make sure the expression includes '()', e.g., "vm.sidebarReady(42)"
        //       no harm if the expression fails ... but then scope.sidebarReady will be undefined.
        //       All parameters in the expression are passed to vm.sidebarReady ... if it exists
        //
        // Note: We do NOT add this element to the browser DOM (although we could).
        //       spec runs faster if we don't touch the DOM (even the PhantomJS DOM).
        el = angular.element(
            '<ul class="nav navbar-nav navbar-right"> \
                 <li> \
                     <a href="#" search-open="search-open"> \
                         <em class="icon-magnifier"></em> \
                     </a> \
                 </li> \
             </ul>');
            //'<ht-sidebar when-done-animating="vm.sidebarReady(42)" > \
            //    <div class="sidebar-dropdown"><a href="">Menu</a></div> \
            //    <div class="sidebar-inner" style="display: none"></div> \
            //</ht-sidebar>');

        // The spec examines changes to these template parts
        searchElement = el.find('.li a'); // the link to click

        // ng's $compile service resolves nested directives (there are none in this example)
        // and binds the element to the scope (which must be a real ng scope)
        scope = $rootScope;
        $compile(el)(scope);

        // tell angular to look at the scope values right now
        scope.$digest();
    });

    /// tests ///
    describe('the search control', function () {

        // a single test example, check the produced DOM
        it('should produce dom for a list, an item and an anchor', function() {
            expect(el.find('ul').length).toEqual(1);
            expect(el.find('li').length).toEqual(1);
            expect(el.find('a').length).toEqual(1);
        });


        it('is absent for a closed menu', function () {
            hasIsOpenAttribute(false);
        });

        it('is added to a closed menu after clicking', function () {
            clickIt();
            hasIsOpenAttribute(true);
        });

        it('is present for an open menu', function () {
            hasIsOpenAttribute(true);
        });

        it('is removed from a closed menu after clicking', function () {
            clickIt();
            hasIsOpenAttribute(false);
        });
    });

    /////// helpers //////

    // click the "menu" link
    function clickIt() {
        searchElement.trigger('click');
    }

    // assert whether the "search" link has the class that means 'is open'
    function hasIsOpenAttribute(isTrue) {
        var hasAttribute = searchElement.hasAttribute(isOpenAttribute);
        expect(hasAttribute).equal(!!isTrue, 'link has the "search-open" attribute is ' + hasAttribute);
    }
});
