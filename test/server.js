
/**
 * Module dependencies.
 */

var express = require('express');

var app = express();


app.all('*', function (req, res) {
  res.send('-');
});

console.log('Adapter REST test server listening on: 3000');
app.listen( 3000 );
