
/**
 * Test dependencies
 */

var expect = require('expect.js')
  , parse = require('../lib/parsers');


/**
 * Parser tests
 */

describe('Parsers', function () {


  /**
   * URL builder
   */

  describe('.url( req, cfg )', function () {

    var cfg = {protocol:'http', host:'local'};

    it('composes base url as protocol+host+resource', function () {
      expect( parse.url( {resource:'users'}, cfg) ).to.be('http://local/users');
    });

    it('adds an /:id if only one identifier is present', function () {
      var url = parse.url( {resource:'users', identifiers:[123]}, cfg );
      expect( url ).to.be( 'http://local/users/123' );

      // Two ids mean DO NOT append /:id
      url = parse.url( {resource:'users', identifiers:[123,321]}, cfg );
      expect( url ).to.be( 'http://local/users' );
    });

  });


  /**
   * Data payload preparation
   */

   describe('.payload( req )', function () {

    it('returns `undefined` if no req.content', function () {
      expect( parse.payload( {} ) ).to.be( undefined );
    });

    it('throws if passed multiple .identifiers and .content', function () {
      // It's one or the other, die if both
      var req = {identifiers:[123,321], content:[{a:1}, {b:2}]};
      var err;
      try {
        parse.payload( req );
      }
      catch ( e ) { err = e; }
      expect( err ).to.be.an( Error );
    });

    describe('with no req.identifiers', function () {

      it('Array payload if multiple elements in req.content', function () {
        var payload = parse.payload( {content:[1,2]} );
        expect( payload ).to.be.an( Array );
        expect( payload ).to.contain( 1, 2 );
      });

      it('Object payload if only one element in req.content', function () {
        var payload = parse.payload( {content:[{yo:1}]} );
        expect( payload ).to.be.an( Object );
        expect( payload ).to.only.have.keys( 'yo' );
        expect( payload.yo ).to.be( 1 );
      });

    });

    describe('with req.identifiers', function () {

      it('applies `id` to Object payload if only one identifier', function () {
        var payload = parse.payload( {identifiers:[123], content:[{yo:1}]} );
        expect( payload ).to.be.an( Object );
        expect( payload ).to.only.have.keys( 'yo', 'id' );
        expect( payload.id ).to.be( 123 );
      });

      it('applies `id` to Array payload if multiple identifiers', function () {
        var req = {identifiers:['123','321'], content:[{yo:1}]};
        var payload = parse.payload( req );
        expect( payload ).to.be.an( Array );
        expect( payload ).to.have.length( 2 );
        expect( payload[0] ).to.only.have.keys( 'yo', 'id' );
        expect( payload[0].id ).to.be( '123' );
      });

      it('uses req.idField or `id` for payload id field', function () {
        // Test default id field name
        var req = {identifiers:['abcd'], content:[{yo:1}]};
        expect( parse.payload( req ) ).to.have.keys( 'id' );

        req.idField = '__ident';
        expect( parse.payload( req ) ).to.have.keys( req.idField );
        expect( parse.payload( req ).__ident ).to.be( 'abcd' );
      });

    });


   });

});
