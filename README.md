
# adapter-http


[Query envelope](https://github.com/mekanika/qe) to HTTP adapter 


## Install

    npm install mekanika-adapter-http

CommonJS:

```js
var http = require('mekanika-adapter-http');
```

Browser (exposes as `HttpAdapter` globals):

```html
<script src="dist/adapter-http.min.js"></script>
```


## Usage

The HTTP adapter exposes an `.exec( qe, callback )` method and a `.config` object property.

```js
http.exec( {do:'find', on:'users'}, function (err, res) {
  if (err) throw new Error(err);
  console.log( res );
});
```

### .exec( qe, cb )

The adapter can be run calling `exec` and passing it:

- **qe** - a valid Mekanika [Qe](https://github.com/mekanika/qe)
- **cb** - a callback that accepts `(err, res)` parameters

The query envelope MUST sepcify an action: `{do:'find'}` which is used to run a superagent call (eg. `post()`, `get()` etc).

Exec returns the `superagent` instance, and passes its results to the callback:

#### err - Error handling
A superagent error object. Information on error handling is available via [superagent error docs](https://visionmedia.github.io/superagent/#error-handling).

#### res - Response handling
Superagent [response object](https://visionmedia.github.io/superagent/#response-properties).

Some notable `res` properties:

- **res.text** - unparsed response body string
- **res.body** - parsed according to `Content-Type` (may be empty)
- **res.header** - object of parsed header fields
- **res.type** - Content-Type void of the charset
- **res.charset** - content type charset if provided
- **res.error** - provided on `4xx` and `5xx` responses
- **res.status** - response status flags

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
}
```

Config affects how superagent creates the call and where it points to.


## HTTP request and URL construction

The base URL constructed from adapter config is as follows:

    protocol:// + host + :port [+ /resource]

The port is omitted from the URL if is the default `80`. The resource is added if one is provided, and ids are appended to the resource URL (separated by commas if several are provided). URL queries are appended if provided by the _Qe_.

The HTTP request methods map to the default _Qe_ actions as follows:

_Qe_ action | HTTP method
:-----------|:-----------
find        | GET
create      | POST
update      | POST
remove      | DELETE

`find` and `update` requests append _Qe_ identifiers to the URL. So a _Qe_ of `{on:'users', ids:['12345']}`, would by default build the following URL:

    http://localhost/users/12345

Multiple ids are separated by commas `{on:'users', ids:['12345','14421']}`

    http://localhost/users/12345,14421


## Tests

Ensure you have installed the development dependencies:

    npm install

To run the tests:

    npm test

### Coverage

Coverage reports are generated with [istanbul](https://github.com/gotwarlost/istanbul) (`npm install -g istanbul`):

    npm run coverage


## License

Copyright 2013-2015 Mekanika

Released under the **MIT License** ([MIT](http://opensource.org/licenses/MIT))
