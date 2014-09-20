'use strict';

angular.module('postalyzerApp')
  .controller('BaseCtrl', function ($location, $scope, $state) {

        $scope.goToDashboard = function(){
            $state.go('base.user', { user_id: 'self'});
        };

        $scope.goToFeed = function(){
            $state.go('base.feed');
        };

        $scope.goToSearch = function(){
            $state.go('base.search');
        };

        $scope.goToCompare = function(){
            $state.go('base.compare');
        };

        $scope.isActive = function(route){
            return route === $location.path();
        };

  });
