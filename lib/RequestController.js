'use strict'
let Router = require('./Router.js');

class RequestController {
  route(req, res, callback) {
    if (Router.requestedHomePage(req)) {
      console.log('Serving homepage');

      Router.serveRoot(res, function(err) {
        if (err) {
          console.error(err);
        }
      });

    } else if (Router.requestedLink(req)) {
      let getLink = Router.serveShortenedLink;
      getLink(req, res, req.path);

    } else if (Router.givenLinkToShorten(req)) {
      console.log('Shorten link: ' + req.query);

      ShortenerController.shorten(req.query, function(err, result) {
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
      console.log(new Error('Invalid request: ' + req.query));
      res.write('The requested URL is invalid');
      res.end();
    }
  }
}

module.exports = new RequestController();
