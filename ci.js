//dependencies
var express = require("express");
var bodyParser  = require('body-parser');
var session = require('cookie-session');

var logFactory = require('./helpers/log.js');
var log = logFactory.create("app");

//Exports app make it testable from supertest
var app = exports.app = express();
global.app = app;

/**
 *  == Load controllers ==
 */
global.config = require('./config.json');
if (!config.port) config.port=8950;


global.redis = require('redis').createClient();
//log.info("ENV settings ",global.env);

if (config.DEBUG) log.debug("Running node.js server in DEBUG mode");

app.use(express.static(__dirname + '/public'));
//Do not export everything (keep index.html out so we can intercept / endpoint)
/*app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use(favicon(__dirname + '/public/favicon.ico'));
*/
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(session({
  keys: ["coconauts"]
}));


/**
 *  == Load controllers ==
 */
 require('./controllers/projects.js').routes(app);
 require('./controllers/builds.js').routes(app);

 /**
  *  == Load background ==
  */
 require('./background/build.js');

// require('./services/git.js');
// require('./services/build.js');

app.listen(config.port);
log.info("Server started in http://localhost:"+config.port);
