var build = require('../models/build.js');
var utils = require('../helpers/utils.js');
var git = require('../services/git.js');

var logFactory = require('../helpers/log.js');
var log = logFactory.create("controllers/projects");

module.exports = {

  routes: function(app) {

      app.post('/build', function(req, res){
        if (!req.body.name) {
          res.json({error: "No app specified"});
            return;
        }
          redis.hget("applications", req.body.name, function(err, pro){
            var project = JSON.parse(pro);
            if (!project.repository) build.build(project);
            else {
              git.cloneOrUpdate(project.name, project.repository, true, function() {
                build.build(project);
              });
            }
            res.json({});
          });
      });

      app.get('/build', function(req, res){
          build.allBuilds(req.query.name, function(results) {
              res.json(results.slice(req.query.from,req.query.to)); //Remove first one, Limit 10 results per project
          });
      });
  }
};
