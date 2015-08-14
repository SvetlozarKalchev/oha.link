var http = require('http');
var url = require('url');

var ShortenerObject = require('./shortener.js');

// Initiate DB connection
var Shortener = new ShortenerObject();
Shortener.db.connect_to_database();

http.createServer(function(req, res) {
  /*

    if !favicon && path.length == 5 {
      find SURL and redirect
    }
    if !favicon && query == url {
      shorten URL and return SURL
    }
    else {
    return error
    }

  */
  var parsedRequest = url.parse(req.url);

  if(req.url == '/') {
    res.write('Home');
    res.end();
  }
  else if(req.url != '/favicon.ico' && parsedRequest.path.length == 4) {
    Shortener.getShortenedLink('oha.link' + parsedRequest.path
    , function (err, result) {
      if(!err) {
        res.writeHead(302,
           {'Location': 'http://' + result});
        res.end()
      }
      else {
        console.log(err);
        res.write("Invalid shortened URL.");
        res.end();
      }
    });
  }
  else if(req.url != '/favicon.ico' && parsedRequest.pathname == '/shorten') {
    Shortener.shorten(parsedRequest.query, function(err, result) {
      // If a new URL gets shortened, an array with the length of 2
      // gets returned
      if(!err && result.length == 2) {
        console.log('Shortened ' + result[0] + 'to: ' + result[1]);
        res.write(result[1]);
        res.end();
      }
      else if(!err && result.length > 2) {
        console.log(result);
        res.write(result);
        res.end();
      }
      else {
        console.log(err);
        res.write('Error!');
        res.end();
      }
    });
  }
  else {
    res.write('The requested URL is invalid');
    res.end();
  }

  /*
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
    res.write('Error 404');
    res.end();
  }*/

}).listen(8000);
