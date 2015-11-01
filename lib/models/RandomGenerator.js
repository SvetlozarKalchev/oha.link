'use strict';

class Random {
  constructor() {}

  // This generates a random number to be used as an index for the
  // possible symbols array.
  generateRandomIndex() {
    let index = Math.floor((Math.random() * 61) + 1);
    return index;
  }

  // This generates the shortened URL using the pseudorandom number from
  // the previous function to serve as an index.
  generateRandomString(length) {
    let options = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

    let string = '';

    for (let i = 0; i < length; i++) {
      string += options[this.generateRandomIndex()];
    }

    return string;
  }
}

module.exports = Random;
