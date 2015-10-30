'use strict';
let url = require('url');
let Router = require('../models/Router.js');
let ShortenerController = require('./ShortenerController.js');
let StaticPageServer = require('../models/StaticPageServer.js');
let ShortLinkServer = require('../models/ShortLinkServer.js');

let Scribo = require('scribo');
/*
  This is the main app  controller. It determines what path has been requested
  and does the corresponding things by calling the methods, defined in the
  app models.
*/
class RequestController {
  route(req, res, callback) {
    let reqUrl = url.parse(req.url);

    // Routing cases begin here
    if (Router.requestedHomePage(reqUrl)) {
      Scribo.logEvent('Request to /', 'from ', false);
      let bench = Scribo.startBench('Homepage serve');

      StaticPageServer.serveHomePage(res, function(err, result) {
        callback(err, result);
        Scribo.endBench(bench, false, (err, result) => {
          console.log(err, result);
        })
      });

    } else if (Router.requestedLink(reqUrl)) {
      ShortLinkServer.getLink(reqUrl, res,
        function onShortLinkGet(err, result) {
          callback(err, result);
        });

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
