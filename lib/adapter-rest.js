
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
 * @type {Object}
 */

exports.config = {};


/**
 * Core adapter execution method
 *
 * @param req query object
 * @param {Function} cb Callback passed `( err, results )`
 */

exports.exec = function ( req, cb ) {

  throw new Error('Adapter not implemented');

};
