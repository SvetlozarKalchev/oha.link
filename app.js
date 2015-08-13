var http = require('http');
var url = require('url');
var shortener = require('./shortener.js');

http.createServer(function(req, res) {
  if(req.url != '/favicon.ico') {
    var q = url.parse(req.url, true);
    console.log(q.query)
    shortener.shorten(q.query['url'], function(err, result) {
      res.write(result);
      res.end();

    });
  }
  else {

  };

}).listen(8000);
