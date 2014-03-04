// Description
//   shiranakatta 
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   知らなかった そんなの… - send image url
//
// Notes:
//   None
//
// Author:
//   Ayumu Yamauchi
//
module.exports = function(robot) {
  robot.hear(/(し|知)らなかった.*そんなの.*$/i, function(res) {
    res.send('http://s3-ap-northeast-1.amazonaws.com/shiranakatta/sonnano.jpg');
  });
};

