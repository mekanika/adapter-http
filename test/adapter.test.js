
/**
 * Dependencies
 */

var expect = require('chai').expect
  , rest = require('../index');


// Stub blank function
var _fn = function(){};


describe('Adapter', function () {

  it('implements an .exec( req, cb ) method', function () {
    expect( rest.hasOwnProperty( 'exec' ) ).to.equal( true );
    expect( rest.exec.length ).to.be.gt( 1 );
  });


  describe('.config', function () {

    it('.protocol set to `http`', function () {
      expect( rest.config.protocol ).to.equal( 'http' );
    });

    it('.host initialises as `localhost`', function () {
      expect( rest.config.host ).to.equal( 'localhost' );
    });

    it('.port default to 80', function () {
      expect( rest.config.port ).to.equal( 80 );
    });

    it('.contentType defaults to `application/json`', function () {
      expect( rest.config.contentType ).to.equal( 'application/json' );
    });

    it('.withCredentials defaults to `false`', function () {
      expect( rest.config.withCredentials ).to.equal( false );
    });

    it('custom .headers default to empty object', function () {
      expect( rest.config.headers ).to.be.an.instanceof( Object );
      expect( rest.config.headers ).to.be.empty;
    });

    it.skip('.query contains url query configuration', function () {
      var cfg = rest.config.query;
      expect( cfg ).to.have.keys( 'key', 'pattern', 'map', 'opmap' );

      expect( cfg.key ).to.equal( 'q' );
      expect( cfg.pattern ).to.equal( '' );
      expect( cfg.map ).to.not.be.empty();
      expect( cfg.opmap ).to.not.be.empty();
    });

  });


  describe('Action map', function () {

    it('create maps to POST', function () {
      expect( rest.exec( {do:'create'}, _fn, 1).method ).to.equal( 'POST' );
    });

    it('find maps to GET', function () {
      expect( rest.exec( {do:'find'}, _fn, 1).method ).to.equal( 'GET' );
    });

    it('update maps to POST', function () {
      expect( rest.exec( {do:'update'}, _fn, 1).method ).to.equal( 'POST' );
    });

    it('remove maps to DELETE', function () {
      expect( rest.exec( {do:'remove'}, _fn, 1).method ).to.equal( 'DELETE' );
    });

  });


  describe('Request Agent', function () {

    it('applies the config contentType header', function () {
      var a = rest.exec( {do:'find'}, _fn, 1);
      // Server headers are in .req
      expect( a.req._headers['content-type'] ).to.equal( rest.config.contentType );
    });

    it('applies custom config headers to request', function () {
      rest.config.headers = {'API-Key':':)'};
      var a = rest.exec( {do:'create'}, _fn, 1 );
      expect( a.req._headers ).to.include.keys( 'api-key' );
      rest.config.headers = {}; // Reset headers
    });

    it.skip('applies parsed payload as request.body', function () {
      var a = rest.exec( {do:'create', body:[{name:':)'}]}, _fn, 1 );
      expect( a._data ).to.have.keys( 'name' );
      expect( a._data.name ).to.equal( ':)' );
    });

    it('defaults to POST if cfg.parse = false', function () {
      rest.config.parse = false;
      var a = rest.exec( {do:'create'}, _fn );
      expect( a.method ).to.equal('POST');
      rest.config.parse = true; // Reset config
    });

  });


});

