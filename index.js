'use strict';

var request = require('request');
var localIp = null;

var apiproxy = function (req) {
    if (!req || !req.header) {
        throw new Error('Invalid request');
    }

    var ips = req.ips;
    if (localIp === null) {
        localIp = require('dev-ip').getIp();
    }

    var forwarded = (ips || []).concat([localIp]).join(', ');

    var options ={
        headers: {
            cookie: req.header('cookie'),
            'x-forwarded-for': forwarded
        }
    };

    return request.defaults(options);
};

module.exports = apiproxy;
