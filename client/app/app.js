'use strict';

angular.module('postalyzerApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'cgBusy',
  'highcharts-ng'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('user/self');

    $locationProvider.html5Mode(true);
  })

//  need to find a way to make this work with grunt serve:dist
//  .value('cgBusyDefaults',{
//    templateUrl: '/app/loading.html'
//  });