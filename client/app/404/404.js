'use strict';

angular.module('postalyzerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('base.404', {
        url: '/404',
        templateUrl: 'app/404/404.html',
        controller: '404Ctrl'
      });
  });