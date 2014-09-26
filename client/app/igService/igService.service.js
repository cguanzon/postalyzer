'use strict';

angular.module('postalyzerApp')
  .service('igService', function ($http, $cookieStore, $q) {

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
            return $http({
                method: 'GET',
                url: '/api/igs/user?user_id=' + userId,
                headers: {
                    access_token: $cookieStore.get('igToken')
                }
            });
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
                        resultWithStats.tagsUsedPerTagChartData = [];

                        for (var key in resultWithStats.selfMediaRecent.stats.tagStats) {
                            if (resultWithStats.selfMediaRecent.stats.tagStats.hasOwnProperty(key)) {
                                resultWithStats.tagsUsedPerTagChartData.push(
                                    {
                                        name: key,
                                        y: resultWithStats.selfMediaRecent.stats.tagStats[key].timesUsed
                                    }
                                );
                            }
                        }
                        sortByKey(resultWithStats.tagsUsedPerTagChartData, 'y');

                        //build filterStats chart data
                        for (var key in resultWithStats.selfMediaRecent.stats.filterStats) {
                            if (resultWithStats.selfMediaRecent.stats.filterStats.hasOwnProperty(key)) {
                                resultWithStats.likesPerFilterChartData.push(
                                    {
                                        name: key,
                                        y: Math.round(resultWithStats.selfMediaRecent.stats.filterStats[key].likeScorePerTimesUsed * 10) / 10,
                                        dataLabels: {
                                            enabled: true
                                        }
                                    }
                                );
                                resultWithStats.commentsPerFilterChartData.push(
                                    {
                                        name: key,
                                        y: Math.round(resultWithStats.selfMediaRecent.stats.filterStats[key].commentScorePerTimesUsed * 10) / 10,
                                        dataLabels: {
                                            enabled: true
                                        }
                                    }
                                );
                                resultWithStats.timesUsedPerFilterChartData.push(
                                    {
                                        name: key,
                                        y: resultWithStats.selfMediaRecent.stats.filterStats[key].timesUsed,
                                        dataLabels: {
                                            enabled: true
                                        }
                                    }
                                );

                            }
                        }
                        sortByKey(resultWithStats.likesPerFilterChartData, 'y');
                        sortByKey(resultWithStats.commentsPerFilterChartData, 'y');
                        sortByKey(resultWithStats.timesUsedPerFilterChartData, 'y');

                        resultWithStats.chartConfig1 = {

                            options: {
                                chart: {
                                    backgroundColor: 'lightgray',
                                    type: 'column',
                                    animation: {
                                        duration: 2000
                                    }
                                },
                                colors: [
                                    '#00C924',
                                    '#C900A5'
                                ],
                                title: {
                                    text: '<b>Like/Comments per Use (Top 5)</b>'
                                },
                                tooltip: {
                                    pointFormat: '{series.name}: <b>{point.y:.2f}</b>'
                                },
                                xAxis: {
                                    title: {
                                        text: 'Filter',
                                        style: chartTextStyle
                                    },
                                    type: 'category',
                                    labels: {
                                        rotation: -45,
                                        style: chartTextStyle
                                    }
                                },

                                yAxis: {
                                    min: 0,
                                    title: {
                                        text: 'Likes/Comments per Use',
                                        style: chartTextStyle
                                    }
                                }
                            },

                            series: [{
                                name: 'Likes per Use',
                                data: resultWithStats.likesPerFilterChartData.slice(0,5)
                            },{
                                name: 'Comments per Use',
                                data: resultWithStats.commentsPerFilterChartData.slice(0,5)
                            }]
                        };

                        resultWithStats.chartConfig2 = {

                            options: {
                                chart: {
                                    backgroundColor: 'lightgray',
                                    type: 'pie',
                                    plotBackgroundColor: null,
                                    plotBorderWidth: 0,
                                    plotShadow: true,
                                    animation: {
                                        duration: 900
                                    }
                                },
                                colors: [
                                    '#00C924',
                                    '#ED114F',
                                    '#FADF11',
                                    '#FA6B11',
                                    '#11FAF6',
                                    '#1167FA'
                                ],
                                title: {
                                    text: '<b>Times Used (Top 5)</b>'
                                },
                                tooltip: {
                                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                },
                                plotOptions: {
                                    pie: {
                                        dataLabels: {
                                            enabled: true,
                                            distance: -50,
                                            style: {
                                                fontWeight: 'bold',
                                                color: 'white',
                                                textShadow: '0px 1px 2px black'
                                            }
                                        },
                                        startAngle: -90,
                                        endAngle: 90,
                                        center: ['50%', '75%']
                                    }
                                }

                            },

                            series: [{
                                type: 'pie',
                                name: 'Times Used',
                                innerSize: '30%',
                                data: resultWithStats.timesUsedPerFilterChartData.slice(0,5)
                            }]
                        };

                        resultWithStats.chartConfig3 = {
                            options: {
                                chart: {
                                    backgroundColor: 'lightgray',
                                    type: 'bar',
                                    animation: {
                                        duration: 2000
                                    }
                                },
                                title: {
                                    text: '<b>Times Used for Top Tags</b>'
                                },
                                xAxis: {
                                    title: {
                                        text: 'Tag',
                                        style: chartTextStyle
                                    },
                                    type: 'category',
                                    labels: {
                                        style: chartTextStyle
                                    }
                                },
                                yAxis: {
                                    min: 0,
                                    title: {
                                        text: 'Times Used',
                                        style: chartTextStyle
                                    }
                                },
                                tooltip: {
                                    pointFormat: '{series.name}: <b>{point.y}</b>'
                                },
                                plotOptions: {
                                    bar: {
                                        dataLabels: {
                                            enabled: true
                                        }
                                    }
                                }
                            },
                            series: [{
                                name: 'Times Used',
                                data: resultWithStats.tagsUsedPerTagChartData.slice(0,5)
                            }]
                        };
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
                'Likes per Post'
            ];

            getUser(userId1).then(function(res){
                user1Info = res.data;
                getUser(userId2).then(function(res){
                    user2Info = res.data;
                    getUserRecent(userId1).then(function(res){
                        user1Stats = res.resultWithStats;
                        console.log(user1Stats);

                        getUserRecent(userId2).then(function(res){
                            user2Stats = res.resultWithStats;
                            console.log(user2Stats);

                            //compute chart4 values
                            var statsContext1 = user1Stats.selfMediaRecent.stats;
                            var statsContext2 = user2Stats.selfMediaRecent.stats;
                            var combinedLPP = statsContext1.likeScorePerMedia.value + statsContext2.likeScorePerMedia.value;
                            var combinedCPP = statsContext1.commentScorePerMedia.value + statsContext2.commentScorePerMedia.value;
                            var combinedTPP = statsContext1.tagsPerPost.value + statsContext2.tagsPerPost.value;
                            var user1TPP = statsContext1.tagsPerPost.value / combinedTPP * 100;
                            var user1CPP = statsContext1.commentScorePerMedia.value / combinedCPP * 100;
                            var user1LPP = statsContext1.likeScorePerMedia.value / combinedLPP * 100;
                            var user2TPP = statsContext2.tagsPerPost.value / combinedTPP * 100;
                            var user2CPP = statsContext2.commentScorePerMedia.value / combinedCPP * 100;
                            var user2LPP = statsContext2.likeScorePerMedia.value / combinedLPP * 100;

                            var chartConfig4 = {
                                options: {
                                    chart: {
                                        type: 'bar',
                                        backgroundColor: 'lightgray',
                                        animation: {
                                            duration: 2000
                                        }
                                    },
                                    colors: [
                                        '#00C924',
                                        '#ED114F'

                                    ],
                                    title: {
                                        text: 'Share Percentages',
                                        style: chartTextStyle

                                    },
                                    xAxis: [{
                                        categories: categories,
                                        reversed: false,
                                        labels: {
                                            step: 1,
                                            style: chartTextStyle
                                        }
                                    }, { // mirror axis on right side
                                        opposite: true,
                                        reversed: false,
                                        categories: categories,
                                        linkedTo: 0,
                                        labels: {
                                            step: 1,
                                            style: chartTextStyle
                                        }
                                    }],
                                    yAxis: {
                                        title: {
                                            text: null
                                        },
                                        labels: {
                                            formatter: function () {
                                                return '<b>' + (Math.abs(this.value)) + '%</b>';
                                            }
                                        },
                                        min: -100,
                                        max: 100
                                    },

                                    plotOptions: {
                                        series: {
                                            stacking: 'normal'
                                        }
                                    },

                                    tooltip: {
                                        formatter: function () {
                                            return '<b>' + this.series.name + ', <br/>' + this.point.category +
                                                ': ' + Highcharts.numberFormat(Math.abs(this.point.y), 0) + '%</b>';
                                        }
                                    }
                                },


                                series: [{
                                    name: user1Info.username,
                                    data: [-user1TPP, -user1CPP, -user1LPP]
                                }, {
                                    name: user2Info.username,
                                    data: [user2TPP, user2CPP, user2LPP]
                                }]
                            };

                            deferred.resolve({chartConfig4: chartConfig4});
                        });
                    });
                });
            });
            return deferred.promise;
        };
  });
