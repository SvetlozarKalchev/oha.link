'use strict';
let mongodb = require('mongodb'),
  MongoClient = mongodb.MongoClient;

class DataBase {
  constructor(dataBaseAdress) {
    this.connectToDataBase(dataBaseAdress);
  }

  connectToDataBase(dataBaseAdress) {
    MongoClient.connect(dataBaseAdress, (err, db) => {
      if (!err) {
        console.log('Connected to DB ' + dataBaseAdress);
        this._db = db;
      } else {
        console.log(new Error('Cannot connect to DB ' + dataBaseAdress));
      }
    });
  }

  write(url, shortUrl, callback) {
    let collection = this._db.collection('shortened');

    let data = {
      'URL': '',
      'SURL': ''
    };

    data['URL'] = url;
    data['SURL'] = shortUrl

    collection.insert(data, function onDataWritten(err, result) {
      callback(err, result);
    });
  }

  search(key, value, callback) {
    let collection = this._db.collection('shortened');

    // Values that we are using for search have to be assigned to an object
    // before passing them to find(), because Mongo's find takes the literal
    // names of the variables, not their values.
    let queryObject = {};

    queryObject[key] = value;

    let cursor = collection.find(queryObject,
      function onDbCursorRetrieval(err, result) {
        if (!err) {
          return result;
        } else {
          let errorMessage = `${err} on searching for ${queryObject} in DataBase.`;
          callback(errorMessage, null);
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

module.exports = DataBase;
