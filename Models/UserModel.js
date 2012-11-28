var BB_Mongo = require('../Components/Database.js').DB;
var DB = new BB_Mongo(
 'localhost', 
 27017, 
 'buzzbuild'
);
var Collections={
 Account: "account",
 Profiles: "profiles"
}

var Collection = 'accounts';
var Crypto=require("crypto");

module.exports={

 save: function(obj) {
  try {
   console.log(obj);
  }
  catch(err) {
   console.log(err);
  }
 }

,

 authenticate_local: function(email, password, callback) {
  try {
   DB.query(Collection, function(collection) {
    var Sha1=Crypto.createHash('sha1');
    Sha1.update(password);
    collection.findOne({
     email: email,
     password: Sha1.digest('hex')
    }, 
    function(err, collection) {
      if(err) {
        console.log(err); process.abort();
        callback(err, null);
      }
      else {
        console.log(collection); process.abort();
        callback(null, collection);
      }
    })
   });
  }
  catch(err) {
   console.log(err);
  }
 }

,

register: {
 local: function(email, password, user_agent, ip, callback) {
 try {
  var Sha1=Crypto.createHash('sha1');
  Sha1.update(password);

  DB.query(Collections.Account, function(collection) {
   collection.insert({
     email: email,
     password: Sha1.digest('hex'),
     user_agent: user_agent,
     ip_address: ip,
     profile_count: 0
    },
    {
      unique: 1
    },
     function(err, ins) {
      if(err) {
        console.log(err);
        callback(err, null);
      }
      else {
        console.log(ins);
        console.log(ins);
        callback(null, ins);
      }
    }
   );
   collection.ensureIndex(
    "email",
    {
     unqiue: true
    }
   );
  }
 );
 }
 catch(err) {
  console.log(err);
 }
}

 ,

 google: function(first_n, last_n, email, user_agent, ip, profile, callback) {
  try {
   DB.query(Collections.Account, function(collection) {
    collection.insert({
     first_name: first_n,
     last_name: last_n,
     name: first_n + " " + last_n,
     email: email,
     user_agent: user_agent,
     ip_address: ip,
     profile_count: 0,
     google: profile
    });
   });
  }
  catch(err) {
   console.log(err);
  }
 }

 ,

 facebook: function(first_n, last_n, email, user_agent, ip, facebook_details, callback) {
  try {
   DB.query(Collections.Account, function(collection) {
    collection.insert({
     first_name: first_n,
     last_name: last_n,
     name: first_n + " " + last_n,
     email: email,
     user_agent: user_agent,
     ip_address: ip,
     profile_count: 0,
     facebook: facebook_details
    });
   });
  }
  catch(err) {
   console.log(err);
  }
 }
}

,

 findByEmail: function(email, callback) {
  try {
   DB.query("users", function(collection) {
    collection.findOne({"email": email}, function(err, doc) {
     if(err) console.log(err);
     callback(err, doc);
    });
   });
  }
  catch(err) {
   console.log(err);
  }
 }

 ,

 findById: function(mongoID, callback) {
  try {
   DB.query(Collection, function(collection) {
    collection.findOne({
      _id: new DB.ObjectId(mongoID)
     }, callback(err, doc)
    );
   });
  }
  catch(err) {
   console.log(err);
   return;
  }
 }

 ,

 hasFacebook: function(email, callback) {
  try {
   DB.query(Collections.Account, function(collection) {
    collection.findOne({email: email}, {facebook:1}, function(err, cursor) {
     console.log(err); process.abort();
     if(err) {
      callback(err, null);
     }
     else {
      console.log("fsdfs");
      callback(null, err);
     }
    });
   });  
  }
  catch(err) {
   console.log(err);
  }
 }

 ,

 hasGoogle: function(email, callback) {
  try {
   DB.query(Collections.Account, function(collection) {
    collection.find({email: email}, {google:1}, function(err, cursor) {
     if(err) {
      callback(err, null);
     }
     else {
      console.log("sssss");
      callback(null, err);
     }
    });
   });  
  }
  catch(err) {
   console.log(err);
  }
 }

 ,

 update : {

  google: function(idObj, valObj, callback) {
    console.log(idObj);
   try {
    DB.query(Collections.Account, function(collection) {
     collection.update(
      {_id: DB.newID(idObj.toString())}, 
      {"$set": valObj},
      {
       safe: true,
       upsert: true
      },
      function(err, set) {
       if(err) {
        callback(err, null);
       }
       else {
        callback(null, set);
       }
     })
    });
   }
   catch(err) {
    console.log(err);
   }
  }

 ,

  facebook: function(idObj, valObj, callback) {
   try {
    DB.query(Collections.Account, function(collection) {
     collection.update(
      {_id: DB.newID(idObj.toString())}, 
      {"$set": valObj}, 
      {
        safe: true, 
        upsert: true
      },
      function(err) {
       if(err) {
        callback(err, null);
       }
     })
    });
   }
   catch(err) {
    console.log(err);
   }
  }

 }

};