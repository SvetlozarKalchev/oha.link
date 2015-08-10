var DataBase = require('./database.js');

var db = new DataBase();
db.connect_to_database();

var alreadyShortenedURL = '';

// This generates a random number to be used as an index for the
// possible symbols array. N queries to this array comprise the
// shortened URL.
var generateIndex = function() {
    var index = Math.floor((Math.random() * 23) + 1);

    return index;
};

// This generates the shortened URL using the pseudorandom number from
// the previous function to serve as an index.
var generateString = function(length) {
    var options = 'abcdefgABCDEFG1234567890';
    var string = '';

    for(var i = 0; i < length; i++ ) {
        string += options[generateIndex()];
    };

    return string;
};

var isAlreadyShortened = function(url) {
  // Do a lookup in the link database
  db.search(url, function(err, result) {
    if(!err) {
      console.log(result);
    }
  });
};

var isDuplicate = function(url) {

};

var shortenLink = function(url) {
  var baseURL = 'http://oha.link/';

  if(isAlreadyShortened(url)) {
    console.log('yes');
    console.log(alreadyShortenedURL);

  }
  else {
    // shorten
    console.log('no');
    var shortURL = baseURL + generateString(4);
    // check for duplicate

    return shortURL;
  }

};

//db.connect_to_database();

//console.log(shortenLink('http://google.com'));
//console.log(Math.floor((Math.random() * 24) + 1));
setTimeout(function() {
  isAlreadyShortened('google.com');
}, 1000);
