// Description
//   script-issue
//
// Dependencies:
//   "backlog-api": "1.0.2"
//   "q": "1.0.1"
//
// Configuration:
//   HUBOT_SCRIPT_ISSUE_SPACE_ID
//   HUBOT_SCRIPT_ISSUE_USERNAME
//   HUBOT_SCRIPT_ISSUE_PASSWORD
//   HUBOT_SCRIPT_ISSUE_PROJECT_KEY
//   HUBOT_SCRIPT_ISSUE_COMPONENT_NAME
//
// Commands:
//   hubot script-issue - display hubot-script issues
//   hubot script-issue <issue> - create a hubot-script issue
//
// Notes:
//   None
//
// Author:
//   bouzuya
//
module.exports = function(robot) {
  var util = require('util');
  var backlogApi = require('backlog-api');
  var q = require('q');

  robot.respond(/script-issue(\s+(\S.*?))?\s*$/i, function(res) {
    var spaceId  = process.env.HUBOT_SCRIPT_ISSUE_SPACE_ID;
    var username = process.env.HUBOT_SCRIPT_ISSUE_USERNAME;
    var password = process.env.HUBOT_SCRIPT_ISSUE_PASSWORD;
    var projectKey = process.env.HUBOT_SCRIPT_ISSUE_PROJECT_KEY;
    var componentName = process.env.HUBOT_SCRIPT_ISSUE_COMPONENT_NAME;

    var backlog = backlogApi(spaceId, username, password);

    var projectId;
    var componentId;
    backlog.getProject({ projectKey: projectKey })
    .then(function(project) {
      projectId = project.id;
      return backlog.getComponents({ projectId: projectId });
    })
    .then(function(components) {
      var component = components.filter(function(c) {
        return c.name === componentName;
      })[0];
      componentId = component.id;

      if (res.match[1]) {
        return backlog.createIssue({
          projectId: projectId,
          summary: res.match[2],
          componentId: componentId,
        });
      } else {
        var deferred = q.defer();
        deferred.resolve();
        return deferred.promise;
      }
    })
    .then(function() {
      return backlog.findIssue({
        projectId: projectId,
        componentId: componentId,
        statusId: [1, 2, 3],
      });
    })
    .then(function(issues) {
      res.send(issues.map(function(i) {
        return i.summary + ' ' + i.url;
      }).join('\n'));
    })
    .fail(function(e) {
      res.send('error:' + util.inspect(e));
    });
  });
};

