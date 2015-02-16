'use strict';

angular.module('postalyzerApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'cgBusy',
  'chart.js'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('login');

    $locationProvider.html5Mode(true);

    //totally randomizes chart colors
    Chart.defaults.global.colours = [];
  })

//  need to find a way to make this work with grunt serve:dist
//  .value('cgBusyDefaults',{
//    templateUrl: '/app/loading.html'
//  });