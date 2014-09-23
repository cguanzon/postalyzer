'use strict';

angular.module('postalyzerApp')
  .controller('BaseSearchCtrl', function ($state, $scope, igService) {
        $scope.searchTerm = '';
        $scope.hasSearched = function(){
            if ($scope.searchTerm.length > 0) {
                return true;
            }
            return false;
        };

        $scope.searchForUser = function(){
            igService.searchForUser($scope.searchTerm)
                .then( function (res) {
                    $scope.searchResults = res.data;
                    console.log($scope.searchResults);
                });
        };

        $scope.goToUser = function(userId) {
            $state.go('base.user', { user_id: userId });
        };
  });
