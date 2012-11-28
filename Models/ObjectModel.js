var BB_Mongo=require('../Components/Database');
var DB=new BB_Mongo('localhost', 27017, 'doczilla');

module.exports={
 Object: {
  Create: function(params, cb) {
   try {
   	params._id=DB.newID();
   	DB.query("objects", function(collection) {
   	 collection.insert(params, function(err, insert) {
   	  cb(err || null, params._id);
   	 });
   	});
   }
   catch(Error) {
    console.log(Error);
   }
  }
 }
}