'use strict';

angular.module('postalyzerApp')
  .controller('BaseFeedCtrl', function ($state, $scope, $http) {
        $scope.getSelfFeed = function(){
            $scope.promise = $http({method: 'GET', url: '/api/igs/user_self_feed'}).then(function(res){
                $scope.selfFeed = res.data;
            });
        };

        $scope.goToUser = function(userId){
            $state.go('base.user', { user_id: userId } );
        };

        $scope.getSelfFeed();
  });
