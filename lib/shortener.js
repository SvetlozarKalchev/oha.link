'use strict'
var DataBase = require('./database.js');
var Random = require('./randomGenerator.js');
var baseURL = require('../CONFIG.js').BASE_URL;

class Shortener {
  constructor() {}

  // Do a lookup in the link database to check if the generated short URL
  // is a duplicate. If yes - generate a new SURL and repeat the check until the
  // generated SURL is unique.
  isDuplicate(url, callback) {
    DataBase.search('SURL', url, function(err, result) {
      if (!err && result !== null) {
        console.log('Found ' + result[0]['SURL']);

        shortLink = baseURL + Random.generateRandomString(4);

        this.isDuplicate(shortLink, function(err, string) {});
      } else if (!err && result === null) {
        console.log(url + " is not a duplicate.");
        callback(null, url);
      } else {
        callback(err, null);
      }
    });
  }
  // Do a lookup in the link database to check if the given URL
  // has already been shortened.
  isAlreadyShortened(url, callback) {
    DataBase.search('URL', url, function(err, result) {
      if (!err && result !== null) {
        callback(err, result[0]['SURL']);
      } else {
        callback(err, null);
      }
    });
  };

  // Retrieves shortened link from the DB and returns it to the callback
  getShortenedLink(url, callback) {
    DataBase.search('SURL', url, function(err, result) {
      console.log('db.search ->' + url);
      if (!err && result != null) {
        callback(err, result[0]['URL']);
      } else {
        console.log('No such shortened link - error')
        callback(1, null);
      }
    });
  }

  saveShortenedLink(url, shortURL, callback) {
    DataBase.write(url, shortURL, function(err, result) {
      if (!err) {
        console.log('Successfully saved URL to DB! ' + result.toString());
        callback(null, result)
      } else {
        callback(err, result)
      }
    });
  }
}

module.exports = new Shortener();
