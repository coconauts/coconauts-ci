var git = require('../services/git.js');
var build = require('../models/build.js');
var utils = require('../helpers/utils.js');

var logFactory = require('../helpers/log.js');
var log = logFactory.create("background/build");

var buildFrequency = 60 * 1000;

setInterval(function(){
  buildProjects();
}, buildFrequency);

var buildProjects = function(){
  redis.hgetall("applications", function(err, projects){
    for (var i in projects){
      var project = JSON.parse(projects[i]);

      checkFrequencyAndBuild(project);
    }
  });

};

var checkFrequencyAndBuild = function(project) {
  log.debug("checkFrequencyAndBuild")
  redis.hget("last_exec", project.name, function(err, lastExec){

    log.info("Project last exec", lastExec);
    var now = (new Date()).getTime();
    var frequency = frequencyInMilliseconds(project);
    log.info("Project frequency", frequency);

    var remaining = parseInt(lastExec) + frequency - now;
    if (!lastExec || remaining <= 0  ){
      if (!project.repository) build.build(project);
      else {
        git.cloneOrUpdate(project.name, project.repository, false, function() {
          build.build(project);
        });
      };
    } else {
      var remainingHuman = utils.timestampToHumanTime(remaining);
      log.info("Skipping, remaining time for build: "+ remainingHuman);
    }
  });
}

//Force build projects on startup
buildProjects();

var frequencyInMilliseconds = function(project) {
  var mult = 1000;
  switch(project.frequency.unit) {
    case 'd': mult*=24*60*60; break;
    case 'h': mult*=60*60; break;
    case 'm': mult*=60; break;
    default: log.error("Undefined project.frequency.unit", project.frequency);
  }
  return parseInt(project.frequency.value) * mult;
}
