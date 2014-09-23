'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
            'mongodb://localhost/postalyzer'
  },

    heroku: {
        CLIENT_ID: '4c0fd1464b38494abdfb7ab7f0176266',
        CLIENT_SECRET: '4aee2f945751493f9187d2bc7e1fca53'
    },

    domain: 'http://postalyzer.herokuapp.com'

};