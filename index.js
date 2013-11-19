'use strict';

var request = require('request');
var localIp = null;
var _ = require('underscore');

var apiproxy = function (req) {
    if (!req || !req.header) {
        throw new Error('Invalid request');
    }

    var ips = req.ips;
    if (localIp === null) {
        localIp = require('dev-ip').getIp();
    }

    var forwarded = (ips || []).concat([localIp]).join(', ');

    var header = {
        cookie: req.header('cookie'),
        'x-forwarded-for': forwarded
    };

    var args = Array.prototype.slice.apply(arguments);
    var options = args[0];
    var callback = args[1];

    if (typeof options === 'string') {
        options = {
            url: options
        };
    } else {
        options = _.extend({}, options);
    }

    options.headers = _.defaults(header, options.headers);

    return request.defaults(options);
};

module.exports = apiproxy;
