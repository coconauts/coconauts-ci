var build = require('../models/build.js');
var utils = require('../helpers/utils.js');
var git = require('../services/git.js');

var logFactory = require('../helpers/log.js');
var log = logFactory.create("controllers/projects");

module.exports = {

  routes: function(app) {
      app.get('/project', function(req, res){
        redis.hget("applications", req.query.name, function(err, result) {
            res.json(JSON.parse(result));
        });

      });

      app.delete('/project', function(req, res){
        console.log("Removing application "+ req.body.name);
        redis.hdel("applications", req.body.name);
        res.json({});

        build.deleteBuilds(req.body.name);
      });

      app.get('/projects', function(req, res){

        build.buildsByProject(function(projects){
          res.json({
            applications : projects
          })
        })
      });

      app.post('/project', function(req, res) {
          console.log("POST body ", req.body);
          redis.hset("applications", req.body.name, JSON.stringify(req.body));
          res.json(req.body);

          build.save(undefined, req.body.name, "new", "");
      });
  }
};
