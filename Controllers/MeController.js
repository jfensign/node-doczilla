var Request=require('request');
var Config=require("../Components/Config");
var QS=require('querystring');
var FS=require('fs');
var HTTP=require('http');
var Model=require('../Components/Models');

module.exports = {
 //Me.Index
 Index: function(req, res) {
  try {
   res.render("../Views/Profile/Me.ejs");
  }
  catch(err) {
   console.log(err);
  }
 },
 //Me.Projects
 Projects: function(req, res) {
  try {
   Model.Me.Projects.Get(req.user._id, function(err, user) {
    console.log(user);
   });
  }
  catch(Error) {
   console.log(Error);
  }
 },
 Project: {
  Object: {
   Create: function(req, res) {
    try {
     if(req.params.length < 1) {
      res.json({
       status: 401, 
       msg: "Invalid request. No POST parameters in request."
      });
     }
     else {
      Model.Api.Object.Create(req.params, function(err, objectID) {
       if(err) return console.log(err);
       res.json(objectID);
      });
     }
    }
    catch(Error) {
     return console.log(Error);
    }
   }
  }
 }
}     