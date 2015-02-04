
# adapter-rest


Query envelope to HTTP adapter 



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




Notes to me:

GET (find) + DELETE (remove) must parse 'match' conditions as URL queries /resource/?query
POST can plug the whole Qe in the HTTP body
