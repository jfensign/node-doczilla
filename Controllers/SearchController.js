var Request=require('request');

module.exports={
 ShoppingMalls: {
  AroundMe: function(req, res) {
   try {
   	Request(
   	 "http://localhost:3000/search/shopping_malls/around_me",
   	 req.query.coords,
   	 function(err, request, response) {
   	  if(err) return console.log(err);
   	  console.log(response);
   	 }
   	);
   }
   catch(Error) {
   	console.log(Error);
   }
  }
 }
}