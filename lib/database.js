'use strict'
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var DB_URL = require('../CONFIG.js').DB_URL;

class DataBase {
  constructor() {
    this.connectToDataBase();
  }

  connectToDataBase() {
    MongoClient.connect(DB_URL, (err, db) => {
      if (!err) {
        console.log('Connected to DB ' + DB_URL);
        this._db = db;
      } else {
        console.log(new Error('Cannot connect to DB ' + DB_URL));
      }
    });
  }

  write(url, shortUrl, callback) {
    var collection = this._db.collection('shortened');

    var data = {
      'URL': '',
      'SURL': ''
    };

    data['URL'] = url;
    data['SURL'] = shortUrl

    collection.insert(data, function(err, result) {
      callback(err, result);
    });
  }

  search(key, value, callback) {
    var collection = this._db.collection('shortened');

    // Values that we are using for search have to be assigned to an object
    // before passing them to find(), because Mongo's find takes the literal
    // names of the variables, not their values.
    var queryObject = {};

    queryObject[key] = value;

    console.log('Query object key:value  ' + key + ':' + queryObject[key]);
    var cursor = collection.find(queryObject,
      function onDbCursorRetrieval(err, result) {
        if (!err) {
          return result;
        } else {
          console.log('errrrrrrrrrrrrrrrrr')
          callback(err, null);
        }
      });

    cursor.toArray(function onDbCursorToArray(err, result) {
      if (result && result.length) {
        callback(err, result);
      } else {
        callback(err, null);
      }
    });
  }

  closeConnection() {
    this._db.close();
  }
}

module.exports = new DataBase();
