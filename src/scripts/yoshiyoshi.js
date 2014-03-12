// Description
//   yoshiyoshi
//
// Dependencies:
//   "twitter": "^0.2.8" 
//
// Configuration:
//   YOSHIYOSHI_TWITTER_CONSUMER_KEY
//   YOSHIYOSHI_TWITTER_CONSUMER_SECRET
//   YOSHIYOSHI_TWITTER_ACCESS_TOKEN_KEY
//   YOSHIYOSHI_TWITTER_ACCESS_TOKEN_SECRET
//   YOSHIYOSHI_SCREEN_NAME
//   YOSHIYOSHI_ROOM_NAME
//
// Commands:
//   None
//
// Notes:
//   None
//
// Author:
//   bouzuya
//

var isYoshiYoshi = function(s) {
  return /^([^,.\u3001\u3002]+)[,.\u3001\u3002]?\1$/.test(s);
};

module.exports = function(robot) {

  var util = require('util');
  var Twitter = require('twitter');

  var screenName = process.env.YOSHIYOSHI_SCREEN_NAME;
  var roomName = process.env.YOSHIYOSHI_ROOM_NAME;

  var twitter = new Twitter({
    consumer_key:                 process.env.YOSHIYOSHI_TWITTER_CONSUMER_KEY,
    consumer_secret:              process.env.YOSHIYOSHI_TWITTER_CONSUMER_SECRET,
    consumer_access_token_key:    process.env.YOSHIYOSHI_TWITTER_ACCESS_TOKEN,
    consumer_access_token_secret: process.env.YOSHIYOSHI_TWITTER_ACCESS_TOKEN_SECRET
  });
  var sinceId = null;

  setInterval(function() {

    var options = { screen_name: screenName };
    if (sinceId) options.since_id = sinceId;
    robot.logger.info('yoshiyoshi.js : options = ' + util.inspect(options));
    twitter.getUserTimeline(options, function(errorOrData) {

      if (errorOrData instanceof Error) {
        robot.logger.error(errorOrData);
        return;
      }

      var tweets = errorOrData;
      if (tweets.length === 0) {
        robot.logger.info('yoshiyoshi.js : tweets.length = 0');
        return;
      }
      robot.logger.info('yoshiyoshi.js : tweets.length = ' + tweets.length);

      if (sinceId) {
        tweets.filter(function(tweet) {
          robot.logger.info(tweet.text);
          return tweet.id !== sinceId && isYoshiYoshi(tweet.text);
        }).forEach(function(tweet) {
          var format = 'https://twitter.com/%s/status/%s';
          var url = util.format(format, screenName, tweet.id_str);
          robot.messageRoom(roomName, url);
        });
      }

      sinceId = tweets[0].id;

    });

  }, 10 * 1000);

};
