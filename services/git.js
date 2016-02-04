
var logFactory = require('../helpers/log.js');
var log = logFactory.create("services/git");

var exec = require('child_process').exec;

var cdProjects = "cd "+ config.projects+ ";";

var cloneOrUpdate = function(name, repo, forceBuild, buildCallback){
  var command= cdProjects+"git clone "+repo +" "+name;

  exec(command, function(error, stdout, stderr) {
       if (error) {
         if (stderr.indexOf("already exists") != -1) {
           log.info("Repo already exists");
           update(name, forceBuild, buildCallback);
         } else {
           log.error("Unexpected error on clone "+repo+": "+ error);
         }
       } else { //Clone success
         buildCallback();
         log.info(stdout);
       }
   });
};

var update = function(name,forceBuild, buildCallback){
  var command= cdProjects+"cd "+name+" && git pull";
  log.info("Updating repository " + name);
  exec(command, function(error, stdout, stderr) {
    if (error) {
      log.error("Unable to update repo " + error);
    } else { //Update success
      if (forceBuild || stdout.indexOf("Already up-to-date") == -1){
        log.info(stdout);
        log.info("Repo has been updated, building...");
        buildCallback();
      }
      else {
        log.info("Nothing has changed");
      }
    }
  });
};

module.exports = {
  cloneOrUpdate: cloneOrUpdate
};
