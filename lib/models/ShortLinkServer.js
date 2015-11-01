'use strict';
let baseURL = require('../../CONFIG.js').BASE_URL,
  Shortener = require('./Shortener.js');

class ShortLinkServer {

  getLink(reqUrl, httpRes, link) {
    let reqPath = reqUrl.pathname;
    let res = httpRes;
    let shortLink = baseURL + reqPath;

    console.log('Requested a short link: ' + shortLink);

    let getLink = Shortener.getShortenedLink;

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
        res.write(`URL ${shortLink} can't be found.`);
        res.end();
      }
    });
  }
}

module.exports = ShortLinkServer;
