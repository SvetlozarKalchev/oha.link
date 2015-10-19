'use strict'
var Shortener = require('./shortener.js');
var Random = require('./randomGenerator.js');
/*
  Link shortening algorithm:
    1. Check if received URL has already been shortened.
    2. If YES -> return the shortened url
    3. if NO ->
              generate a unique short URL
              write it to the DB
              return it
*/
class ShortenerController {
  constructor() {}

  getShortenedLink(url, callback) {
    Shortener.getShortenedLink(url, function retrievedLink(err, res) {
      callback(err, res);
    });
  }

  shorten(url, callback) {
    var newShortLink;

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
