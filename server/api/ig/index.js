'use strict';

var express = require('express');
var controller = require('./ig.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/authorize_user', controller.authorize_user);
router.get('/handleauth', controller.handleauth);
router.get('/user', controller.getUser);
router.get('/user_media_recent', controller.getUserMediaRecent);

module.exports = router;