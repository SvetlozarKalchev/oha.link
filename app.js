var http = require('http');
var url = require('url');
var fs = require('fs');
var baseURL = require('./CONFIG.js').BASE_URL;

var ShortenerObject = require('./shortener.js');

// Initiate DB connection
var Shortener = new ShortenerObject();
Shortener.db.connect_to_database();

http.createServer(function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Acces-Control-Allow-Methods", "GET");

  var parsedRequest = url.parse(req.url);

  if (req.url == '/') {
    fs.readFile('./ui/app.html', function(err, content) {
      if (!err) {
        res.writeHead(200, {
          'Content-type': 'text/html'
        });
        res.write(content);
        res.end();
      } else {
        res.writeHead(404, {
          'Content-type': 'text/html'
        });
        res.write("Page not found.");
        res.end();
      }
    });
  } else if (req.url != '/favicon.ico' && !parsedRequest.query) {
    console.log('Searching for: ' + baseURL + parsedRequest.path);
    Shortener.getShortenedLink(baseURL + parsedRequest.path
      , function(err, result) {
        if (!err) {
          // If there is no protocol, add it, else redirect won't work.
          if (result.toLowerCase().indexOf('http') !== -1) {
            res.writeHead(302,
              {
                'Location': result
              });
            res.end()
          } else {
            res.writeHead(302,
              {
                'Location': 'http://' + result
              });
            res.end()
          }
        } else {
          console.log(err);
          res.write("Invalid short URL.");
          res.end();
        }
      });
  } else if (req.url != '/favicon.ico' && parsedRequest.pathname == '/shorten' && parsedRequest.query) {
    if (parsedRequest.query.length >= 4) {
      console.log("PRQ: " + parsedRequest.query);
      Shortener.shorten(parsedRequest.query, function(err, result) {
        // If a new URL gets shortened, an array with the length of 2
        // gets returned
        if (!err && result.length == 2) {
          console.log('Shortened ' + result[0] + ' to: ' + result[1]);
          res.write(result[1]);
          res.end();
        } else if (!err && result.length > 2) {
          res.write(result)
          res.end();
        } else {
          console.log(err);
          res.write('Error!');
          res.end();
        }
      });
    } else {
      console.log('ERR1:' + parsedRequest.query);
      res.write('The requested URL is invalid');
      res.end();
    }
  } else {
    console.log('No such URL path');
    res.write('The requested URL ' + parsedRequest + ' is invalid');
    res.end();
  }

}).listen(8000);
