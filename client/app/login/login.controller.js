'use strict';

angular.module('postalyzerApp')
  .controller('LoginCtrl', function ($scope) {
    $scope.authorizationUrl = '/api/igs/authorize_user';
  });
