'use strict'
class Random {
  constructor() {}

  // This generates a random number to be used as an index for the
  // possible symbols array.
  generateRandomIndex() {
    var index = Math.floor((Math.random() * 61) + 1);
    return index;
  }

  // This generates the shortened URL using the pseudorandom number from
  // the previous function to serve as an index.
  generateRandomString(length) {
    var options = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

    var string = '';

    for (var i = 0; i < length; i++) {
      string += options[this.generateRandomIndex()];
    }

    return string;
  }
}

module.exports = new Random();
