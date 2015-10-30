'use strict';
let Shortener = require('../models/Shortener.js');
let Random = require('../models/RandomGenerator.js');
/*
  Shortening a link involves generating a random 4-char-string, checking if
  it's a duplicate of an already shortened link, and saving the unique
  short URL to the DB. This controller does all that.
*/
class ShortenerController {
  shorten(url, callback) {
    let newShortLink;

    console.log('Received a request to shorten ' + url);

    Shortener.isAlreadyShortened(url, function onUrlCheck(err, result) {
      if (!err && result !== null) {
        console.log('URL has already been shortened: ' + result);
        callback(err, result);

      } else if (!err && result === null) {
        console.log('URL ' + url + ' has not been shortened.');

        newShortLink = 'oha.link/' + Random.generateRandomString(4);

        console.log('Generated a new short URL: ' + newShortLink);

        Shortener.isDuplicate(newShortLink,
          function onDuplicateCheck(err, result) {

            if (!err) {
              newShortLink = result;
              console.log('Final SURL is: ' + newShortLink);

              Shortener.saveShortenedLink(url, newShortLink,
                function onShortenedLinkSave(err, result) {

                  if (!err) {
                    // Return an array, containing the URL and the SURL
                    let bothLinks = [];
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
