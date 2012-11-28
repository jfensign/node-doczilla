module.exports={
 On: {
  Connection: function(socket) {
   try {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
     console.log(data);
    });
   }
   catch(Error) {
   	console.log(Error);
   }
  }
 }
}