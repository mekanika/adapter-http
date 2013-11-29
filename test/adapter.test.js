
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


  describe('Action map', function () {

    it('create maps to POST', function () {
      expect( rest.exec( {action:'create'}, null, 1).method ).to.be( 'POST' );
    });

    it('find maps to GET', function () {
      expect( rest.exec( {action:'find'}, null, 1).method ).to.be( 'GET' );
    });

    it('update maps to POST', function () {
      expect( rest.exec( {action:'update'}, null, 1).method ).to.be( 'POST' );
    });

    it('save maps to PUT', function () {
      expect( rest.exec( {action:'save'}, null, 1).method ).to.be( 'PUT' );
    });

    it('remove maps to DELETE', function () {
      expect( rest.exec( {action:'remove'}, null, 1).method ).to.be( 'DELETE' );
    });

  });


});

