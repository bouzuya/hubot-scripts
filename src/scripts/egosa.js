// Description
//   twitter ego search
//
// Dependencies:
//   "twitter": "^0.2.8",
//
// Configuration:
//   HUBOT_EGOSA_KEYWORDS
//   HUBOT_EGOSA_ROOM_NAME
//   HUBOT_EGOSA_CONSUMER_KEY
//   HUBOT_EGOSA_CONSUMER_SECRET
//   HUBOT_EGOSA_ACCESS_TOKEN
//   HUBOT_EGOSA_ACCESS_TOKEN_SECRET
//
// Commands:
//   hubot egosa list - list twitter ego search keywords
//   hubot egosa start <keyword> - start twitter ego search <keyword>
//   hubot egosa stop <N> - stop twitter ego search
//   hubot egosa <keyword> - twitter search <keyword>
//
// Author:
//   bouzuya
//
module.exports = function(robot) {
  // require
  var util = require('util');
  var Twitter = require('twitter');

  // function
  var initialize = function(s) {
    var parsed = JSON.parse(s || '[]');
    parsed.forEach(function(keyword) { start(keyword); });

    // watch timeline
    setInterval(watch, 60 * 1000);
  };

  var enabled = function(item) {
    return item.enabled;
  };

  var formatKeyword = function(item, msg) {
    return '[' + item.index + ']: "' + item.keyword + '"';
  };

  var formatTweet = function(tweet) {
    var format = 'https://twitter.com/%s/status/%s';
    var url = util.format(format, tweet.user.screen_name, tweet.id_str);
    return url;
  };

  var start = function(keyword) {
    var item = {
      index: keywords.length,
      keyword: keyword,
      enabled: true,
      envelope: { room: process.env.HUBOT_EGOSA_ROOM_NAME, },
    };
    keywords.push(item);
    return item;
  };

  var stop = function(index) {
    var filtered = keywords.filter(enabled).filter(function(item) {
      return item.index === index;
    });
    if (filtered.length === 0) {
      return null;
    }
    filtered[0].enabled = false;
    return filtered[0];
  }

  var watch = function() {
    keywords.filter(enabled).forEach(function(item) {
      var options = {};
      if (item.sinceId) {
        options.since_id = item.sinceId;
      }
      search(item.keyword, options, function(err, data) {
        if (err) {
          robot.logger.error(err);
        } else {
          if (item.sinceId) {
            data.statuses.filter(function(tweet) {
              return tweet.id > item.sinceId;
            }).forEach(function(tweet) {
              robot.send(item.envelope, formatTweet(tweet));
            });
          }
          if (data.statuses.length > 0) {
            item.sinceId = data.statuses[0].id;
          }
        }
      });
    });
  };

  var search = function(keyword, options, callback) {
    var twitter = new Twitter({
      consumer_key:                 process.env.HUBOT_EGOSA_CONSUMER_KEY,
      consumer_secret:              process.env.HUBOT_EGOSA_CONSUMER_SECRET,
      consumer_access_token_key:    process.env.HUBOT_EGOSA_ACCESS_TOKEN,
      consumer_access_token_secret: process.env.HUBOT_EGOSA_ACCESS_TOKEN_SECRET
    });
    twitter.search(keyword, options, function(errorOrData) {
      if (errorOrData.statusCode && errorOrData.statusCode !== 200) {
        callback(errorOrData);
      } else {
        callback(null, errorOrData);
      }
    });
  };

  // variable
  var keywords = [];

  initialize(process.env.HUBOT_EGOSA_KEYWORDS);

  // hubot egosa list
  robot.respond(/egosa\s+list$/i, function(res) {
    res.send.apply(res, keywords.filter(enabled).map(function(item) {
      return formatKeyword(item);
    }));
  });

  // hubot egosa start <keyword>
  robot.respond(/egosa\s+start\s+(\S+)$/i, function(res) {
    var keyword = res.match[1];
    var item = start(keyword);
    res.send(formatKeyword(item) + ' start');
  });

  // hubot egosa stop [<N>]
  robot.respond(/egosa\s+stop(\s+(\d+))?$/i, function(res) {
    var index = res.match[2] ? parseInt(res.match[2], 10) : (keywords.length - 1);
    var item = stop(index);
    if (item) {
      res.send(formatKeyword(item) + ' stop');
    }
  });

  // hubot egosa <keyword> [<N>]
  robot.respond(/egosa\s+(\S+)(\s+(\d+))?$/i, function(res) {
    var keyword = res.match[1];
    if (/^list|start|stop$/.test(keyword)) {
      return;
    }

    var count = res.match[3] ? parseInt(res.match[3], 10) : 5;
    search(keyword, { count: count }, function(err, data) {
      if (err) {
        robot.logger.error(err);
      } else {
        data.statuses.forEach(function(tweet) {
          res.send(formatTweet(tweet));
        });
      }
    });
  });

};

