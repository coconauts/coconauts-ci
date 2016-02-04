var utils = require('../helpers/utils.js');
var slack = require('../services/slack.js');

var logFactory = require('../helpers/log.js');
var log = logFactory.create("models/build");

var exec = require('child_process').exec;
var cdProjects = "cd "+ config.projects+ " && ";
var ansibleHome = "export ANSIBLE_HOME=/home/pi/coconauts-ansible && ";
var buildProject = function(project) {
  log.info("Building project", project);

  var time =(new Date()).getTime();
  save(time, project.name, "in_progress", "");

  var command = ansibleHome;
  if (project.repository) command += cdProjects + "cd "+project.name +" && ";
  command += project.commands.replace(/\n/g, " && ");

  buildExec(project.name, command , project.logSuccess === 'true');

  redis.hset("last_exec", project.name, time);
};

var buildExec = function(projectName, command, logSuccess){
  command = command.replace(/( && )+/g, ' && ');
  log.info("Executing commands:\n", command);

  exec(command, function(error, stdout, stderr) {
      var time =(new Date()).getTime();
       if (error) {
         log.error("Error on build: "+ error);
         save(time, projectName, "error", "Stdout:\n"+stdout+"\nError:\n"+error+"\nStderr:\n"+stderr);
       }
       else { //Build success
         log.info(stdout);
         save(time, projectName, "success", stdout);
       }
   });
};

var buildsByProject = function(callback) {
  redis.hgetall("build_status", function(err, results) {
    var projects = {}

    for (var i in results){
      var build = JSON.parse(results[i]);
      var milisAgo = (new Date()).getTime() - build.time;

      build.humanTime = utils.timestampToHumanTime(milisAgo);
      if (!projects[build.name]) {
        projects[build.name] = {
          name: build.name,
          builds: [],
          lastBuild: build
        }
      }
      if (projects[build.name].lastBuild.time < build.time){
        projects[build.name].lastBuild = build;
      }
      projects[build.name].builds.push(build);
    }

    projects = utils.objectToArray(projects);

    //Sort and limit
    for (var i in projects) {
      var project = projects[i];
      project.builds = project.builds.sort(function(a, b) {
          return  b.time - a.time;
      }).splice(0,10);
    }

    //log.info("PRojects", projects);

    callback(projects);
  });
}
buildsByProject(function(){});

var allBuilds = function(name, callback){
  redis.hgetall("build_status", function(err, results) {
    var builds = [];
    for (var i in results){
      var build = JSON.parse(results[i]);
      if (build.name == name) {
        var milisAgo = (new Date()).getTime() - build.time;
        build.humanTime = utils.timestampToHumanTime(milisAgo);
        builds.push(build);
      }
    }
    builds.sort(function(a, b) {
        return  b.time - a.time;
    })
    callback(builds);
  });
}

var deleteBuilds = function(name){
  redis.hgetall("build_status", function(err, results) {

    for (var i in results){
      var project = JSON.parse(results[i]);
      if (project.name == name) redis.hdel("build_status", project.id);
    }
  });

}

var save = function(time, name, status, output) {
  if (!time) time =(new Date()).getTime();
  var build = name + ":" + parseInt(time/1000);
  var status = {id: build, status: status, time: time, name: name, output: output};
  log.info("Build status " , status);
  redis.hset("build_status", build, JSON.stringify(status));

}
//Not used
/*
var allBuildsByProject = function(callback){

      redis.hgetall("build_status", function(err, results) {

        var builds = {};
        for (var i in results){
          var project = JSON.parse(results[i]);
            if (!builds[project.name]) builds[project.name] = [];
            if (builds[project.name].length < 10 ) builds[project.name].push(project);
        }

        callback( builds);
      });
}*/

var lastBuild = function(name, callback){
  allBuilds(name, function(builds){
    callback(builds[builds.length-1]);
  })
}

module.exports = {
  build: buildProject,
  buildsByProject: buildsByProject,
  allBuilds: allBuilds,
  //allBuildsByProject: allBuildsByProject,
  deleteBuilds: deleteBuilds,
  save: save
};
