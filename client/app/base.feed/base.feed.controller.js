'use strict';

angular.module('postalyzerApp')
  .controller('BaseFeedCtrl', function ($state, $scope, $http, $cookieStore) {
        $scope.getSelfFeed = function(){
            $scope.promise = $http({
                method: 'GET',
                url: '/api/igs/user_self_feed',
                headers: {
                    access_token: $cookieStore.get('igToken')
                }
            })
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
            $scope.promise = $http({
                method: 'GET',
                url: '/api/igs/user_self_feed?max_id=' + $scope.nextMaxId,
                headers: {
                    access_token: $cookieStore.get('igToken')
                }
            })
                .then(function(res){
                    $scope.selfFeed = $scope.selfFeed.concat(res.data.feed);
                    $scope.nextMaxId = res.data.next_max_id;
                });
        }
  });
