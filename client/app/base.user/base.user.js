'use strict';

angular.module('postalyzerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('base.user', {
        url: '/user/:user_id',
        templateUrl: 'app/base.user/base.user.html',
        controller: 'BaseUserCtrl'
      });
  });