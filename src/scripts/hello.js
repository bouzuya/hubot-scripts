// Description
//   hello
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot hello - say hello
//
// Notes:
//   None
//
// Author:
//   Ayumu Yamauchi
//
module.exports = function(robot) {
  robot.respond(/hello/, function(res) {
    res.send('hello!');
  });
};

