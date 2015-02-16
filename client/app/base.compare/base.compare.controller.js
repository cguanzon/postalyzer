'use strict';

angular.module('postalyzerApp')
  .controller('BaseCompareCtrl', function ($scope, igService) {
        $scope.searchTerms = ['',''];
        $scope.users = [{},{}];
        $scope.searchResults = [{},{}];

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
            igService.searchForUser(searchTerm)
                .then( function (res) {
                    $scope.searchResults[userNumber-1] = res.data;
                });
        };
        $scope.reset = function(){
            $scope.searchTerms = ['',''];
            $scope.users = [{},{}];
            $scope.searchResults = [{},{}];
            $scope.hasCompared = false;
        };

        $scope.compare = function(){
            $scope.hasCompared = true;
            $scope.promise = igService.compareUsers($scope.users[0].id, $scope.users[1].id)
                .then(function(res){
                    $scope.postLabels = res.stats.posts.map(function(post){
                        return post.name;
                    })
                    $scope.postValues = res.stats.posts.map(function(post){
                        return post.value;
                    })
                    $scope.TPPLabels = res.stats.TPP.map(function(TPP){
                        return TPP.name;
                    })
                    $scope.TPPValues = res.stats.TPP.map(function(TPP){
                        return TPP.value;
                    })
                    $scope.LPPLabels = res.stats.LPP.map(function(LPP){
                        return LPP.name;
                    })
                    $scope.LPPValues = res.stats.LPP.map(function(LPP){
                        return LPP.value;
                    })
                    $scope.CPPLabels = res.stats.CPP.map(function(CPP){
                        return CPP.name;
                    })
                    $scope.CPPValues = res.stats.CPP.map(function(CPP){
                        return CPP.value;
                    })
                    $scope.followerLabels = res.stats.followers.map(function(follower){
                        return follower.name;
                    })
                    $scope.followerValues = res.stats.followers.map(function(follower){
                        return follower.value;
                    })
                });


        };

        $scope.tooltips = igService.getTooltips();


  });
