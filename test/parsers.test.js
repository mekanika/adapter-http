
/**
 * Test dependencies
 */

var expect = require('chai').expect
  , parse = require('../lib/parsers');


/**
 * Parser tests
 */

describe('Parsers', function () {

  /**
   * URL builder
   */

  describe('.url( req, cfg )', function () {

    var cfg = {protocol:'http', host:'local', parse:true};

    it('composes base url as protocol+host+resource', function () {
      expect( parse.url( {on:'users'}, cfg) ).to.equal('http://local/users');
    });

    it('omits resource if not defined', function () {
      expect( parse.url( {}, cfg ) ).to.equal('http://local');
    });

    it('adds a `:$port` value if something other that `80`', function () {
      cfg.port = 5000;
      expect( parse.url( {}, cfg ) ).to.equal('http://local:5000');
      // reset port
      cfg.port = 80;
    });

    it('adds an /:id if only one identifier is present', function () {
      var url = parse.url( {on:'users', ids:[123]}, cfg );
      expect( url ).to.equal( 'http://local/users/123' );

      // Two ids mean DO NOT append /:id
      url = parse.url( {on:'users', ids:[123,321]}, cfg );
      expect( url ).to.equal( 'http://local/users' );
    });

  });

});
