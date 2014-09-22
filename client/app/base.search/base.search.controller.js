'use strict';

angular.module('postalyzerApp')
  .controller('BaseSearchCtrl', function ($state, $scope, $http, $cookieStore) {
        $scope.searchTerm = '';
        $scope.hasSearched = function(){
            if ($scope.searchTerm.length > 0) {
                return true;
            }
            return false;
        };

        $scope.searchForUser = function(){
            $http({
                method: 'GET',
                url: '/api/igs/user_search?search_string=' + $scope.searchTerm,
                headers: {
                    access_token: $cookieStore.get('igToken')
                }
            })
                .then( function (res) {
                    $scope.searchResults = res.data;
                    console.log($scope.searchResults);
                });
        };

        $scope.goToUser = function(userId) {
            $state.go('base.user', { user_id: userId });
        };
  });
