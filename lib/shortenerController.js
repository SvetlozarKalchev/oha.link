'use strict'
let Shortener = require('./shortener.js');
let Random = require('./randomGenerator.js');

class ShortenerController {
  constructor() {}

  getShortenedLink(url, callback) {
    Shortener.getShortenedLink(url, function onRetrievedLink(err, res) {
      callback(err, res);
    });
  }

  shorten(url, callback) {
    let newShortLink;
    console.log('shorten()' + url)
    Shortener.isAlreadyShortened(url, function(err, result) {
      if (!err && result !== null) {
        console.log('URL has already been shortened: ' + result);
        callback(err, result);

      } else if (!err && result === null) {
        console.log('URL ' + url + ' has not been shortened.');

        newShortLink = 'oha.link/' + Random.generateRandomString(4);

        console.log('Generated a new short URL: ' + newShortLink);

        Shortener.isDuplicate(newShortLink, function(err, result) {
          if (!err) {
            newShortLink = result;
            console.log('Final SURL is: ' + newShortLink);

            Shortener.saveShortenedLink(url, newShortLink,
              function(err, result) {
                if (!err) {
                  // Return an array, containing the URL and the SURL
                  var bothLinks = [];
                  bothLinks.push(url, newShortLink);

                  callback(err, bothLinks);
                } else {
                  callback(err, null);
                }
              });
          } else {
            callback(err, null);
          }
        })

      } else {
        callback(err, null);
      }
    });
  }
}

module.exports = new ShortenerController();
