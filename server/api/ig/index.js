'use strict';

var express = require('express');
var controller = require('./ig.controller');

var router = express.Router();

router.get('/authorize_user', controller.authorize_user);
router.get('/handleauth', controller.handleauth);
router.get('/user', controller.getUser);
router.get('/user_media_recent', controller.getUserMediaRecent);
router.get('/user_self_feed', controller.getUserSelfFeed);
router.get('/user_search', controller.getUserSearch);
router.get('/compare_users', controller.compareUsers());

module.exports = router;