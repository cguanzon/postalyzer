'use strict';

angular.module('postalyzerApp')
  .controller('LoginCtrl', function ($scope, $window) {
    $scope.login = function(){
        $window.location.assign('/api/igs/authorize_user');
    };
  });
