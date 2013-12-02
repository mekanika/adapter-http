
/**
 * Export query configuration defaults
 */

module.exports = {

    // Default query key `/?q=...`
    key: 'q'

    // Remaps `field`, `operator` and `condition`
    // eg. pattern: '"field:operator:condition"'
  , pattern: ''

    // Replaces query keys with a mapped value
  , map: {
        field: 'key'
      , operator: 'op'
      , condition: 'cnd'
      , limit: 'limit'
      , offset: 'offset'
    }

    // Default remap values for operators 'neq:"hi"' -> '-hi'
  , opmap: {
        neq: '-'
      , nin: '-'
      , gt: '>'
      , lt: '<'
      , gte: '>='
      , lte: '<='
    }

};
