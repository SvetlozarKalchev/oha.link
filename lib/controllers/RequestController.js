'use strict'
let url = require('url');
let Router = require('../models/Router.js');
let ShortenerController = require('./ShortenerController.js');

class RequestController {
  route(req, res, callback) {
    let reqUrl = url.parse(req.url);

    // Routing cases begin here
    if (Router.requestedHomePage(reqUrl)) {
      console.log('Serving homepage');
      Router.serveRoot(res, function(err) {
        if (err) {
          console.error(err);
        }
      });

    } else if (Router.requestedLink(reqUrl)) {
      Router.serveShortenedLink(reqUrl, res);

    } else if (Router.givenLinkToShorten(reqUrl)) {
      ShortenerController.shorten(reqUrl.query, function(err, result) {
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

    } else if (Router.requestedFavicon(reqUrl)) {
      res.end('Favicon');

    } else {
      console.log(new Error('Invalid request: ' + reqUrl));
      res.write('The requested URL is invalid');
      res.end();
    }
  }
}

module.exports = new RequestController();
