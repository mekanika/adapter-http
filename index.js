
/**
 * Dependencies
 */

var emitter = require('component-emitter')
  , parse = require('./lib/parsers')
  , request = require('superagent');


/**
 * Export adapter
 */

module.exports = exports = emitter({});


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
    .set( cfg.headers )
    .send( qe );

  // Add credentials if in browser state
  if (cfg.withCredentials && agent.withCredentials)
    agent = agent.withCredentials();

  return agent.end( function(err, res) {
    if (res) exports.emit( res.status, res.body || null );
    cb( err, res && res.body ? res.body : null );
  });

};
