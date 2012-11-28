module.exports={
 Image: {
  Save: function upload_file(req, res) {
   req.setBodyEncoding('binary');
   var stream = new multipart.Stream(req);

   stream.addListener('part', function(part) {
    part.addListener('body', function(chunk) {
     var progress = (stream.bytesReceived / stream.bytesTotal * 100).toFixed(2);
     var mb = (stream.bytesTotal / 1024 / 1024).toFixed(1);
     console.log("Uploading "+mb+"mb ("+progress+"%)\015");
    });
   });

   stream.addListener('complete', function() {
    res.sendHeader(200, {'Content-Type': 'text/plain'});
    res.sendBody('Thanks for playing!');
    res.finish();
    sys.puts("\n=> Done");
   });
   
  }
 },
 Video: {},
 Audio: {},
 Document: {}
}