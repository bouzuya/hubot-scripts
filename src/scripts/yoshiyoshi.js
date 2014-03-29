// Description
//   yoshiyoshi
//
// Dependencies:
//   "twitter": "^0.2.8" 
//
// Configuration:
//   HUBOT_YOSHIYOSHI_TWITTER_CONSUMER_KEY
//   HUBOT_YOSHIYOSHI_TWITTER_CONSUMER_SECRET
//   HUBOT_YOSHIYOSHI_TWITTER_ACCESS_TOKEN_KEY
//   HUBOT_YOSHIYOSHI_TWITTER_ACCESS_TOKEN_SECRET
//   HUBOT_YOSHIYOSHI_SCREEN_NAME
//   HUBOT_YOSHIYOSHI_ROOM_NAME
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

  var screenName = process.env.HUBOT_YOSHIYOSHI_SCREEN_NAME;
  var roomName = process.env.HUBOT_YOSHIYOSHI_ROOM_NAME;

  var twitter = new Twitter({
    consumer_key:                 process.env.HUBOT_YOSHIYOSHI_TWITTER_CONSUMER_KEY,
    consumer_secret:              process.env.HUBOT_YOSHIYOSHI_TWITTER_CONSUMER_SECRET,
    consumer_access_token_key:    process.env.HUBOT_YOSHIYOSHI_TWITTER_ACCESS_TOKEN,
    consumer_access_token_secret: process.env.HUBOT_YOSHIYOSHI_TWITTER_ACCESS_TOKEN_SECRET
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

  }, 60 * 1000);

};
