'use strict';

angular.module('postalyzerApp')
  .controller('BaseUserCtrl', function ($scope, $stateParams, igService) {

        //test
        $scope.data = [300, 500, 100];
        $scope.chartOptions = {
          responsive: true
        };

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
                    $scope.filterLikeLabels = res.resultWithStats.likesPerFilterChartData.map(function(datum){
                        return datum.name;
                    });
                    $scope.filterLikeData = res.resultWithStats.likesPerFilterChartData.map(function(datum){
                        return datum.value;
                    });
                    $scope.filterCommentLabels = res.resultWithStats.commentsPerFilterChartData.map(function(datum){
                        return datum.name;
                    });
                    $scope.filterCommentData = res.resultWithStats.commentsPerFilterChartData.map(function(datum){
                        return datum.value;
                    });
                    $scope.filterTimesUsedLabels = res.resultWithStats.timesUsedPerFilterChartData.map(function(datum){
                        return datum.name;
                    });
                    $scope.filterTimesUsedData = res.resultWithStats.timesUsedPerFilterChartData.map(function(datum){
                        return datum.value;
                    });
                    $scope.tagTimesUsedLabels = res.resultWithStats.timesUsedPerTagChartData.map(function(datum){
                        return datum.name;
                    }).slice(0,5);
                    $scope.tagTimesUsedData = res.resultWithStats.timesUsedPerTagChartData.map(function(datum){
                        return datum.value;
                    }).slice(0,5);
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
