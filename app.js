var http = require('http');
var url = require('url');
var Shortener = require('./shortener.js');

http.createServer(function(req, res) {
  if(req.url != '/favicon.ico' && req.url == '/shorten') {
    var q = url.parse(req.url, true);
    console.log(q.query)
    shortener.shorten(q.query['url'], function(err, result) {
      res.write(result);
      res.end();

    });
  }
  else if(req.url != '/favicon.ico' && req.url.length <= 30){
    var q = url.parse(req.url, true);

    var link ='oha.link' + q['path'];

    console.log('req url ' + link)

    shortener.returnShortenedLink(link, function(err, result) {
      if(!err && result !== null) {
        console.log('301');
        res.writeHead(301, {'Location': 'http://' + result[0]['URL']});

        res.end();
      }
      else {
        res.write('URL not found in DB');
        res.end();
      }
    })
  }
  else {
    res.write('error');
    res.end();
  }

}).listen(8000);
