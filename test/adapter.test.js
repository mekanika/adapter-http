
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


  describe('Request Agent', function () {

    it('applies the config contentType header', function () {
      var a = rest.exec( {action:'create'}, null, 1);
      expect( a.header['Content-Type'] ).to.be( rest.config.contentType );
    });

    it('applies custom config headers to request', function () {
      rest.config.headers = {'API-Key':':)'};
      var a = rest.exec( {action:'create'}, null, 1 );
      expect( a.header ).to.have.keys( 'API-Key' );
      rest.config.headers = {}; // Reset headers
    });

    it('applies parsed payload as request.body', function () {
      var a = rest.exec( {action:'create', content:[{name:':)'}]}, null, 1 );
      expect( a._data ).to.have.keys( 'name' )
      expect( a._data.name ).to.be( ':)' );
    });

  });


});

