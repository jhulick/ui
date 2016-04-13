(function () {
    'use strict';

    angular
        .module('app.sidebar')
        .controller('UserBlockController', UserBlockController);

    UserBlockController.$inject = ['$scope'];

    function UserBlockController($scope) {
        $scope.userBlockVisible = true;
        $scope.$on('toggleUserBlock', function (event, args) {
            $scope.userBlockVisible = !$scope.userBlockVisible;
        });
    }
})();