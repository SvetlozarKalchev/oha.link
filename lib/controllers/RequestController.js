'use strict';
let url = require('url'),
  Scribo = require('scribo'),
  Stats = require('../../utils/Stats.js');

let RoutingLogicConstructor = require('../models/RoutingLogic.js'),
  ShortenerControllerConstructor = require('./ShortenerController.js'),
  StaticPageServerConstructor = require('../models/StaticPageServer.js'),
  ShortLinkServerConstructor = require('../models/ShortLinkServer.js');

let Router = new RoutingLogicConstructor(),
  ShortenerController = new ShortenerControllerConstructor(),
  StaticPageServer = new StaticPageServerConstructor(),
  ShortLinkServer = new ShortLinkServerConstructor();
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
      //Log request
      Stats.logReqToRoot(req);
      Stats.incrementVisits(req);

      StaticPageServer.serveHomePage(res, function(err, result) {
        callback(err, result);
      });

    } else if (Router.requestedLink(reqUrl)) {

      ShortLinkServer.getLink(reqUrl, res,
        function onShortLinkGet(err, result) {
          callback(err, result);
        });

    } else if (Router.givenLinkToShorten(reqUrl)) {
      ShortenerController.shorten(reqUrl.query, function(err, result) {
        /* If a new URL gets shortened, an array containing the original and
          the shortened URL gets returned. That's why I'm checking if the
          length is == 2. If the length is > 2, a shortened
          link is being returned, this meaning the requested link has already
          been shortened.
        */
        if (!err && result.length == 2) {
          console.log('Shortened ' + result[0] + ' to: ' + result[1]);
          res.write(result[1]);
          res.end();

        } else if (!err && result.length > 2) {
          res.write(result)
          res.end();

        } else {
          res.write('Error!' + err);
          res.end();
        }
      });

    } else if (Router.requestedFavicon(reqUrl)) {
      res.write('Favicon')
      res.end();

    } else {
      console.log(new Error('Invalid request: ' + reqUrl));
      res.write('The requested URL is invalid');
      res.end();
    }
  }
}

module.exports = RequestController;
