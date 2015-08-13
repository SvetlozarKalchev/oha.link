var DataBase = require('./database.js');
var base_url = require('./base_url.js');

var db = new DataBase();
db.connect_to_database();

// This generates a random number to be used as an index for the
// possible symbols array. N queries to this array comprise the
// shortened URL.
var generateRandomIndex = function() {
    var index = Math.floor((Math.random() * 61) + 1);

    return index;
};

// This generates the shortened URL using the pseudorandom number from
// the previous function to serve as an index.
var generateRandomString = function(length) {
    var options =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    var o = "123";
    var string = '';

    for(var i = 0; i < length; i++ ) {
        string += options[generateRandomIndex()];
    };

    return string;
};

// Do a lookup in the link database to check if the generated short URL
// is a duplicate.
var isDuplicate = function(url, callback) {
  console.log('isDuplicate() called');

  db.search('SURL', url, function(err, result) {
    if(!err && result !== null) {
      console.log('Found ' + result[0]['SURL']);

      shortLink = base_url + generateRandomString(4);

      isDuplicate(shortLink, function(err, string) {
        //callback(err, null);
      });
    }
    else if(!err && result === null) {
      console.log(url + " is not a duplicate.");
      callback(null, url);
    }
    else {
      return err;
    }
  });
};

// Do a lookup in the link database to check if the given URL
// has already been shortened.
var isAlreadyShortened = function(url, callback) {
  db.search('URL', url, function(err, result) {
    if(!err && result !== null) {
      callback(err, result);
    }
    else {
      callback(err, null);
    }
  });
};

// Main method
var shorten = function(url, callback) {
  var shortURL;

  isAlreadyShortened(url, function(err, result) {
    if(!err && result !== null) {
      console.log("URL has already been shortened.");
      console.log(result[0]['SURL']);

      callback(err, result[0]['SURL'])
    }
    else if(!err && result === null) {
      console.log('URL has not been shortened.');
      shortURL = base_url + generateRandomString(4);

      isDuplicate(shortURL, function(err, result) {
        if(!err) {
          shortURL = result;
          console.log(shortURL);

          callback(err, shortURL);
        }
        else {
          callback(err, null);
        }
      })

    }
    else {
      callback(err, null);
    }
  });
};

/*
shortenLink('bin.com', function(err, result) {
  console.log(result);
})
setTimeout(function() {
  shorten('gogle.com');
}, 500);
*/

exports.shorten = shorten;
