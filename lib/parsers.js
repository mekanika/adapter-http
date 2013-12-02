
/**
 * Dependencies
 */

var clone = require('clone-component');


/**
 * Export module
 */

module.exports = exports;


/**
 * Prepares the URL query for the request
 *
 * @param req the query request object
 * @param qcon the query configuration (see `query.config.js`)
 *
 * @returns the url query object
 */

exports.urlQuery = function urlQuery( req, qcon ) {

  // Url Query
  var uq = {};
  var conds = [];

  // Limit and Offset query
  if (req.display) {
    ['limit', 'offset'].forEach( function(el) {
      if (req.display[el] !== undefined)
        uq[ qcon.map[ el ] ] = req.display[ el ];
    });
  }

  if (!req.constraints) return uq;

  // Constraint formatting
  for (var i=0; i<req.constraints.length; i++) {
    var match = req.constraints[ i ];

    // Format as a string pattern under a query key `qcon.key` -> /?qconkey=..
    // Patterns eg. /?q=["name:nin:bob,jon","age:gt:21"]
    if (qcon.pattern) {
      conds.push( qcon.pattern
        .replace( 'field', match.field )
        .replace( 'operator', match.operator )
        .replace( 'condition', match.condition )
      );
    }
    // Format as an object
    else
      uq = !qcon.key ? _noKey( qcon, match, uq ) : _withKey( qcon, match, uq );
  }

  // Wrap Pattern conditions and append with a key (default 'q')
  if (qcon.pattern) uq[ qcon.key || 'q' ] = '['+conds.join(',')+']';

  return uq;
};


/**
 * Generates a URL for the request
 *
 * @param req the query request object
 * @param cfg the configuration for the adapter
 *
 * @returns the url to call
 */

exports.url = function url( req, cfg ) {

  // Naive protocol and host builder
  // Assumes clean alpha 'protocol' and clean alphanum 'host' (no `/`)
  var Url = cfg.protocol + '://' + cfg.host;

  // Apply core resource
  Url += '/' + (req.resource || '');

  // Conditionally apply an id
  if ( req.identifiers && req.identifiers.length === 1)
    Url += '/'+req.identifiers[0];

  return Url;
};


/**
 * Prepare the data payload
 *
 * @param req the query request object
 *
 * @throws Error if multiple ids and multiple data payloads are present
 * @returns the data payload
 */

exports.payload = function payload( req ) {

  // Return `undefined` if no .content
  if (req.content === undefined) return;

  // Just apply the .content if no ids
  var ids = req.identifiers;
  if (!ids) {
    return req.content.length > 1
      ? req.content
      : req.content[0];
  }

  var idField = req.idField || 'id';

  // Something went weird, multiple ids, multiple content. Die.
  if (req.content.length > 1 )
    throw new Error('Multiple ids and contents. Pick one or the other.');

  // Only one ID, apply it as 'id' to the payload
  if (ids.length === 1)
    return combineId( req.content[0], idField, ids[0] );

  // Apply content to multiple ids (creates an array of content data)
  var data = [];
  for (var i=0; i < ids.length; i++)
    data.push( combineId( req.content[0], idField, ids[i] ) );

  return data;
};


/**
 * Helper - creates a new object of a data `obj` with an `idField:$id`
 *
 * @param {Object} obj data
 * @param {String} idField The id field to add the identifier `id`
 * @param id to add to new data object
 * @private
 */

function combineId( obj, idField, id ) {
  var ret = clone( obj );
  return ret[ idField ] = id, ret;
}


/**
 * Helper - Query no key
 * Uses `field=condition` format (with operator map prefix)
 * eg. /?name=-bob,-jon&age=>21
 *
 * @param qcon the url query configuration
 * @param match the condition `{field:$f, operator:$o, condition:$c}`
 * @param uq the url query object to update and return
 *
 * @returns uq the url query object
 * @private
 */

function _noKey( qcon, match, uq ) {
  var cnds = [];
  function _map( list, el ) {

    var val = (qcon.opmap[ match.operator ] || '') + el;
    list = list.push( val );
  }
  // Create an array of operator prefixed conditions
  match.condition instanceof Array
    ? match.condition.forEach( function( el ) { _map( cnds, el ); })
    : _map( cnds, match.condition );

  uq[match.field] = uq[match.field] === undefined
    ? cnds.join( ',' )
    : uq[match.field] + ',' + cnds.join(',');

  return uq;
}


/**
 * Helper - Query with key
 * Uses `key` as array of conditions with remapped field `q[0][field]=condition`
 * eg. /?q[0][name]=-bob,-jon&q[1][age]=>21
 *
 * @param qcon the url query configuration
 * @param match the condition `{field:$f, operator:$o, condition:$c}`
 * @param uq the url query object to update and return
 *
 * @returns uq the url query object
 * @private
 */

function _withKey ( qcon, match, uq ) {
  // Setup array if not present
  if ( !uq[qcon.key] ) uq[ qcon.key ] = [];
  var o = {};

  for (var k in match)
    o[ qcon.map[ k ] || k ] = match[ k ];

  uq[ qcon.key ].push( o );

  return uq;
}
