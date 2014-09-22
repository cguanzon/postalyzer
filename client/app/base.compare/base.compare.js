'use strict';

angular.module('postalyzerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('base.compare', {
        url: '/compare',
        templateUrl: 'app/base.compare/base.compare.html',
        controller: 'BaseCompareCtrl'
      });
  });