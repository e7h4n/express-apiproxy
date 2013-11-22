'use strict';

var _ = require('underscore');
var request = require('request');

var apiproxy = function (req, options) {
    if (!req || !req.header) {
        throw new Error('Invalid request');
    }

    var ips = req.ips;
    var localIp = req.connection.remoteAddress || req.socket.remoteAddress;

    var forwarded = (ips || []).concat([localIp])[0] || '';

    options = _.defaults({
        headers: {
            Cookie: req.header('cookie'),
            'X-Forwarded-For': forwarded
        }
    }, options);

    return request.defaults(options);
};

module.exports = apiproxy;
