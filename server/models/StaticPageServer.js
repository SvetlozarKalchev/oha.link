'use strict';
let fs = require('fs');

class StaticPageServer {
  serveHomePage(res, callback) {
    fs.readFile('./client/index.html',
      function onHomepageFileRead(err, content) {
        if (!err) {
          res.writeHead(200, {
            'Content-type': 'text/html'
          });
          res.write(content);
          res.end();

          callback(err);

        } else {
          res.writeHead(404, {
            'Content-type': 'text/html'
          });
          res.write('404 Page not found.');
          res.end();

          callback(new Error('Cannot serve homepage: ' + err));
        }
      })
  }
}

module.exports = StaticPageServer;
