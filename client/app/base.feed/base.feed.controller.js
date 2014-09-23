'use strict';

angular.module('postalyzerApp')
  .controller('BaseFeedCtrl', function ($state, $scope, igService) {
        $scope.getSelfFeed = function(){
            $scope.promise = igService.getSelfFeed()
                .then(function(res){
                    $scope.selfFeed = res.data.feed;
                    $scope.nextMaxId = res.data.next_max_id;
                });
        };

        $scope.goToUser = function(userId){
            $state.go('base.user', { user_id: userId } );
        };

        $scope.getSelfFeed();

        $scope.getNextFeed = function(){
            $scope.promise = igService.getNextFeed($scope.nextMaxId)
                .then(function(res){
                    $scope.selfFeed = $scope.selfFeed.concat(res.data.feed);
                    $scope.nextMaxId = res.data.next_max_id;
                });
        };
  });
