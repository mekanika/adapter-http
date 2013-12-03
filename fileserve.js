// Simple file server useful for testing `adapter-rest.min.js` in browser
var app = require( 'express' )();

app.get('/*.js', function(req, res) {
  res.sendfile('./adapter-rest.min.js');
});

// Respond to every other request by serving up dummy html
app.get('/*', function(req, res) {
  res.send( '<html><head><script src="rest.js"></script></head></html>');
});

var port = 3210;
app.listen( port );
console.log( 'File server on port: '+port );
