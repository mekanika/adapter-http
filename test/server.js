
/**
 * Module dependencies.
 */

var express = require('express');

var app = express();

var allowCrossDomain = function(req, res, next) {

  var headers = [
      'Content-Type'
    // Required for CORS preflight
    , 'X-Requested-With'
  ];

  var methods = [
      'GET'
    , 'POST'
    , 'PUT'
    , 'DELETE'
    // Options is required for CORS preflight
    // https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS
    , 'OPTIONS'
  ];

  res.header( 'Access-Control-Allow-Origin', '*' );
  res.header( 'Access-Control-Allow-Credentials', 'true' );
  res.header( 'Access-Control-Allow-Methods', methods.join(',') );
  res.header( 'Access-Control-Allow-Headers', headers.join(',') );

  if (req.method === 'OPTIONS') res.json( 200 );
  else next();

};

app.use( allowCrossDomain );

app.all('*', function (req, res) {
  console.log('Request:', new Date() );
  res.send('-');
});

console.log('Adapter REST test server listening on: 3000');
app.listen( 3000 );
