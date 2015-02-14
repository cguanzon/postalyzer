'use strict';

angular.module('postalyzerApp')
  .service('igService', function ($http, $cookieStore, $q, $state) {

        var chartTextStyle = {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif',
            fontWeight: 'bolder',
            color: 'black'
        };

        var sortByKey = function (array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? 1 : ((x > y) ? -1 : 0));
            });
        };


        var getUser = function(userId){
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: '/api/igs/user?user_id=' + userId,
                headers: {
                    access_token: $cookieStore.get('igToken')
                }
            })
                .success(function(data, status){
                    deferred.resolve(data);
                })
                .error(function(){
                    $state.go('base.404');
                });

            return deferred.promise;
        };

        this.getUser = getUser;

        this.getSelfFeed = function(){
            return $http({
                method: 'GET',
                url: '/api/igs/user_self_feed',
                headers: {
                    access_token: $cookieStore.get('igToken')
                }
            });
        };

        this.getNextFeed = function(nextMaxId){
            return $http({
                method: 'GET',
                url: '/api/igs/user_self_feed?max_id=' + nextMaxId,
                headers: {
                    access_token: $cookieStore.get('igToken')
                }
            });
        };

        this.searchForUser = function(searchTerm){
            return $http({
                method: 'GET',
                url: '/api/igs/user_search?search_string=' + searchTerm,
                headers: {
                    access_token: $cookieStore.get('igToken')
                }
            })
        };

        var getUserRecent = function(userId){
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: '/api/igs/user_media_recent?user_id=' + userId,
                headers: {
                    access_token: $cookieStore.get('igToken')
                }
            })
                .error(function(data, status){
                    deferred.reject({message: 'something is wrong'})
                })
                .then(function(res) {
                    var resultWithStats = {};
                    if (res.data.error_message) {
                        resultWithStats.errorMessage = 'This user has chosen to withhold his/her Instagram info from you.';
                    } else {
                        resultWithStats.selfMediaRecent = res.data;
                        resultWithStats.selfMediaRecentArray = res.data.mediaArray;

                        resultWithStats.likesPerFilterChartData = [];
                        resultWithStats.commentsPerFilterChartData = [];
                        resultWithStats.timesUsedPerFilterChartData = [];
                        resultWithStats.timesUsedPerTagChartData = [];

                        for (var key in resultWithStats.selfMediaRecent.stats.tagStats) {
                            if (resultWithStats.selfMediaRecent.stats.tagStats.hasOwnProperty(key)) {
                                resultWithStats.timesUsedPerTagChartData.push(
                                    {
                                        name: key,
                                        value: resultWithStats.selfMediaRecent.stats.tagStats[key].timesUsed
                                    }
                                );
                            }
                        }
                        sortByKey(resultWithStats.timesUsedPerTagChartData, 'y');

                        //build filterStats chart data
                        for (var key in resultWithStats.selfMediaRecent.stats.filterStats) {
                            if (resultWithStats.selfMediaRecent.stats.filterStats.hasOwnProperty(key)) {
                                resultWithStats.likesPerFilterChartData.push(
                                    {
                                        name: key,
                                        value: Math.round(resultWithStats.selfMediaRecent.stats.filterStats[key].likeScorePerTimesUsed * 10) / 10
                                    }
                                );

                                resultWithStats.commentsPerFilterChartData.push(
                                    {
                                        name: key,
                                        value: Math.round(resultWithStats.selfMediaRecent.stats.filterStats[key].commentScorePerTimesUsed * 10) / 10
                                    }
                                );
                                resultWithStats.timesUsedPerFilterChartData.push(
                                    {
                                        name: key,
                                        value: resultWithStats.selfMediaRecent.stats.filterStats[key].timesUsed
                                    }
                                );

                            }
                        }
                        sortByKey(resultWithStats.likesPerFilterChartData, 'y');
                        sortByKey(resultWithStats.commentsPerFilterChartData, 'y');
                        sortByKey(resultWithStats.timesUsedPerFilterChartData, 'y');
                    }
                    deferred.resolve({resultWithStats: resultWithStats});

                });

            return deferred.promise;
        };

        this.getUserRecent = getUserRecent;

        this.compareUsers = function(userId1, userId2){
            var deferred = $q.defer();

            var user1Stats, user2Stats, user1Info, user2Info;
            var categories = [
                'Tags per Post',
                'Comments per Post',
                'Likes per Post',
                'Followers',
                'Posts'
            ];

            getUser(userId1).then(function(res){
                user1Info = res;
                getUser(userId2).then(function(res){
                    user2Info = res;
                    getUserRecent(userId1).then(function(res){
                        user1Stats = res.resultWithStats;

                        getUserRecent(userId2).then(function(res){
                            user2Stats = res.resultWithStats;
                            //compute chart4 values
                            var statsContext1 = user1Stats.selfMediaRecent.stats;
                            var statsContext2 = user2Stats.selfMediaRecent.stats;
                            var combinedPosts = user1Info.counts.media + user2Info.counts.media;
                            var combinedFollowers = user1Info.counts.followed_by + user2Info.counts.followed_by;
                            var combinedLPP = statsContext1.likeScorePerMedia.value + statsContext2.likeScorePerMedia.value;
                            var combinedCPP = statsContext1.commentScorePerMedia.value + statsContext2.commentScorePerMedia.value;
                            var combinedTPP = statsContext1.tagsPerPost.value + statsContext2.tagsPerPost.value;
                            var user1TPP = statsContext1.tagsPerPost.value / combinedTPP * 100;
                            var user1CPP = statsContext1.commentScorePerMedia.value / combinedCPP * 100;
                            var user1LPP = statsContext1.likeScorePerMedia.value / combinedLPP * 100;
                            var user2TPP = statsContext2.tagsPerPost.value / combinedTPP * 100;
                            var user2CPP = statsContext2.commentScorePerMedia.value / combinedCPP * 100;
                            var user2LPP = statsContext2.likeScorePerMedia.value / combinedLPP * 100;
                            var user1Followers = user1Info.counts.followed_by / combinedFollowers * 100;
                            var user2Followers = user2Info.counts.followed_by / combinedFollowers * 100;
                            var user1Posts = user1Info.counts.media / combinedPosts * 100;
                            var user2Posts = user2Info.counts.media / combinedPosts * 100;

                            var stats = {
                                TPP: [
                                    {
                                        name: user1Info.username,
                                        value: Math.round(user1TPP)
                                    },
                                    {
                                        name: user2Info.username,
                                        value: Math.round(user2TPP)
                                    }
                                ],
                                LPP: [
                                    {
                                        name: user1Info.username,
                                        value: Math.round(user1LPP)
                                    },
                                    {
                                        name: user2Info.username,
                                        value: Math.round(user2LPP)
                                    }
                                ],
                                CPP: [
                                    {
                                        name: user1Info.username,
                                        value: Math.round(user1CPP)
                                    },
                                    {
                                        name: user2Info.username,
                                        value: Math.round(user2CPP)
                                    }
                                ],
                                followers: [
                                    {
                                        name: user1Info.username,
                                        value: Math.round(user1Followers)
                                    },
                                    {
                                        name: user2Info.username,
                                        value: Math.round(user2Followers)
                                    }
                                ],
                                posts: [
                                    {
                                        name: user1Info.username,
                                        value: Math.round(user1Posts)
                                    },
                                    {
                                        name: user2Info.username,
                                        value: Math.round(user2Posts)
                                    }
                                ]
                            }

                            deferred.resolve({stats: stats});
                        });
                    });
                });
            });
            return deferred.promise;
        };

        this.getTooltips = function(){
          return {
              instagram: 'View in Instagram',
              user: "View User's Stats Page"
          }
        };
  });
