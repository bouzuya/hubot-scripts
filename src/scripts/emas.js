// Description
//   emanon001 favorite nicom@s
//
// Dependencies:
//   "q": "1.0.1"
//   "request": "^2.34.0"
//   "xml2js": "0.4.2"
//
// Configuration:
//   None
//
// Commands:
//   hubot emas
//
// Notes:
//   None
//
// Author:
//   emanon001
//
module.exports = function(robot) {
  var util = require('util');
  var q = require('q');
  var request = require('request');
  var xml2js = require('xml2js');
  var parser = new xml2js.Parser({ explicitArray: false });

  // ex: '["8056759", "14818701" [, ...]]'
  var mylistIds = JSON.parse(process.env.HUBOT_EMAS_MYLIST_IDS || '[]');
  var mylistUrls = mylistIds.map(function (id) {
    return util.format('http://nicomy.net/api/%s.json', id);
  });

  var videoIdCache = null;
  var getAllVideoIds = function () {
    var deferred = q.defer();

    if (videoIdCache) {
      deferred.resolve(videoIdCache);
      return deferred.promise
    }

    q.all(
      mylistUrls.map(function (url) {
        return getVideoIds(url);
      })
    )
    .spread(function () {
      var videoIdsOfEachMylist = [].slice.call(arguments);
      var allVideoIds = videoIdsOfEachMylist.reduce(function (acc, videoIds) {
        return acc.concat(videoIds);
      }, []);
      videoIdCache = allVideoIds;
      deferred.resolve(allVideoIds);
    })
    .fail(function (err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  var getVideoIds = function (url) {
    var deferred = q.defer();

    request.post(
      url,
      { form: { limit: 100 } },
      function(err, _, body) {
        if (err) deferred.reject(err);

        var json = JSON.parse(body);
        var videoIds = json.mylist_item_data
        .filter(function (video) {
          return video.item_data.deleted === '0';
        })
        .map(function (video) {
          return video.item_data.video_id;
        });

        deferred.resolve(videoIds);
      });

    return deferred.promise;
  };

  var getVideoDetail = function (id) {
    var deferred = q.defer();

    var url = util.format('http://ext.nicovideo.jp/api/getthumbinfo/%s', id);
    request(url, function (err, _, body) {
      if (err) deferred.reject(err);

      parser.parseString(body, function (err, video) {
        if (err) deferred.reject(err);

        deferred.resolve(video.nicovideo_thumb_response.thumb);
      });
    });

    return deferred.promise;
  };

  var randomWithRange = function (min, max) {
    return Math.floor( Math.random() * ( max - min + 1) + min );
  };

  var choice = function (coll) {
    return coll[randomWithRange(0, coll.length - 1)];
  };

  var createMessages = function (video) {
    // サムネイルURL
    // タイトル(時間)
    // 動画紹介文
    // 各種数値
    // 動画URL

    return [
      video.thumbnail_url + '#.jpg', // for hipchat
      util.format(
        "%s\n%s\n%s\n%s",
        util.format('%s (%s)', video.title, video.length),
        video.description,
        util.format('再生数:%s コメント数:%s マイリスト数:%s',
          video.view_counter, video.comment_num, video.mylist_counter),
        util.format('http://www.nicovideo.jp/watch/%s', video.video_id)
      )
    ];
  };

  robot.respond(/emas$/i, function (res) {
    getAllVideoIds()
    .then(function (videoIds) {
      var videoId = choice(videoIds);
      return getVideoDetail(videoId);
    })
    .then(function (video) {
      res.send.apply(res, createMessages(video));
    })
    .fail(function (err) {
      res.send(err);
    });
  });
};
