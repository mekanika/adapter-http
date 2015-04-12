
/**
 * Export module
 */

module.exports = exports;


/**
 * Generates a URL for the request
 *
 * @param req the query request object
 * @param cfg the configuration for the adapter
 *
 * @returns the url to call
 */

exports.url = function url( req, cfg ) {

  // - End point builder:
  // Apply optional prefix (eg. `/api`) and endpoint resource
  var ep = '/' + (cfg.prefix || '') + '/' + (req.on || '');
  // Conditionally apply an id
  if ( req.ids && req.ids.length === 1) ep += '/'+req.ids[0];

  // - Naive protocol and host builder
  // Assumes clean alpha 'protocol' and clean alphanum 'host' (no `/`)
  var host = cfg.protocol + '://' + cfg.host;
  // Optional port
  if (cfg.port && cfg.port !== 80) host += ':'+cfg.port;

  // Setup the full URL
  var ret;
  if (cfg.parse) ret = host + ep.replace( /\/\/+/g, '/');
  else ret = host + (cfg.prefix ? ('/'+cfg.prefix).replace( /\/\/+/g, '/') : '');

  // Strip any trailing slashes
  if ( ret[ ret.length-1 ] === '/' ) ret = ret.substr(0, ret.length-1);

  return ret;
};
