'use strict';

angular.module('postalyzerApp')
  .controller('BaseSearchCtrl', function ($state, $scope, igService) {
        $scope.searchTerm = '';
        $scope.hasSearched = false;

        $scope.searchForUser = function(){
            igService.searchForUser($scope.searchTerm)
                .then( function (res) {
                    $scope.searchResults = res.data;
                });
            $scope.hasSearched = true;
        };

        $scope.goToUser = function(userId) {
            $state.go('base.user', { user_id: userId });
        };

        $scope.tooltips = igService.getTooltips();
  });
