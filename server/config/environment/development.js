'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/postalyzer-dev'
  },

  seedDB: true,

  domain: 'http://localhost:9000',

  heroku: {
      CLIENT_ID: '69d993ffd9684797b791d76c7c3bd717',
      CLIENT_SECRET: '4bd0f95f80314944b744b28c271c7ccf'
  }
};
