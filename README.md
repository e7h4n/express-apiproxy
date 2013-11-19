# express-apiproxy

[![Build Status](https://travis-ci.org/perfectworks/express-apiproxy.png?branch=master)](https://travis-ci.org/perfectworks/express-apiproxy)

A module to make a bridge between user's request and backend HTTP API server. It works with [express].

## Usage

```js
    var apiproxy = require('apiproxy');

    // ... whip up an express app

    app.get('/', function (req, res) {
        // apiproxy will proxy cookie in `req` to target api address
        var request = apiproxy.proxy(req);

        request('http://a/b/c.json', function (error, response, body) {
            // mikeal/request style response callback
        });
    });
```

The `apiproxy` proxy will return a [request] object, it means you can use [streaming] or [options] like [request], it's very simple.

## License

MIT

[request]: https://github.com/mikeal/request
[options]: https://github.com/mikeal/request#requestoptions-callback
[streaming]: https://github.com/mikeal/request#streaming
[express]: http://expressjs.com/
