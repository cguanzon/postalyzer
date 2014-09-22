'use strict';

angular.module('postalyzerApp')
  .controller('BaseUserCtrl', function ($http, $scope, $stateParams, $cookieStore) {
        var sortByKey = function (array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? 1 : ((x > y) ? -1 : 0));
            });
        };

        $scope.showFilterStats = false;


        $scope.userId = $stateParams.user_id;

        $scope.getUser = function(){
            $http({
                method: 'GET',
                url: '/api/igs/user?user_id=' + $scope.userId,
                headers: {
                    access_token: $cookieStore.get('igToken')
                }
            })
                .then(function(res){
                    $scope.selfUser = res.data;
                });
        };

        $scope.getUserRecent = function(){
            $scope.promise = $http({
                method: 'GET',
                url: '/api/igs/user_media_recent?user_id=' + $scope.userId,
                headers: {
                    access_token: $cookieStore.get('igToken')
                }
            })
                .then(function(res){
                    if(res.data.error_message) {
                        $scope.errorMessage = 'This user has chosen to withhold his/her Instagram info from you.';
                    } else {
                        $scope.selfMediaRecent = res.data;
                        $scope.selfMediaRecentArray = res.data.mediaArray;

                        $scope.likesPerFilterChartData = [];
                        $scope.commentsPerFilterChartData = [];
                        $scope.timesUsedPerFilterChartData = [];
                        $scope.tagsUsedPerTagChartData = [];

                        for (var key in $scope.selfMediaRecent.stats.tagStats) {
                            if ($scope.selfMediaRecent.stats.tagStats.hasOwnProperty(key)){
                                $scope.tagsUsedPerTagChartData.push(
                                    {
                                        name: key,
                                        y: $scope.selfMediaRecent.stats.tagStats[key].timesUsed
                                    }
                                );
                            }
                        }
                        sortByKey($scope.tagsUsedPerTagChartData, 'y');

                        //build filterStats chart data
                        for(var key in $scope.selfMediaRecent.stats.filterStats){
                            if ($scope.selfMediaRecent.stats.filterStats.hasOwnProperty(key)){
                                $scope.likesPerFilterChartData.push(
                                    {
                                        name: key,
                                        y: Math.round($scope.selfMediaRecent.stats.filterStats[key].likeScorePerTimesUsed*10)/10,
                                        dataLabels: {
                                            enabled: true
                                        }

                                    }
                                );
                                $scope.commentsPerFilterChartData.push(
                                    {
                                        name: key,
                                        y: Math.round($scope.selfMediaRecent.stats.filterStats[key].commentScorePerTimesUsed*10)/10,
                                        dataLabels: {
                                            enabled: true
                                        }
                                    }
                                );
                                $scope.timesUsedPerFilterChartData.push(
                                    {
                                        name: key,
                                        y: $scope.selfMediaRecent.stats.filterStats[key].timesUsed,
                                        dataLabels: {
                                            enabled: true
                                        }
                                    }
                                );

                            }
                        }
                        sortByKey($scope.likesPerFilterChartData, 'y');
                        sortByKey($scope.commentsPerFilterChartData, 'y');
                        sortByKey($scope.timesUsedPerFilterChartData, 'y');




                        var chartTextStyle = {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif',
                            fontWeight: 'bolder',
                            color: 'black'
                        };

                        $scope.chartConfig1 = {

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
                                data: $scope.likesPerFilterChartData.slice(0,5)
                            },{
                                name: 'Comments per Use',
                                data: $scope.commentsPerFilterChartData.slice(0,5)
                            }]
                        };

                        $scope.chartConfig2 = {

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
                                data: $scope.timesUsedPerFilterChartData.slice(0,5)
                            }]
                        };

                        $scope.chartConfig3 = {
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
                                data: $scope.tagsUsedPerTagChartData.slice(0,5)
                            }]
                        };
                    }
            });
        };

        $scope.getUser();
        $scope.getUserRecent();
  });
