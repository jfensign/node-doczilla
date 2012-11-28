//Models
var Model=require("../Models");
var Request=require('request');
var QS=require("querystring");

module.exports = {
 //Register.Index
 Index: {
  //Register.Index.Get
  Get: function(req, res) {
   res.render("login", {
    show: "register",
    errors: null
   });
  },
  //Register.Index.Post
  Post: function(req, res) {
   var data=[];
   Request({
    url: "http://localhost:3000/register",
    method: "POST",
    body: QS.stringify(req.body)
   },
   function(err, request, data) {
   if(err) return console.log(err);
   
   if(data) {
    data=JSON.parse(data);
    console.log(data);
    if(data.error) {
     res.render("login", {
      show: "register",
      errors: data.error,
      User: null
     });
    }
    else {
     if(data.request_token) {
      res.cookie("www.buzzbuild.com", data.request_token);
      res.redirect("/me/setup/#/business");
     }
    }
   }

  });
  
 }//End Index

}
}