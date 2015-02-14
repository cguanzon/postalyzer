'use strict';

angular.module('postalyzerApp')
  .controller('BaseUserCtrl', function ($scope, $stateParams, igService) {

        $scope.tooltips = igService.getTooltips();
        $scope.showBasic = false;
        $scope.toggleText = 'Show basic stats';

        $scope.showFilterStats = false;

        $scope.userId = $stateParams.user_id;

        $scope.getUser = function(){
            igService.getUser($scope.userId)
                .then(function(res){
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

        $scope.toggleBasic = function(){
            if ($scope.showBasic === false) {
                $scope.toggleText = 'Hide basic stats'
                $scope.showBasic = true;

            } else {
                $scope.toggleText = 'Show basic stats'
                $scope.showBasic = false;
            }
        };

        $scope.getUser();
        $scope.getUserRecent();
  });
