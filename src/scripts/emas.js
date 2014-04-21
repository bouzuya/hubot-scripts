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

  // ex: '["8056759", "14818701" [, ...]]'
  var mylistIds = JSON.parse(process.env.HUBOT_EMAS_MYLIST_IDS || '[]');
  var mylistUrls = mylistIds.map(function (id) {
    return util.format('http://nicomy.net/api/%s.json', id);
  });

  var videoCache = null;
  var getAllVideos = function () {
    var deferred = q.defer();

    if (videoCache) {
      deferred.resolve(videoCache);
      return deferred.promise
    }

    q.all(
      mylistUrls.map(function (url) {
        return getVideos(url);
      })
    )
    .spread(function () {
      var videosOfEachMylist = [].slice.call(arguments);
      var allVideos = videosOfEachMylist.reduce(function (acc, videos) {
        return acc.concat(videos);
      }, []);
      videoCache = allVideos;
      deferred.resolve(allVideos);
    })
    .fail(function (err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  var getVideos = function (url) {
    var deferred = q.defer();

    request.post(
      url,
      { form: { limit: 100 } },
      function(err, _, body) {
        if (err) deferred.reject(err);

        var json = JSON.parse(body);
        var videos = json.mylist_item_data
        .filter(function (video) {
          return video.item_data.deleted === '0';
        });

        deferred.resolve(videos);
      });

    return deferred.promise;
  };

  var getVideoDetail = function (id) {
    var deferred = q.defer();

    var url = util.format('http://ext.nicovideo.jp/api/getthumbinfo/%s', id);
    request(url, function (err, _, body) {
      if (err) deferred.reject(err);

      xml2js.parseString(body, function (err, video) {
        if (err) deferred.reject(err);

        deferred.resolve(normalizeVideoDetailJson(video));
      });
    });

    return deferred.promise;
  };

  var normalizeVideoDetailJson = function (json) {
    var data = json.nicovideo_thumb_response.thumb[0];
    return Object.keys(data).reduce(function (acc, key) {
      acc[key] = data[key][0];
      return acc;
    }, {});
  };

  var randomWithRange = function (min, max) {
    return Math.floor( Math.random() * ( max - min + 1) + min );
  };

  var choiceVideo = function (videos) {
    return videos[randomWithRange(0, videos.length - 1)];
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
    getAllVideos()
    .then(function (videos) {
      var video = choiceVideo(videos);
      return getVideoDetail(video.item_data.video_id);
    })
    .then(function (video) {
      res.send.apply(res, createMessages(video));
    })
    .fail(function (err) {
      res.send(err);
    });
  });
};
