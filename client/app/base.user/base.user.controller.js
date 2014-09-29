'use strict';

angular.module('postalyzerApp')
  .controller('BaseUserCtrl', function ($scope, $stateParams, igService) {
        $scope.tooltips = igService.getTooltips();
        console.log($scope.tooltips);

        $scope.showFilterStats = false;

        $scope.userId = $stateParams.user_id;

        $scope.getUser = function(){
            igService.getUser($scope.userId)
                .then(function(res){
                    console.log(res);
                    $scope.selfUser = res;

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
