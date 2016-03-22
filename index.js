'use strict';

var _ = require('underscore');
var request = require('request');
var ipaddr = require('ipaddr.js');

var apiproxy = function (req, options) {
    if (!req || !req.header) {
        throw new Error('Invalid request');
    }

    var ips = req.ips;
    var localIp = req.connection.remoteAddress || req.socket.remoteAddress;

    if (ipaddr.IPv6.isValid(localIp)) {
        var ip = ipaddr.IPv6.parse(localIp);
        if (ip.isIPv4MappedAddress()) {
            localIp = ip.toIPv4Address().toString();
        }
    }

    var forwarded = (ips || []).concat([localIp]).join(',');

    options = _.defaults({
        headers: {
            Cookie: req.header('cookie'),
            'X-Forwarded-For': forwarded
        }
    }, options);

    return request.defaults(options);
};

module.exports = apiproxy;
