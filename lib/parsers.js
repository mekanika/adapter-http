
/**
 * Dependencies
 */

var clone = require('clone-component');


/**
 * Export module
 */

module.exports = exports;


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
