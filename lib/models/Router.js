'use strict'
let fs = require('fs');

let baseURL = require('../../CONFIG.js').BASE_URL;
let ShortenerController = require('../controllers/ShortenerController.js');
let StaticPageServer = require('./StaticPageServer.js');

class Router {
  /* Different route cases */

  requestedHomePage(reqUrl) {
    let reqPath = reqUrl.pathname;
    let query = reqUrl.query;

    return (reqPath === '/' && !query);
  }

  requestedLink(reqUrl) {
    let reqPath = reqUrl.pathname;
    let query = reqUrl.query;

    return (reqPath.length === 5 && !query);
  }

  givenLinkToShorten(reqUrl) {
    let reqPath = reqUrl.pathname;
    let query = reqUrl.query;

    return (reqPath === '/shorten' && query);
  }

  requestedFavicon(reqUrl) {
    let reqPath = reqUrl.pathname;
    let query = reqUrl.query;

    return (reqPath === '/favicon.ico' && !query);
  }
  /* Route cases end here. */

  serveShortenedLink(reqUrl, httpRes, link) {
    let reqPath = reqUrl.pathname;
    let res = httpResponse;
    let shortLink = baseURL + reqPath;

    console.log('Requested a short link: ' + shortLink);

    let getLink = ShortenerController.getShortenedLink;

    getLink(shortLink, function onShortLinkRetrieval(err, result) {
      if (!err && result) {
        console.log(result)
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
        console.log(new Error('Invalid short URL!'));
        res.write('Invalid short URL.');
        res.end();
      }
    });
  }
}

module.exports = new Router();
