
/**
 * Dependencies
 */

var expect = require('expect.js')
  , rest = require('../lib/adapter-rest');


describe('Adapter', function () {

  it('implements an .exec( req, cb ) method', function () {
    expect( rest.hasOwnProperty( 'exec' ) ).to.be( true );
    expect( rest.exec.length ).to.be.above( 1 );
  });

});

