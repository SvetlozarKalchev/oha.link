var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var CONFIG = require('../../CONFIG.js');

var DataBase = function() {};

// Initiates connection to MongoDB driver. Goal is to do this only
// once and do it when starting the app, because initiating a db connection
// is a slow operation.
DataBase.prototype.dataStub = {
  'URL': '',
  'SURL': ''
};

DataBase.prototype.connect_to_database = function() {
  MongoClient.connect(CONFIG.BASE_URL, function(err, db) {
    if (!err) {
      console.log('Connected to DB ' + CONFIG.BASE_URL);
      DataBase.prototype._db = db;
    } else {
      console.log(new Error('Cannot connect to DB ' + CONFIG.BASE_URL));
    }
  });
};

DataBase.prototype.write = function(url, shortUrl, callback) {
  var collection = this._db.collection('shortened');

  this.dataStub['URL'] = url;
  this.dataStub['SURL'] = shortUrl

  collection.insert(data, function(err, result) {
    callback(err, result);
  });
};

// Search the DB for matching URLs.
DataBase.prototype.search = function(key, value, callback) {
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
};

DataBase.prototype.closeConnection = function() {
  this._db.close();
};

module.exports = DataBase;
