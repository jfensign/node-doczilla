//Models
var Model=require("../Models");
//Config
var Config=require("../Components/Config");
//Redis Client
var Session=require("../Components/Session");
//Authentication Strategies
var Passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var TwitterStrategy=require('passport-twitter').Strategy;
var FacebookStrategy=require('passport-facebook').Strategy;
var LinkedInStrategy=require('passport-linkedin').Strategy;
var GoogleStrategy=require('passport-google-oauth').OAuth2Strategy;
var Request = require('request');
var QS=require('querystring');

module.exports = {

 index: function(req, res) {
  res.render('login',{
  	message: "Login",
    User: null
  });
 }

 ,//End Index

 Login: {
  Basic: function(req, res) {
   try {
    Request('http://www.google.com', function (error, response, body) {
     if (!error && response.statusCode == 200) {
      console.log(body) // Print the google web page.
     }
    });
   }
   catch(err) {
    console.log(err);
   }
  }
 },

 Login: {
  Twitter: function(req, res) {
   console.log("Redirecting to Twitter.");
  }

  ,
  Facebook: function(req, res) {
   console.log("Redirecting to Facebook.");
  }

  ,

  Google: function(req, res) {
   console.log("Redirecting to Google.");
  }

  ,

  Linkedin: function(req, res) {
   console.log("Redirected to LinkedIn");
  }

  ,

  Local: {

  	Post: function(req, res) {
     req.assert(
      'username', 
      'Valid Email Address'
     ).notEmpty().isEmail();
     req.assert(
      'password', 
      'A password is required.'
     ).notEmpty();

     var errors=req.validationErrors();
     if(errors) {
      res.json(errors);
     }
     else {
      var AuthString="Basic " + new Buffer(req.body.username + ":" + req.body.password).toString("base64");

       Request({
        url : Config.Buzzbuild.API.Paths.Base + "/login",
        headers : {
         "Authorization" : AuthString
        }
       },function(err, request, body) {
        if(err) {
         res.json(err);
        }
        else {
         body=JSON.parse(body);
         console.log(body);
         if(body.token) {
           res.cookie("www.buzzbuild.com", body.token, { maxAge: 900000 });
           res.redirect("/me/");
           return;
          }
          else {
           res.json(body);
           return;
         }
        }
       });
     }
    }

    ,

     Get: function(req, res) {
      res.render('login',{
       show: "login",
       errors: null
      });
     }

    }

 }

 , //End Login

 Callback: {

  Twitter: function(req, res) {
   if(req.isAuthenticated()) {
    console.log(req.user);
    res.json(req.user);
   }
  },

  Facebook: function(req, res) {
   if(req.isAuthenticated()) {

    var FbUser={
     name: req.user._json.name,
     email: req.user._json.email,
     password: "",
     oauth: 1
    };

    Model.User.findByEmail(req.user._json.email.toString(), function(err, user) {
     if(err) return console.log(err);
     if(user) {

      var AuthString="Basic " + new Buffer(req.user._json.email + ":" + user._id).toString("base64");

       Request({
        url : Config.Buzzbuild.API.Paths.Base + "/login/facebook",
        headers : {
         "Authorization" : AuthString
        }
       },
       function(err, request, body) {
        if(err) {
         res.json(err);
        }
        else {
         body=JSON.parse(body);
         console.log(body);
         if(body.token) {
           res.cookie("www.buzzbuild.com", body.token, { maxAge: 900000 });
           res.redirect("/me/");
           return;
          }
          else {
           res.json(body);
           return;
         }
        }
       });

     }
     else {
      var data=[];

      Request({
       url: "http://localhost:3000/register",
       method: "POST",
       body: QS.stringify(FbUser)
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

     }
    });

   }
   else {
    redirect("/login");
   }
  },

  Linkedin: function(req, res) {
   if(req.isAuthenticated()) {
    res.json(req.user);
   }
   else {
    res.send("Invalid LinkedIn Credentials");
   }
  },

  Google: function(req, res) {
   if(req.isAuthenticated()) {

    var GoogleUser={
     name: req.user._json.name,
     email: req.user._json.email,
     password: "",
     oauth: 1
    };

    Model.User.findByEmail(req.user._json.email.toString(), function(err, user) {
     if(err) return console.log(err);
     if(user) {

      var AuthString="Basic " + new Buffer(req.user._json.email + ":" + user._id).toString("base64");

       Request({
        url : Config.Buzzbuild.API.Paths.Base + "/login/google",
        headers : {
         "Authorization" : AuthString
        }
       },
       function(err, request, body) {
        if(err) {
         res.json(err);
        }
        else {
         body=JSON.parse(body);
         console.log(body);
         if(body.token) {
           res.cookie("www.buzzbuild.com", body.token, { maxAge: 900000 });
           res.redirect("/me/");
           return;
          }
          else {
           res.json(body);
           return;
         }
        }
       });

     }
     else {
      var data=[];

      Request({
       url: "http://localhost:3000/register",
       method: "POST",
       body: QS.stringify(GoogleUser)
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

     }
    });

   }
   else {
    redirect("/login");
   }
  }

 }

 , //End Callback

 html: {
  form : {
   login: function(req, res) {
    res.render("../Views/forms/login");
   },
   register: function(req, res) {
    res.render("../Views/forms/register");
   }
  }
 }

}

Passport.use(new LocalStrategy(
 function(username, password, done) {
  Model.User.authenticate_local(username, password, function(err, user) {
   if(err) {
    return done(err);
   }
   else {
    if(!user) {
     return done(null, false, {top_message: "Unknown User"});
    }
    else {
      console.log(user);
      return done(null, user);
    }
   }
  });
 }
));

Passport.use(new LinkedInStrategy({
 consumerSecret: "ER5K1I0yaVy5LDMm",
 consumerKey: "v5xdbr1z0qi6", 
 callbackURL: "http://localhost:3030/auth/linkedin/callback"
 },
 function(token, tokenSecret, profile, done) {
  //console.log(profile);
  return done(null, profile);
 }
));


Passport.use(new GoogleStrategy({
  clientID: '166148492718-95anau5qcbsjq72ir65keb8dcrgb310i.apps.googleusercontent.com',
  clientSecret: '6cQWrZBkFiknZj5fwn0rfghr',
  callbackURL: "http://localhost:3030/auth/google/callback",
  scope: [
   'https://www.googleapis.com/auth/plus.me', 
   'https://www.googleapis.com/auth/userinfo.email', 
   'https://www.googleapis.com/auth/userinfo.profile'
  ]
 },
 function(token, tokenSecret, profile, done) {
  done(null, profile);
 })
);


Passport.use(new TwitterStrategy({
 consumerKey: 'sA7HC3VSQiofIlenxR8XA',
 consumerSecret: '5X3YBFYfrkhhHb5Htf6QLwlgrYLkZLGFv3mcn9OQswg',
 callbackURL: "http://localhost:3030/login/twitter/callback"
},
function(token, tokenSecret, profile, done) {
  return done(null, profile);
 }
));

Passport.use(new FacebookStrategy({
    clientID: '231688613606670',
    clientSecret: 'ba786df2720afa978ebb44ca102ca5fb',
    callbackURL: "http://localhost:3030/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
   return done(null, profile);
  }
));

Passport.serializeUser(function(user, done) {
  done(null, user);
});

Passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


var AuthHelpers = {
 isRegisteredUser: function(email, callback) {
  Model.User.findByEmail(email, function(err, user) {
   if(err) return done(err, null);
   return callback(null, user);
  });
 }
};