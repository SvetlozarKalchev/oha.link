'use strict'
let fs = require('fs');

let baseURL = require('../CONFIG.js').BASE_URL;
let ShortenerController = require('./shortenerController.js');
let StaticPageServer = require('./StaticPageServer.js');

class Router {
  /* Abstracted away the different routes */
  requestedHomePage(httpRequest) {
    let url = httpRequest.url;
    let query = httpRequest.query;

    return (url == '/' && !query);
  };

  requestedLink(httpRequest) {
    let url = httpRequest.url;
    let query = httpRequest.query;

    return (url != '/favicon.ico' && !query && url.length === 5);
  };

  givenLinkToShorten(httpRequest) {
    let url = httpRequest.url;
    let query = httpRequest.query;
    let pathname = httpRequest.pathname;

    return (url != '/favicon.ico' && pathname == '/shorten' && query);
  };

  serveRoot(httpResponse, callback) {
    StaticPageServer.getHomePage(httpResponse, function(err, result) {
      if (err) {
        callback(err);
      }
    });
  }

  serveShortenedLink(httpRequest, httpResponse, link) {
    let res = httpResponse;
    let getLink = ShortenerController.getShortenedLink;

    console.log('Requested a SURL: ' + baseURL + httpRequest.path);

    getLink(baseURL + httpRequest.path, function(err, result) {
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
  }
}

module.exports = new Router();
