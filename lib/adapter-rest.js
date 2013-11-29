
/**
 * Dependencies
 */

var adapter = require('mekanika-adapter');


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

};




/**
 * Execution method - marshals the request and maps to adapter handlers
 *
 * @param {Object} req The request query object
 * @param {Function} cb the callback function, passed `cb( err, res )`
 */

exports.exec = function ( req, cb ) {

  throw new Error('Adapter not implemented');

};
