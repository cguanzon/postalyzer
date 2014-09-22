'use strict';

angular.module('postalyzerApp')
  .controller('BaseUserCtrl', function ($http, $scope, $stateParams, $cookieStore, igService) {


        $scope.showFilterStats = false;


        $scope.userId = $stateParams.user_id;

        $scope.getUser = function(){
            igService.getUser($scope.userId)
                .then(function(res){
                    $scope.selfUser = res.data;
                });
        };

        $scope.getUserRecent = function(){
            $scope.promise = igService.getUserRecent($scope.userId).then(function(res){
                for(var key in res.resultWithStats){
                    //see igService for the keys and values
                    $scope[key] = res.resultWithStats[key];
                }
            });
        };

        $scope.getUser();
        $scope.getUserRecent();
  });
