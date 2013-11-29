
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

  describe('.config', function () {

    it('.protocol set to `http`', function () {
      expect( rest.config.protocol ).to.be( 'http' );
    });

    it('.host initialises as `localhost`', function () {
      expect( rest.config.host ).to.be( 'localhost' );
    });

    it('.contentType defaults to `application/json`', function () {
      expect( rest.config.contentType ).to.be( 'application/json' );
    });

    it('.withCredentials defaults to `true`', function () {
      expect( rest.config.withCredentials ).to.be( true );
    });

    it('custom .headers default to empty object', function () {
      expect( rest.config.headers ).to.be.an( Object );
      expect( rest.config.headers ).to.be.empty();
    });

  });


});

