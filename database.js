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
DataBase.prototype.search = function(url, callback) {
  var collection = this._db.collection('shortened');

  var cursor = collection.find({'URL': url});

  cursor.toArray(function(err, result) {
    if(result.length) {
      callback(null, result);
    }
    else {
      callback(err);
    }
  });
};

DataBase.prototype.close_connection = function() {
  this._db.close();
};

/*
var db = new DataBase();

db.connect_to_database();

setTimeout(function() {
  db.search('bing.com', function(err, result) {
    console.log(result);
  })
}, 500);

/*
db.write('facebook.com', 'oha.link/xyz', function(err, result) {
  console.log("written");
});
*/



module.exports = DataBase;
