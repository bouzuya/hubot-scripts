// Description
//   emanon001 favorite nicom@s
//
// Dependencies:
//   "q": "1.0.1"
//   "request": "^2.34.0"
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

  var randomWithRange = function (min, max) {
    return Math.floor( Math.random() * ( max - min + 1) + min );
  };

  var choiceVideo = function (videos) {
    return videos[randomWithRange(0, videos.length - 1)];
  };

  var createMessages = function (video) {
    var videoData = video.item_data;
    return [
      videoData.thumnail_cache_url,
      util.format('%s (%s)', videoData.title,
        formatLengthSeconds(videoData.length_seconds)),
      util.format('再生数:%s コメント数:%s マイリスト数:%s',
        videoData.view_counter, videoData.num_res, videoData.mylist_counter),
      util.format('http://www.nicovideo.jp/watch/%s', videoData.video_id),
    ];
  };

  var formatLengthSeconds = function (ls) {
    // m:ss
    var m = Math.floor(ls / 60);
    var s = ls % 60;
    return util.format('%s:%s', m, s > 10 ? s : '0' + s);
  };

  robot.respond(/emas$/i, function (res) {
    getAllVideos()
    .then(function (videos) {
      var video = choiceVideo(videos);
      res.send.apply(res, createMessages(video));
    })
    .fail(function (err) {
      res.send(err);
    });
  });
};
