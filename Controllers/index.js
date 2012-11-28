/*
**Controller Factory
*Centralized point from which all controllers can be instantiated in App.js
*/

exports.Auth=require('./AuthController');
exports.Register=require('./SignUpController');
exports.Map=require('./MapController');
exports.Me=require('./MeController');
exports.Search=require('./SearchController');
exports.WebSocket=require('./WebSocketController');
exports.Project=require('./ProjectController');