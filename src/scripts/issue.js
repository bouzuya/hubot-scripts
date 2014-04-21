// Description
//   issue
//
// Dependencies:
//   "backlog-api": "1.0.2"
//
// Configuration:
//   HUBOT_ISSUE_SPACE_ID
//   HUBOT_ISSUE_USERNAME
//   HUBOT_ISSUE_PASSWORD
//
// Commands:
//   hubot issue <issue-key> - display backlog issue info
//
// Author:
//   bouzuya
//
module.exports = function(robot) {
  var backlogApi = require('backlog-api');

  robot.respond(/issue\s+(\S+)\s*$/i, function(res) {
    var issueKey = res.match[1].toUpperCase();

    var backlog = backlogApi(
      process.env.HUBOT_ISSUE_SPACE_ID,
      process.env.HUBOT_ISSUE_USERNAME,
      process.env.HUBOT_ISSUE_PASSWORD
    );
    backlog.getIssue({ issueKey: issueKey }).then(function(issue) {
      res.send(issue.url + '\n' + issue.summary);
    });
  });
};

