'use strict'
let fs = require('fs');

class StaticPageServer {
  getHomePage(httpResponse, callback) {
    fs.readFile('./ui/app.html', function(err, content) {
      if (!err) {
        res.writeHead(200, {
          'Content-type': 'text/html'
        });
        res.write(content);
        res.end();

        callback(null);
      } else {
        res.writeHead(404, {
          'Content-type': 'text/html'
        });
        res.write("Page not found.");
        res.end();

        callback(new Error('Cannot serve homepage: ' + err));
      }
    })
  }
}

module.exports = new StaticPageServer();
