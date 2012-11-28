var mongodb = require('mongodb');

function BB_Mongo(host, port, dbname) {
 this.host = host;
 this.port = port;
 this.dbname = dbname;

 this.server = new mongodb.Server(
  host,
  port,
  {auto_connect: true}
 );

 this.db_connector = new mongodb.Db(this.dbname, this.server);
 var self = this;
 this.db = undefined;
 this.queue = [];
 this.db_connector.open(function(err, db) {
  if( err ) {
   console.log(err);
   return;
  }
  self.db = db;
  for (var i = 0; i < self.queue.length; i++) {
   var collection = new mongodb.Collection(
    self.db, self.queue[i].cn);
    self.queue[i].cb(collection);
  }
  self.queue = [];
 });
}
exports.DB = BB_Mongo;

BB_Mongo.prototype.newID = function(str) {
 try {
  return str ? mongodb.ObjectID(str) : mongodb.ObjectID();
 }
 catch(err) {
 	console.log(err);
 }
}

BB_Mongo.prototype.query = function(collectionName, callback) {
 try {
  if (this.db != undefined) {
   var collection = new mongodb.Collection(
   	this.db, 
   	collectionName
   );
   callback(collection);
   return;
  }
  this.queue.push({ 
   "cn" : collectionName, 
   "cb" : callback
  });
 }
 catch(err) {
 	console.log(err);
 }
}