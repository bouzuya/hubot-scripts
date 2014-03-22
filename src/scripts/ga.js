// Description
//   google analytics
//
// Dependencies:
//   "googleapis": "^0.6.1",
//   "moment": "^2.5.1",
//   "q": "^1.0.1",
//
// Configuration:
//   HUBOT_GA
//
// Commands:
//   hubot ga <name> - display google analytics
//
// Author:
//   bouzuya
//
module.exports = function(robot) {
  var util = require('util');
  var q = require('q');
  var googleapis = require('googleapis');
  var moment = require('moment');

  var ANALYTICS_SCOPE = [
    'https://www.googleapis.com/auth/analytics',
    'https://www.googleapis.com/auth/analytics.readonly'
  ];
  var ANALYTICS_API_NAME = 'analytics';
  var ANALYTICS_API_VERSION = 'v3';

  var authorize = function(options) {
    var deferred = q.defer();
    var email = options.email;
    var keyFile = null; // provide "key" parameter
    var key = options.key;
    var scope = ANALYTICS_SCOPE;
    var subject = null;
    var jwt = new googleapis.auth.JWT(email, keyFile, key, scope, subject);
    jwt.authorize(function(err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(jwt);
      }
    });
    return deferred.promise;
  };

  var request = function(auth, options) {
    var deferred = q.defer();
    googleapis
    .discover(ANALYTICS_API_NAME, ANALYTICS_API_VERSION)
    .execute(function(err, client) {
      if (err) {
        deferred.reject(err);
      } else {
        var req = client.analytics.data.ga.get(options).withAuthClient(auth);
        req.execute(function(err, result) {
          if (err) {
            deferred.reject(err);
          } else {
            deferred.resolve(result);
          }
        });
      }
    });
    return deferred.promise;
  };

  var respond = function(res, data) {
    var r = data.totalsForAllResults;
    var msg = util.format(
      'PV: %s, UU: %s, Session: %s',
      r['ga:pageviews'],
      r['ga:visits'],
      r['ga:visitors']
    );
    res.send(msg);
  };

  // [{ "id": "analytics profile id", "name": "account name", "email": "service account email address", key: "service account private key text" }]
  // e.g. [{ "id": "ga:99999999", "name": "example.com", "email": "999999999999-abcdefghiklmnopqrstuvwxyz@developer.gserviceaccount.com", key: "-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----" }]
  var configs = JSON.parse(process.env.HUBOT_GA);

  robot.respond(/ga (\S+)$/, function(res) {
    var name = res.match[1];
    var targets = configs.filter(function(config) { return config.name === name; });
    var ga = (targets.length > 0 ? targets[0] : null);
    if (!ga) {
      return;
    }

    var today = moment().format('YYYY-MM-DD');
    var requestOptions = {
      'ids': ga.id,
      'start-date': today,
      'end-date': today,
      'metrics': 'ga:pageviews,ga:visits,ga:visitors',
    };

    authorize({ email: ga.email, key: ga.key })
    .then(function(auth) { return request(auth, requestOptions); })
    .then(function(result) { return respond(res, result); });
  });
};

