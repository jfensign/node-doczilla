var Model=require("../Models");
var Solr=require("../Components/Solr");

module.exports={
 index: function(req, res) {
  res.render("../Views/map");
 }

 ,

 locations: {
  malls: {
  around_me: function(req,res) {
   var Malls=[];
   Solr.ShoppingMalls.search.around_me(
    req.query.coords,
    function(result) {
     res.json(result);
    }
   );
  }
  }
 }

 ,

 admin: {
  malls: {

   dropDups: function(req, res) {
    Model.Geo.MapReduce.dropDups.do();
   }

   ,

   updateSolrIndex: function(req, res) {
    var Malls=[];
    Model.Geo.locations.malls.usa(function(malls) {
     for(var i in malls) {
      if(malls[i].result) {
       var Mall={
        _id: malls[i]._id,
        name: malls[i].result.name,
        coords: malls[i].result.geometry.location.lat + "," + malls[i].result.geometry.location.lng,
        lat: malls[i].result.geometry.location.lng,
        lng: malls[i].result.geometry.location.lat,
        sort_name: malls[i].result.name,
        formatted_address: malls[i].result.formatted_address
       };
       Solr.ShoppingMalls.add(Mall, function(err, res) {
        if(err) {
         console.log(err);
        }
        else {
         console.log(res);
        }
       });
       Malls.push(Mall);
      }
     }
    });
   }

  }
 }
}

