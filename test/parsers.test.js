
/**
 * Test dependencies
 */

var expect = require('expect.js')
  , clone = require('clone-component')
  , qcon = require('../lib/query.config')
  , parse = require('../lib/parsers');


/**
 * Parser tests
 */

describe('Parsers', function () {

  var cfg;
  beforeEach( function () { cfg = clone( qcon ); } );

  /**
   * URL query builder
   */

  describe('.urlQuery( req, qconf )', function () {

    var q = require('./queries/query.objects');

    describe('Limit and Offset', function () {

      it('passes through if no .display or .constraints', function () {
        expect( parse.urlQuery( {} ) ).to.be.empty();
      });

      it('parses limit and offset .display', function () {
        var pre = parse.urlQuery( q.display, qcon );
        expect( pre ).to.have.keys( 'limit', 'offset' );
      });

      it('maps limit and offset if config.query.map values set', function () {
        cfg.map.limit = 'maxrecords';
        cfg.map.offset = 'skip';

        var pre = parse.urlQuery( q.display, cfg );
        expect( pre ).to.have.keys( 'maxrecords', 'skip' );
      });

    });


    describe('With Constraints', function () {

      describe('Pattern', function () {

        it('replaces pattern field,operator,condition', function () {
          cfg.pattern = '"field:operator:condition"';
          var pre = parse.urlQuery( q.many, cfg );
          expect( pre ).to.have.keys( 'q' );
          var cnd = JSON.parse( pre.q );
          expect( cnd ).to.have.length( 4 );
          expect( cnd[1] ).to.be( 'name:in:Mordecai,Rigbone' );
        });

        it('applies a default query key `q` if none set', function () {
          cfg.pattern = '"field:operator:condition"';
          cfg.key = '';
          var pre = parse.urlQuery( q.many, cfg );
          expect( pre ).to.have.keys( 'q' );
        });

        it('applies custom query key if provided', function () {
          cfg.pattern = '"field:operator:condition"';
          cfg.key = 'search';
          var pre = parse.urlQuery( q.many, cfg );
          expect( pre ).to.have.keys( 'search' );
        });

      });


      describe('Object and no key', function () {

        it('applies consolidated constraints as /?field=conditions', function () {
          cfg.key = '';
          var pre = parse.urlQuery( q.many, cfg );
          expect( pre ).to.have.keys( 'age', 'name', 'cool' );
          expect( pre.cool.split(',') ).to.have.length( 3 );
        });

        it('prefixes conditions with mapped operators', function () {
          cfg.key = '';
          var pre = parse.urlQuery( q.many, cfg );
          expect( pre.cool ).to.be( '-Boo,-Smoo,-obo' );
          expect( pre.age ).to.be( '>16' );
        });

      });


      describe('Object with key', function () {

        it('applies consolidated constraints as /?q[0][field]=...', function () {
          cfg.key = 'q';
          var pre = parse.urlQuery( q.many, cfg );
          expect( pre.q ).to.have.length( 4 );
          expect( pre.q[0] ).to.have.keys( 'key', 'op', 'cnd' );
        });

        it('maps condition keys to config.map values', function () {
          cfg.key = 'q';
          cfg.map.field = 'swee!'
          pre = parse.urlQuery( q.single, cfg );
          expect( pre.q ).to.have.length( 1 );
          expect( pre.q[0] ).to.have.keys( 'swee!' );
        });

      });

    });

  });


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
