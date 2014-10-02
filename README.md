postalyzer
==========

This app gives you your Instagram™ stats in a fun way

##Local Setup
1. Clone the repository
2. In the repository's folder, run `bower install` and `grunt install`
3. open the `/server/config` directory and copy `local.env.sample.js` and paste it onto an new `local.env.js` file in the same folder
4. Update the info in `local.env.js` with your instagram app credentials
4. run `grunt serve` to start the development server

##Heroku Setup
1. Follow the instructions here: https://github.com/DaftMonk/generator-angular-fullstack#heroku
2. Just like development, set your CLIENT_ID, CLIENT_SECRET, and domain variables using `heroku config:set`