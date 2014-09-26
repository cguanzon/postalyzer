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
                    var resultWithStats = {};
                    //for chart4
                    var categories = ['0-4', '5-9', '10-14', '15-19',
                        '20-24', '25-29', '30-34', '35-39', '40-44',
                        '45-49', '50-54', '55-59', '60-64', '65-69',
                        '70-74', '75-79', '80-84', '85-89', '90-94',
                        '95-99', '100 + '];

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

                        resultWithStats.chartConfig4 = {
                            options: {
                                chart: {
                                    type: 'bar'
                                },
                                title: {
                                    text: 'Population pyramid for Germany, midyear 2010'
                                },
                                subtitle: {
                                    text: 'Source: www.census.gov'
                                },
                                xAxis: [{
                                    categories: categories,
                                    reversed: false,
                                    labels: {
                                        step: 1
                                    }
                                }, { // mirror axis on right side
                                    opposite: true,
                                    reversed: false,
                                    categories: categories,
                                    linkedTo: 0,
                                    labels: {
                                        step: 1
                                    }
                                }],
                                yAxis: {
                                    title: {
                                        text: null
                                    },
                                    labels: {
                                        formatter: function () {
                                            return (Math.abs(this.value) / 1000000) + 'M';
                                        }
                                    },
                                    min: -4000000,
                                    max: 4000000
                                },

                                plotOptions: {
                                    series: {
                                        stacking: 'normal'
                                    }
                                },

                                tooltip: {
                                    formatter: function () {
                                        return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
                                            'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
                                    }
                                }
                            },


                            series: [{
                                name: 'Male',
                                data: [-1746181, -1884428, -2089758, -2222362, -2537431, -2507081, -2443179,
                                    -2664537, -3556505, -3680231, -3143062, -2721122, -2229181, -2227768,
                                    -2176300, -1329968, -836804, -354784, -90569, -28367, -3878]
                            }, {
                                name: 'Female',
                                data: [1656154, 1787564, 1981671, 2108575, 2403438, 2366003, 2301402, 2519874,
                                    3360596, 3493473, 3050775, 2759560, 2304444, 2426504, 2568938, 1785638,
                                    1447162, 1005011, 330870, 130632, 21208]
                            }]
                        };
                    }
                    deferred.resolve({resultWithStats: resultWithStats});

                });

            return deferred.promise;
        };
  });
