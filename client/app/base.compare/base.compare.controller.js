'use strict';

angular.module('postalyzerApp')
  .controller('BaseCompareCtrl', function ($scope, igService) {
        $scope.searchTerm1 = '';
        $scope.hasSearched1 = function(){
            if ($scope.searchTerm1.length > 0) {
                return true;
            }
            return false;
        };

        $scope.user1 = {

        };

        $scope.searchForUser = function(searchTerm){
            igService.searchForUser(searchTerm)
                .then( function (res) {
                    $scope.searchResults = res.data;
                });
        };

        $scope.selectUser1 = function(user1){
            $scope.user1 = user1;
            $scope.searchTerm1 = '';
        };
  });
