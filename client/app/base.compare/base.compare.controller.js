'use strict';

angular.module('postalyzerApp')
  .controller('BaseCompareCtrl', function ($scope, igService) {
        $scope.searchTerms = ['',''];
        $scope.users = [{},{}];
        $scope.searchResults = [{},{}];

        $scope.hasSearched = function(){
            if ($scope.searchTerms[0].length > 0 || $scope.searchTerms[1].length > 0) {
                return true;
            }
            return false;
        };
        $scope.hasSelected = function(userNumber){
            if($scope.users[userNumber-1].username) {
                return true;
            }
            return false;
        };
        $scope.selectUser = function(userNumber,user){
            $scope.users[userNumber-1] = user;
            $scope.searchTerms[userNumber-1] = '';
        };



        $scope.searchForUser = function(userNumber, searchTerm){
            console.log(searchTerm);
            igService.searchForUser(searchTerm)
                .then( function (res) {
                    $scope.searchResults[userNumber-1] = res.data;
                });
        };


  });
