var compressor = require('node-minify'); //https://github.com/expressjs/cookie-session
var fs = require('fs');

var logFactory = require('./log.js');
var log = logFactory.create("helpers/minify");

module.exports = {
  public: function(){

    //minify js files
    //Supervisor will restart in a loop, ignore the min.js file using:
    //supervisor -i public/js/emma.min.js app.js
    var emmaJs = 'public/js/emma/';
    var list = fs.readdirSync(emmaJs);
    var compressType = (process.env.DEBUG)?'no-compress':'gcc';

    log.debug("Minifying js with method "+compressType+" in "+ emmaJs+ ": " + list);
    var files = [];
    list.forEach(function(file) {
      files.push(emmaJs+file);
    });

    new compressor.minify({
      type: compressType,
      fileIn: files,
      fileOut: 'public/js/emma.min.js',
      callback: function(err, min){
        if (err) log.error("Unable to minify JS", err);
      }
    });
  }
};
