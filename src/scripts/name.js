// Description
//   service name
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot name <part-of-name> [<count>] - generate service name
//
// Author:
//   bouzuya
//
module.exports = function(robot) {
  var KANA_MIN = 3040;
  var KANA_MAX = 3096;
  var KANA = new RegExp(JSON.parse(
    '"^[\\u' + KANA_MIN + '-\\u' + KANA_MAX +']$"'
  ));

  var generateKana = function() {
    var min = KANA_MIN;
    var max = KANA_MAX;
    var r = Math.floor(Math.random() * (max - min)) + min;
    return JSON.parse('"\\u' + r + '"');
  };

  var generateName = function(part) {
    var pattern = KANA;
    var chars = [];
    for (var i = 0; i < part.length; i++) {
      var c = part[i];
      chars.push(pattern.test(c) ? c : generateKana());
    }
    return chars.join('');
  };

  robot.respond(/name\s+(\S+)(\s+(\d+))?$/i, function(res) {
    var part = res.match[1];
    var count = parseInt(res.match[3] || 20, 10);
    var names = [];
    for (var i = 0; i < count; i++) {
      names.push(generateName(part));
    }
    res.send(names.join('\n'));
  });
};

