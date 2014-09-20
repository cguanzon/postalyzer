'use strict';

angular.module('postalyzerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('base.feed', {
        url: '/feed',
        templateUrl: 'app/base.feed/base.feed.html',
        controller: 'BaseFeedCtrl'
      });
  });