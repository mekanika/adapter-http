
# adapter-rest

Mekanika REST adapter.

Parses Mekanika [Query objects](https://github.com/mekanika/query/blob/master/docs/object.reference.md) onto [superagent](https://github.com/visionmedia/superagent) for AJAX calls.


## Install

    npm install --production mekanika-adapter-rest

Server:

```js
var rest = require('mekanika-adapter-rest');
```

Browser:

```html
<script src="adapter-rest.min.js"></script>
```

## Usage

The REST adapter exposes an `.exec( queryObj, callback )` method and a `.config` object property.

### Config

Config defaults as follows, each of which can be overridden before calling `.exec()`:

```js
exports.config = {
    protocol: 'http'
  , host: 'localhost'
  , port: 80
  , contentType: 'application/json'
  , withCredentials: false
  , headers: {}
  , query: require('./query.config') // See below
}
```

With the exception of the `query` config parameter most of the config affects how superagent creates the call and where it points to.

#### URL query parsing

The `config.query` field reflects the default settings for parsing URL queries from query objects for `GET` requests only. Query config follows:

```js
{
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
```

The `limit` and `offset` values are special cases and (if present) are appended to the url query as `/?limit=$val&offset=$val`. Change the fields used in the url query by modifying the limit and offset keys in `config.query.map`.

There are 3 basic modes for constraint (where) query parsing:

- **Pattern**: setting the `key` (defaults `'q'`) and specifying a `pattern` of that includes eg. `"field:operator:condition"`, which are replaced with the corresponding constraint values. Wrapped as an array:
    - `/?q=["name:eq:Bob","age:gt:21"]`
- **No key + query object:** formats constraints as `field=mappedOperator+condition`. Operators are mapped according to the `config.query.opmap` keys. So a `{field:'age', operator:'gt', condition:21}` and `{field:'name', operator:'nin', condition:['Bob','Joe']}` would map as an url query:
    - `/?age=>21&name=-Bob,-Joe`
- **Key + query object**: literally dumps the constraints into the `key` field, resulting in passing a `{q:[constraints]}` object to superagent. The resulting url queries are cumbersome, but transform on server directly back into constraints without much processing. Reusing just the `age` constraint above would produce:
    - `/?q[0][field]=age&q[0][operator]=gt&q[0][condition]=21`

### .exec( queryObj, cb )

The adapter can be run calling `exec` and passing it:

- **queryObj** - a valid Mekanika [Query object](https://github.com/mekanika/query/blob/master/docs/object.reference.md)
- **cb** - a callback that accepts `(err, res)` parameters

The query object MUST sepcify an action: `{action:'find'}` which is used to run a superagent call (eg. `post()`, `get()` etc).

Exec returns the `superagent` instance, and passes its results to the callback:

#### err - Error handling
A superagent error object. Information on error handling is available via [superagent error docs](http://visionmedia.github.io/superagent/#error-handling).

#### res - Response handling
Superagent
[response object](http://visionmedia.github.io/superagent/#response-properties).

Some notable `res` properties:

- **res.text** - unparsed response body string
- **res.body** - parsed according to `Content-Type` (may be empty)
- **res.header** - object of parsed header fields
- **res.type** - Content-Type void of the charset
- **res.charset** - content type charset if provided
- **res.error** - provided on `4xx` and `5xx` responses
- **res.status** - response status flags

#### URLs

URLs are constructed as follows:

    config.protocol:// +
    config.host + :config.port
    + /(query.resource) + /(query.identifiers[0])

So a `{resource:'users', identifiers:[12345]}` query object with default config would construct:

    http://localhost/users/12345

The port is omitted if it is `80`. Resource is added if one is passed, and an id are only applied if there is one (and only one). URL queries are appended if they exist and the method is `GET`.

## Tests

Ensure you have installed the development dependencies:

    npm install

Mekanika libraries use the [Mocha]() test runner via `make`:

    make test

### Coverage

Coverage reports are generated with [istanbul](https://github.com/gotwarlost/istanbul) (`npm install -g istanbul`):

    make coverage


## License

MIT
