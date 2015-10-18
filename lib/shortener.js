var DataBase = require('./database.js');
var base_url = require('./base_url.js');

var Shortener = function() {}

Shortener.prototype.db = new DataBase();

// This generates a random number to be used as an index for the
// possible symbols array. N queries to this array comprise the
// shortened URL.
Shortener.prototype.generateRandomIndex = function() {
  var index = Math.floor((Math.random() * 61) + 1);

  return index;
};

// This generates the shortened URL using the pseudorandom number from
// the previous function to serve as an index.
Shortener.prototype.generateRandomString = function(length) {
  var options = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

  var string = '';

  for (var i = 0; i < length; i++) {
    string += options[Shortener.prototype.generateRandomIndex()];
  }
  ;

  return string;
};

// Do a lookup in the link database to check if the generated short URL
// is a duplicate. Generate a new SURL and repeat the check until the
// generated SURL is unique.
Shortener.prototype.isDuplicate = function(url, callback) {
  console.log('isDuplicate() called');

  Shortener.prototype.db.search('SURL', url, function(err, result) {
    if (!err && result !== null) {
      console.log('Found ' + result[0]['SURL']);

      shortLink = 'oha.link/' + Shortener.prototype.generateRandomString(4);

      Shortener.prototype.isDuplicate(shortLink, function(err, string) {});
    } else if (!err && result === null) {
      console.log(url + " is not a duplicate.");
      callback(null, url);
    } else {
      callback(err, null);
    }
  });
};

// Do a lookup in the link database to check if the given URL
// has already been shortened.
Shortener.prototype.isAlreadyShortened = function(url, callback) {
  Shortener.prototype.db.search('URL', url, function(err, result) {
    if (!err && result !== null) {
      callback(err, result[0]['SURL']);
    } else {
      callback(err, null);
    }
  });
};

// Retrieves shortened link from the DB and returns it to the callback
Shortener.prototype.getShortenedLink = function(url, callback) {
  Shortener.prototype.db.search('SURL', url, function(err, result) {
    console.log('db.search ->' + url);
    if (!err && result != null) {
      callback(err, result[0]['URL']);
    } else {
      console.log('No such shortened link - error')
      callback(1, null);
    }
  })
}

// Writes shortened link to DB
Shortener.prototype.saveShortenedLink = function(url, shortURL, callback) {
  Shortener.prototype.db.write(url, shortURL, function(err, result) {
    if (!err) {
      console.log('Successfully saved URL to DB! ' + result);
      callback(null, result)
    } else {
      callback(err, result)
    }
  })
}
// Main method
Shortener.prototype.shorten = function(url, callback) {
  var shortURL;

  // 1. Check is URL has been shortened before.
  Shortener.prototype.isAlreadyShortened(url, function(err, result) {
    // 2. If yes, return the shortened URL, so the user can be
    //    redirected to it.
    if (!err && result !== null) {
      console.log("URL has already been shortened.");
      console.log(result);

      callback(err, result)
    }
    // 3. If no, generate a unique short URL, write it to the DB,
    //    and return it, so the user can be redirected to it.
    else if (!err && result === null) {
      console.log('URL has not been shortened.');
      shortURL = 'oha.link/' + Shortener.prototype.generateRandomString(4);

      console.log('Generated a new short URL.');

      Shortener.prototype.isDuplicate(shortURL, function(err, result) {
        if (!err) {
          shortURL = result;
          console.log('Final SURL is: ' + shortURL);

          Shortener.prototype.saveShortenedLink(url, shortURL,
            function(err, result) {
              if (!err) {
                // Return an array, containing the URL and the SURL
                var bothLinks = [];
                bothLinks.push(url, shortURL);

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
};

/*
var s = new Shortener();
s.db.connect_to_database();

setTimeout(function() {
  s.shorten('cev.eu', function(err, result) {
    console.log(result);
  });
}, 500);
*/

module.exports = Shortener;
