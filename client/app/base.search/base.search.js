'use strict';

angular.module('postalyzerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('base.search', {
        url: '/search',
        templateUrl: 'app/base.search/base.search.html',
        controller: 'BaseSearchCtrl'
      });
  });