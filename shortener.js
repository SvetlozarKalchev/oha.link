var DataBase = require('./database.js');
var base_url = require('./base_url.js');

var db = new DataBase();
db.connect_to_database();

// This generates a random number to be used as an index for the
// possible symbols array. N queries to this array comprise the
// shortened URL.
var generateIndex = function() {
    var index = Math.floor((Math.random() * 23) + 1);

    return index;
};

// This generates the shortened URL using the pseudorandom number from
// the previous function to serve as an index.
var generateShortURL = function(length) {
    var options = 'abcdefgABCDEFG1234567890';
    var string = '';

    for(var i = 0; i < length; i++ ) {
        string += options[generateIndex()];
    };

    return string;
};

// Do a lookup in the link database to check if the generated short URL
// is a duplicate.
var isDuplicate = function(url) {

};

// Do a lookup in the link database to check if the given URL
// has already been shortened.
var isAlreadyShortened = function(url, callback) {
  db.search(url, function(err, result) {
    if(!err && result !== null) {
      callback(null, result);
    }
    else {
      callback(err, null);
    }
  });
};

// Main method
var shortenLink = function(url) {
  var shortURL;

  isAlreadyShortened(url, function(err, result) {
    if(!err && result !== null) {
      console.log("URL has already been shortened.");
    }
    else if(!err && result === null) {
      shortURL = base_url + generateShortURL(4);
      console.log('URL has not already been shortened.');
      console.log(shortURL);
    }
    else {
      return err;
    }
  });
};

//db.connect_to_database();

//console.log(shortenLink('http://google.com'));
//console.log(Math.floor((Math.random() * 24) + 1));
setTimeout(function() {
  shortenLink('hn.premii.com');
}, 500);
