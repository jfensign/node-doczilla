var Solr=require('solr-client');
var client=Solr.createClient(
 "127.0.0.1", 
 8983, 
 "establishments"
);
var QS=require('querystring');

module.exports={

 add: function(docs, callback) {
  client.autoCommit=true;
  client.add(docs, function(err, obj) {
   if(err) {
   	console.log(err);
   	callback(err, null);
   }
   else {
   	console.log(obj);
   	callback(null, obj);
   }
  });
 }

 ,

 search: {

  around_me:function(point, callback) {
   var query = client.createQuery(
   ).q('*:*').set(QS.stringify({
    fq: '{!geofilt}',
    sfield: 'coords',
    pt: point,
    d: 15,
    start: 0,
    rows: 10,
    sort: "geodist() asc"
   }));

   client.search(query, function(err,res) {
    if(err) {
     console.log(err);
     callback(err);
    }
    else {
     console.log(res);
     callback(res);
    }
   });
  }
 }

}