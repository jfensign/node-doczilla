var Express=require("express");
var App=Express();
var HTTP=require('http');
var Server=HTTP.createServer(App);
var IO=require('socket.io').listen(Server);
var Passport=require('passport');
var Controller=require("./Controllers");
var Validator=require('express-validator');

IO.set('log level', 1);

App.configure(function() {
  App.set('Views', __dirname + '/Views');
  App.set('view engine', 'ejs');
  App.use(Express.cookieParser());
  App.use(Express.bodyParser());
  App.use(Express.methodOverride());
  App.use(Express.session({secret: "buzzlebox"}));
  App.use(Passport.initialize());
  App.use(Passport.session());
  App.use(Validator);
  App.use(App.router);
});

App.get("/", Controller.Auth.index);

App.get("/register", Controller.Register.Index.Get);
App.post("/register", Controller.Register.Index.Post);

App.get("/login", Controller.Auth.Login.Local.Get);
App.post("/login/local", Controller.Auth.Login.Local.Post);

App.get("/login/facebook", Passport.authenticate('facebook'));
App.get("/auth/facebook/callback", Passport.authenticate('facebook', {failureRedirect: "/login"}), Controller.Auth.Callback.Facebook);

App.get("/login/google", Passport.authenticate('google'));
App.get("/auth/google/callback", Passport.authenticate('google', {failureRedirect: "/login"}), Controller.Auth.Callback.Google);

App.get("/login/twitter", Passport.authenticate('twitter', {failureRedirect: "/login"}));
App.get("/login/twitter/callback", Passport.authenticate('twitter', {failureRedirect: "/login"}), Controller.Auth.Callback.Twitter);

App.get("/api", Controller.Project.API.Index);

App.get("/me", Controller.Me.Index);

App.get("/me/projects", Controller.Me.Projects.Fetch);

App.get("/me/:project_slug", Controller.Me.Project.Get);
App.post("/me/project/create", Controller.Me.Project.Create);

App.post("/me/:project_slug/object/create", Controller.Me.Project.Object.Create);

IO.sockets.on("connection", Controller.WebSocket.On.Connection);





















































/*

//View Partial Ajax Calls
App.get(
 "/forms/login",
 Controller.Auth.html.form.login
);
App.get(
 "/forms/register",
 Controller.Auth.html.form.register
);
//End View Partials

//Twitter Authentication
App.get(
	"/login/twitter", 
	Passport.authenticate('twitter'),
	Controller.Auth.login.twitter
);

App.get(
 "/login/twitter/callback",
 Passport.authenticate('twitter', { 
 	failureRedirect: '/' 
 },
 Controller.Auth.callback.twitter
 )
);
//End Twitter Authentication

//LinkedIn authentication
App.get(
 "/login/linkedin",
 Passport.authenticate('linkedin'),
 Controller.Auth.login.linkedin
);

App.get(
 "/auth/linkedin/callback",
 Passport.authenticate('linkedin', {
  failureRedirect: '/'
 }),
 Controller.Auth.callback.linkedin
);
//End LinkedIn Authentication

//Google authentication
App.get(
 "/login/google",
 Passport.authenticate(
  'google', 
  {scope: [
   'https://www.googleapis.com/auth/userinfo.profile',
   'https://www.googleapis.com/auth/userinfo.email',
   'https://www.googleapis.com/auth/plus.me'
  ]}
 ),
 Controller.Auth.login.google
);

App.get(
 "/auth/google/callback",
 Passport.authenticate(
  'google', 
  {failureRedirect: '/'}
 ),
 Controller.Auth.callback.google
);
//End Google Authentication
*/
App.get(
 "/setup/step/one",
 Controller.Register.step_one
);

App.get(
 "/map",
 Controller.Map.index
);

Server.listen(3030);

//User validation
var auth = Express.basicAuth(function(user, pass) {     
   return (user == "super" && pass == "secret") ? true : false;
},'Super duper secret area');

App.get(
 '/admin',
 auth,
 function(req,res) {
  console.log("authed");
 }
);

function is_authenticated(req, res, next) {
 if (req.isAuthenticated()) { 
 	return next(); 
 }
 res.redirect("/login");
}