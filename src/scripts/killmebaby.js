// Description
//   killmebaby
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot kill me - send words of Charlie Brown
//
// Notes:
//   None
//
// Author:
//   emanon001
//
module.exports = function(robot) {
  var wordsOfCharlieBrown  = [
"\n\
　　　　　　　　 ,,　＿ \n\
　　　　　　　／ 　　　 ｀ ､ \n\
　　　　　　/　　(_ﾉL_）　 ヽ \n\
　　　　　 /　　 ´・　 ・｀　　l　　　　キルミーベイベーは死んだんだ \n\
　　　　 （l　 　　　し　　　　l）　　　 いくら呼んでも帰っては来ないんだ \n\
.　　　　　l　　　　＿＿　　 l　　　　もうあの時間は終わって、君も人生と向き合う時なんだ \n\
　　　　　 >　､ _ 　　　　 ィ \n\
　　　　 ／　 　　　￣　　 ヽ \n\
　　 　 /　|　　　　　　　　　iヽ \n\
　　　　|＼|　　　　　　　　　|/| \n\
　　　　|　||/＼／＼／＼/|　| \n\
",
"\n\
　　　　　　　　 ,,　＿ \n\
　　　　　　　／ 　　　 ｀ ､ \n\
　　　　　　/　　(_ﾉL_）　 ヽ \n\
　　　　　 /　　 ´・　 ・｀　　l　　　　キルミーベイベーは復活するんだ \n\
　　　　 （l　 　　　し　　　　l）　　　  悲しみの弔鐘はもう鳴り止んだ。 \n\
.　　　　　l　　　、＿＿,　　 l　　　　君は輝ける人生の、その一歩を、再び踏み出す時が来たんだ。 \n\
　　　　　 >　､ _ 　　　　 ィ \n\
　　　　 ／　 　　　￣　　 ヽ \n\
　　 　 /　|　　　　　　　　　iヽ \n\
　　　　|＼|　　　　　　　　　|/| \n\
　　　　|　||/＼／＼／＼/|　| \n\
"
  ];

  var randomWithRange = function (min, max) {
    return Math.floor( Math.random() * ( max - min + 1) + min );
  };
  
  robot.respond(/kill\s+me(\s?baby)?$/i, function(res) {
    var word = wordsOfCharlieBrown[randomWithRange(0, wordsOfCharlieBrown.length - 1)];
    res.send(word);
  });
};
