// Description
//   lgtm 
//
// Dependencies:
//   "cheerio": "^0.13.1"
//   "request": "^2.34.0"
//
// Configuration:
//   None
//
// Commands:
//   hubot lgtm - receive a lgtm
//   hubot lgtm bomb N - get N lgtm
//
// Notes:
//   None
//
// Author:
//   bouzuya
//
module.exports = function(robot) {
  var cheerio = require('cheerio');
  var request = require('request');

  var lgtm = function(count, callback) {
    var f = function(count, result, done) {
      if (count <= 0) {
        return done(null, result);
      }

      request('http://www.lgtm.in/g', function(err, resp) {
        if (err) return done(err);

        var $ = cheerio.load(resp.body);
        var url = $('#imageUrl').val();
        result.push(url);

        f(count - 1, result, done);
      });
    };

    f(count, [], callback);
  };

  robot.respond(/lgtm(\s+bomb(\s+(\d+))?)?$/i, function(res) {
    var bomb = res.match[1];
    var bombN = res.match[3];
    var count = (bombN ? parseInt(bombN, 10) : (bomb ? 5 : 1));

    lgtm(count, function(err, urls) {
      if (err) return res.send(err);
      res.send.apply(res, urls);
    });
  });
};

