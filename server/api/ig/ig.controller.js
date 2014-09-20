'use strict';

var _ = require('lodash');
var igApi = require('instagram-node').instagram();
var access_token;

var redirect_uri = 'http://localhost:9000/api/igs/handleauth'
// Get list of igs
exports.index = function(req, res) {
  res.json([]);
};

exports.authorize_user = function(req, res) {
    api.use({
        client_id: 'be573c8873f5496caab40ab22f60b895',
        client_secret: '440cc4c661ee4e8baa158dc4b4198e51'
    });
    res.redirect(igApi.get_authorization_url(redirect_uri));
};

exports.handleauth = function(req, res) {
    igApi.authorize_user(req.query.code, redirect_uri, function(err, result) {
        if (err) {
            console.log(err.body);
            res.send("Didn't work");
        } else {
            access_token = result.access_token;
            igApi.use({
                client_id: 'be573c8873f5496caab40ab22f60b895',
                client_secret: '440cc4c661ee4e8baa158dc4b4198e51'
            });
            res.redirect('http://localhost:9000/#/user/self');
        }
    });
};