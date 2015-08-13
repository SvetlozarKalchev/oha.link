var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

// DataBase object. Encapsulates methods for working with the DB.
var DataBase = function() {
  this.url = 'mongodb://localhost:27017/links';
};

// Initiates connection to MongoDB driver. Goal is to do this only
// once and do it when starting the app, because initiating a db connection
// is a slow operation.
DataBase.prototype.connect_to_database = function() {
  MongoClient.connect(this.url, function(err, db) {
    if(!err) {
      console.log("Connected OK!");
      DataBase.prototype._db = db;
    }
    else {
      console.log("ERROR: " + err);
    }
  });
};

// Write data to the DB.
DataBase.prototype.write = function(url, short_url, callback) {
  var collection = this._db.collection('shortened');

  var data = {"URL": url, "SURL": short_url};


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
    if(!err) {
      return result;
    }
    else {
      return error;
    }
  });

  cursor.toArray(function(err, result) {
    if(result.length) {
      callback(err, result);
    }
    else {
      callback(err, null);
    }
  });
};

DataBase.prototype.closeConnection = function() {
  this._db.close();
};

/*
var db = new DataBase();

db.connect_to_database();

setTimeout(function() {
  db.search('URL', 'bing.com', function(err, result) {
    console.log(err, result);
  })
}, 500);

/*
db.write('facebook.com', 'oha.link/xyz', function(err, result) {
  console.log("written");
});
*/



module.exports = DataBase;
