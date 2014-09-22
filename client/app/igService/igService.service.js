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


        this.getUser = function(userId){
            return $http({
                method: 'GET',
                url: '/api/igs/user?user_id=' + userId,
                headers: {
                    access_token: $cookieStore.get('igToken')
                }
            });
        };

        this.getUserRecent = function(userId){
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: '/api/igs/user_media_recent?user_id=' + userId,
                headers: {
                    access_token: $cookieStore.get('igToken')
                }
            })
                .then(function(res) {
                    var resultWithStats = {}

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
  });
