'use strict';

var _ = require('lodash');
var igApi = require('instagram-node').instagram();
var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;
var domain = process.env.domain;

//auth variables
var redirect_uri = domain + '/api/igs/handleauth';

//stats helper functions
//helper functions
var fixFeed = function(feed){
    var fixedFeed = feed;
    for(var i= 0; i < fixedFeed.length; i++){
        var context = fixedFeed[i];
        context.likeScore = context.likes.count;
        context.commentScore = context.comments.count;
        context.tagScore = context.tags.length;
    }
    return fixedFeed;
};

var addAdvancedStats = function(fixedHolder){
    var advancedHolder = fixedHolder;
    var advancedFeed = fixFeed(advancedHolder.mediaArray);
    advancedHolder.stats= {
        totalLikeScore : {name: 'Total Likes', value: 0},
        totalCommentScore : {name: 'Total Comments', value: 0},
        totalTags : {name: 'Total Tags', value: 0},
        likeScorePerMedia : {name: 'Likes per Post', value: 0},
        commentScorePerMedia : {name: 'Comments per Post', value: 0},
        tagsPerPost : {name: 'Tags per Post', value: 0},
        filterStats : {},
        tagStats: {}
    };
    var statsContext = advancedHolder.stats;
    var filterStatsContext = statsContext.filterStats;
    var tagStatsContext = statsContext.tagStats;

    for(var i=0; i < advancedFeed.length; i++){
        var advancedContext = advancedFeed[i];
        statsContext.totalLikeScore.value += advancedContext.likeScore;
        statsContext.totalCommentScore.value += advancedContext.commentScore;
        statsContext.totalTags.value += advancedContext.tagScore;

        //computes tag stats
        var contextTagArray = advancedContext.tags;
        for(var j=0; j < contextTagArray.length; j++){
            var contextTag = contextTagArray[j];
            if (tagStatsContext.hasOwnProperty(contextTag)) {
                tagStatsContext[contextTag].timesUsed++;
            } else {
                tagStatsContext[contextTag] = {
                    timesUsed: 1
                }
            }
        }

        //computes filter stats
        if (advancedContext.hasOwnProperty('filter')) {
            var contextFilter = advancedContext.filter;
            if (filterStatsContext.hasOwnProperty(contextFilter)) {
                filterStatsContext[contextFilter].timesUsed++;
                filterStatsContext[contextFilter].totalLikeScoreForFilter += advancedContext.likeScore;
                filterStatsContext[contextFilter].totalCommentScoreForFilter += advancedContext.commentScore;
                filterStatsContext[contextFilter].likeScorePerTimesUsed = filterStatsContext[contextFilter].totalLikeScoreForFilter / filterStatsContext[contextFilter].timesUsed;
                filterStatsContext[contextFilter].commentScorePerTimesUsed = filterStatsContext[contextFilter].totalCommentScoreForFilter / filterStatsContext[contextFilter].timesUsed;
            } else {
                filterStatsContext[contextFilter] = {
                    timesUsed: 1,
                    totalLikeScoreForFilter: advancedContext.likeScore,
                    totalCommentScoreForFilter: advancedContext.commentScore,
                    likeScorePerTimesUsed: advancedContext.likeScore,
                    commentScorePerTimesUsed: advancedContext.commentScore
                };
            }
        }
    }

    statsContext.likeScorePerMedia.value = statsContext.totalLikeScore.value / advancedFeed.length;
    statsContext.commentScorePerMedia.value = statsContext.totalCommentScore.value / advancedFeed.length;
    statsContext.tagsPerPost.value = statsContext.totalTags.value / advancedFeed.length;

    return advancedHolder;

};

exports.authorize_user = function(req, res) {
    igApi.use({
        client_id: clientId,
        client_secret: clientSecret
    });
    res.redirect(igApi.get_authorization_url(redirect_uri));
};

exports.handleauth = function(req, res) {
    igApi.authorize_user(req.query.code, redirect_uri, function(err, result) {
        if (err) {
            res.status(404).send("Didn't work");
        } else {
            igApi.use({
                client_id: clientId,
                client_secret: clientSecret
            });
            res.redirect('/success/' + result.access_token);
        }
    });
};

exports.getUser = function(req, res){
    var access_token = req.headers.access_token;
    igApi.use({access_token: access_token});
    var userId = req.query.user_id;
    igApi.user(userId, function(err, result, remaining, limit) {
        if (err) {
            res.status(404).send(err);
        } else {
            res.status(200).send(result);
        }
    });
};

exports.getUserMediaRecent = function(req, res){
    var access_token = req.headers.access_token;
    igApi.use({access_token: access_token});
    var userId = req.query.user_id;
    igApi.user_media_recent(userId, {count:30}, function(err, result, pagination, remaining, limit){
        if (err) {
            res.status(404).send(err);
        } else {

            var mediaArray1 = result;
            var mediaArrayHolder = {};
            //check if we haven't reached end of list
            if (pagination.next_max_id) {
                //get the the remaining 20 of the 50
                igApi.user_media_recent(userId, {count: 20, max_id: pagination.next_max_id}, function (err, result, pagination, remaining, limit) {
                    if (err) {
                        res.status(404).send(err);
                    } else {
                        mediaArrayHolder.mediaArray  = mediaArray1.concat(result);
                        res.status(200).send(addAdvancedStats(mediaArrayHolder));
                    }
                });
            } else {
                mediaArrayHolder.mediaArray  = mediaArray1;
                res.status(200).send(addAdvancedStats(mediaArrayHolder));
            }



        }
    });
};

exports.getUserSelfFeed = function(req, res){
    var access_token = req.headers.access_token;
    igApi.use({access_token: access_token});

    var getSelfFeed = function(err, feed, pagination, remaining, limit) {
        if (err) {
            res.status(404).send(err);
        } else {
            res.status(200).send(
                {
                    feed: fixFeed(feed),
                    next_max_id: pagination.next_max_id
                 }
            );
        }
    };

    if (req.query.max_id) {
        igApi.user_self_feed({max_id: req.query.max_id}, getSelfFeed);
    }
    else {
        igApi.user_self_feed(getSelfFeed);
    }
};


exports.getUserSearch = function (req, res) {
    var access_token = req.headers.access_token;
    igApi.use({access_token: access_token});
    var searchString = req.query.search_string;
    igApi.user_search(searchString, function(err, users, limit){
        if (err) {
            res.send(err);
        } else {
            res.send(users);
        }
    });
};

