'use strict';

angular.module('postalyzerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('success', {
        url: '/success/:token',
        templateUrl: 'app/success/success.html',
        controller: 'SuccessCtrl'
      });
  });