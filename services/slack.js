

var logFactory = require('../helpers/log.js');
var log = logFactory.create("services/slack");

var request = require('superagent');

var notify = function(message){

  //curl -X POST --data-urlencode 'payload={"channel": "#coconauts-ci", "username": "webhookbot", "text": "This is posted to #coconauts-ci and comes from a bot named webhookbot.", "icon_emoji": ":ghost:"}' https://hooks.slack.com/services/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

  var payload = 'payload={"channel": "#coconauts-ci", "username": "coconauts-ci", "text": "'+message+'", "icon_emoji": ":hammer_and_wrench:"}';
  request
      .post(config.slack_hook)
      .type('form')
      .send(payload)
      .end(function(err, res){
        log.info("Slack response code: "+res.statusCode+ ", body: ",res.body);
      });
};

var last5lines = function(stdout) {
  var logs = stdout.split("\n");
  var last5lines = stdout.split("\n").slice(logs.length - 6, logs.length );
  return "["+logs.length + " lines]\n"+last5lines.join("\n");
};
var success = function(project, stdout) {

  var message = ":green_heart: Project *"+project + "* success:\n```"+ last5lines(stdout)+ "```";
  notify(message);

};

var error = function(project, stdout) {
  var message = ":red_circle: Project *"+project + "* error:\n```"+ last5lines(stdout)+ "```";
  notify(message);
};

module.exports = {
  notify:notify,
  success: success,
  error:error
};
