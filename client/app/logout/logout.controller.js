'use strict';

angular.module('postalyzerApp')
    .controller('LogoutCtrl', function ($scope, $state, $window) {
        $scope.logout = function(){
            $window.open('https://instagram.com/accounts/logout');
            $state.go('login');
        };
    });
