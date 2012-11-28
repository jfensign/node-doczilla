
var BB_Mongo = require('../Components/Database.js').DB;
var DB = new BB_Mongo(
 'localhost', 
 27017, 
 'Geo'
);

var BB_DB = new BB_Mongo(
 'localhost',
 27017,
 'buzzbuild'
);

module.exports={
 locations: {

  malls: {
   usa: function(callback) {
    try {
     var Malls=[];
     DB.query(
      "shopping_malls", 
      function(shoppingMalls) {
       shoppingMalls.find().toArray(function(err, malls) {
        callback(malls);
       });
      }
     );
    }
    catch(Error) {
     console.log(Error);
    }
   }
  ,
  around_me: function(point, radius, callback) {
   try {
    DB.query(
     "shopping_malls", 
     function(shoppingMalls) {
      shoppingMalls.find({
       "result[0].geometry.location": 
       {"$within" : 
        {"$center" : [point,3000]}
       }
      }).toArray(function(err,docs) {
      callback(docs);
     });
    });
   }
   catch(Error) {
    console.log(Error);
   }
  }

  } 
 }
 ,

 Solr: {
  update: {
   malls: function() {
    try {
     DB.query(
      "shopping_malls", 
      function(shoppingMalls) {
       shoppingMalls.find().toArray(function(err, malls) {
        callback(malls);
       });
      });
     }
     catch(error) {
      console.log(error);
     }
   }
  }
 }

 ,

 MapReduce: {
  dropDups: {
   do: function() {
    var map=function () {
     emit(this.formatted_address, 1);
    };
    var reduce=function(k, vals) {
     emit(k,Array.sum(vals));
    }
    DB.query("shopping_malls",function(collection) {
     collection.mapReduce(
      map,
      reduce,
      {out: "bb_shopping_malls"}, 
      function(err, data) {
       if(err) {
        console.log(err);
       }
       else {
        console.log(data);
       }
     });
    });
   }
  }
 }
}