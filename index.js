
/**
 * Dependencies
 */

var parse = require('./lib/parsers');
var request = require('superagent');


/**
 * Export adapter
 */

module.exports = exports = {};


/**
 * Expose the underlying driver
*/

exports.driver = request;


/**
 * Default configuration
 */

exports.config = {

    protocol: 'http'
  , host: 'localhost'
  , port: 80
  , contentType: 'application/json'
  , headers: {}
  , parse: true
  , prefix: ''
  , withCredentials: false

};


/**
 * Maps query actions to adapter methods
 * @private
 */

var methods = {
    create: 'post'
  , find: 'get'
  , update: 'post'
  , remove: 'del'
};


/**
 * Execution method - marshals the request and maps to adapter handlers
 *
 * @param {Object} req The request query object
 * @param {Function} cb the callback function, passed `cb( err, res )`
 */

exports.exec = function ( qe, cb ) {

  var cfg = exports.config;

  var url = parse.url( qe, cfg )
    , method = cfg.parse ? methods[ qe.do ] : 'post';

  // Setup initial superagent qeuest
  var agent = request[ method ]( url )
    .set( 'Content-Type', cfg.contentType )
    .set( cfg.headers )
    // .query( parse.urlQuery( qe, cfg.query ) )
    .send( qe );

  // Add credentials if in browser state
  if (cfg.withCredentials && agent.withCredentials)
    agent = agent.withCredentials();

  return agent.end( function(err, res) {
    cb( err, res && res.body ? res.body : null );
  });

};
