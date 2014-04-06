// Description
//   gengo
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot gengo [<year>] - display japanese era
//
// Notes:
//   - 明治以降のみに対応。
//   - 日付の判定はなく、境界の年には次の元年を優先。
//
// Author:
//   bouzuya
//
module.exports = function(robot) {
  var M_START = 1868;
  var T_START = 1912;
  var S_START = 1926;
  var H_START = 1989;

  robot.respond(/gengo(\s+(\d+))?$/i, function(res) {
    var year = parseInt(res.match[2] || (new Date().getYear() + 1900), 10);
    if (year < M_START) {
      res.send('知りません');
    } else if (year < T_START) {
      var m = year - M_START + 1;
      res.send('明治' + (m === 1 ? '元' : m) + '年');
    } else if (year < S_START) {
      var t = year - T_START + 1;
      res.send('大正' + (t === 1 ? '元' : t) + '年');
    } else if (year < H_START) {
      var s = year - S_START + 1;
      res.send('昭和' + (s === 1 ? '元' : s) + '年');
    } else {
      var h = year - H_START + 1;
      res.send('平成' + (h === 1 ? '元' : h) + '年');
    }
  });
};

