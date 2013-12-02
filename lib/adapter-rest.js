
/**
 * Dependencies
 */

var adapter = require('mekanika-adapter')
  , parse = require('./parsers')
  , request = require('superagent');


/**
 * Export adapter
 */

module.exports = exports = adapter('rest');


/**
 * Default configuration
 */

exports.config = {

    protocol: 'http'
  , host: 'localhost'
  , contentType: 'application/json'
  , withCredentials: true
  , headers: {}
  , query: require('./query.config')

};


/**
 * Maps query actions to adapter methods
 * @private
 */

var methods = {
    create: 'post'
  , find: 'get'
  , update: 'post'
  , save: 'put'
  , remove: 'del'
}


/**
 * Execution method - marshals the request and maps to adapter handlers
 *
 * @param {Object} req The request query object
 * @param {Function} cb the callback function, passed `cb( err, res )`
 */

exports.exec = function ( req, cb ) {

  var cfg = exports.config;

  var url = parse.url( req, cfg )
    , method = methods[ req.action ];

  // Setup initial superagent request
  var agent = request[ method ]( url )
    .set( 'Content-Type', cfg.contentType )
    .set( cfg.headers )
    .query( parse.urlQuery( req ) )
    .send( parse.payload( req ) );

  // Add credentials if in browser state
  if (cfg.withCredentials && agent.withCredentials)
    agent = agent.withCredentials();

  return agent.end( function(err, res) { cb( err, res ); } );

};
