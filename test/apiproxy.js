/*global describe, it, beforeEach, afterEach*/

'use strict';

var assert = require('chai').assert;
var apiproxy = require('../');
var express = require('express');
var http = require('http');

var fakeRequest = {
    header: function (field) {
        return {
            cookie: 'abc=123'
        }[field];
    },
    ip: '202.120.2.101',
    ips: ['202.120.2.101', '192.168.0.1', '192.168.0.7']
};

var fakeHeader = function (header) {
    return function (name, value) {
        header[name] = value;
    };
};

describe('apiproxy', function () {
    describe('#proxy', function () {
        it('should return a request method', function () {
            var request = apiproxy(null, null);
            assert.isFunction(request.to, 'apiproxy return a function');
        });

        describe('#to', function () {
            var server = null;
            var app = null;
            beforeEach(function (done) {
                app = express();
                app.enable('trust proxy');
                app.get('/ip', function (req, res) {
                    res.send(req.ip);
                });

                app.get('/cookie', function (req, res) {
                    res.send(req.header('cookie'));
                });

                app.post('/cookie', function (req, res) {
                    res.header('cookie', 'abc=456');
                    res.send('ok');
                });
                server = http.createServer(app).listen(12819, done);
            });

            afterEach(function () {
                server.close();
            });

            it('should proxy user client ip address', function (done) {
                var _header = {};
                var request = apiproxy(fakeRequest, {
                    header: fakeHeader(_header)
                });

                request.to('http://127.0.0.1:12819/ip', function (err, response, body) {
                    assert.equal(body, '202.120.2.101', 'client ip is proxied');
                    done();
                });
            });

            it('should take user cookie', function (done) {
                var _header = {};
                var request = apiproxy(fakeRequest, {
                    header: fakeHeader(_header)
                });

                request.to('http://127.0.0.1:12819/cookie', function (err, response, body) {
                    assert.equal(body, 'abc=123', 'client cookie is proxied');
                    done();
                });
            });

            it('should set cookie if api response contains cookie', function (done) {
                var _header = {};
                var request = apiproxy(fakeRequest, {
                    header: fakeHeader(_header)
                });

                request.to({
                    url: 'http://127.0.0.1:12819/cookie',
                    method: 'post'
                }, function () {
                    assert.equal(_header.cookie, 'abc=456', 'client cookie is proxied');
                    done();
                });
            });
        });
    });
});
