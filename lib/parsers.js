
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

  // Only parse the Endpoint if `cfg.parse = true`
  var ret = cfg.parse ? host + ep.replace( /\/\/+/g, '/') : host;

  // Strip any trailing slashes
  if ( ret[ ret.length-1 ] === '/' ) ret = ret.substr(0, ret.length-1);

  return ret;
};
