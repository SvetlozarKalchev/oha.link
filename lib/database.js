'use strict'
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var DB_URL = require('../CONFIG.js').DB_URL;

class DataBase {
  constructor() {}

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
    }
    data['URL'] = url;
    data['SURL'] = shortUrl

    collection.insert(data, function(err, result) {
      callback(err, result);
    });
  }

  search(key, value, callback) {
    var collection = this._db.collection('shortened');

    // Dynamic values have to be assigned to an object before passing
    // them to find(), because node takes the literal names of the variables
    var queryObject = {};
    queryObject[key] = value;

    var cursor = collection.find(queryObject, function(err, result) {
      if (!err) {
        return result;
      } else {
        return error;
      }
    });

    cursor.toArray(function(err, result) {
      if (result.length) {
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
