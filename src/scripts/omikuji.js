// Description
//   omikuji
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot omikuji - omikuji!
//
// Notes:
//   None
//
// Author:
//   Ayumu Yamauchi
//
module.exports = function(robot) {
  robot.respond(/OMIKUJI$/i, function(res) {
    res.send(res.random([
      '大吉',
      '吉',
      '中吉',
      '小吉',
      '半吉',
      '末吉',
      '末小吉',
      '平',
      '凶',
      '小凶',
      '半凶',
      '末凶',
      '大凶'
    ]));
  });
};

