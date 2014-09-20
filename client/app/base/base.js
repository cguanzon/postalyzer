'use strict';

angular.module('postalyzerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('base', {
        url: '',
        abstract:'true',
        templateUrl: 'app/base/base.html',
        controller: 'BaseCtrl'
      });
  });