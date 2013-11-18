'use strict';

var request = require('request');
var localIp = null;
var _ = require('underscore');

var apiproxy = function (req, res) {
    return {
        to: function () {
            var ips = req.ips;
            if (localIp === null) {
                localIp = require('dev-ip').getIp();
            }

            ips = ips.concat([localIp]);

            var header = {
                cookie: req.header('cookie'),
                'x-forwarded-for': ips.join(', ')
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

            return request(options, function (error, response) {
                if (response && response.headers && response.headers.cookie) {
                    res.header('cookie', response.headers.cookie);
                }

                if (callback) {
                    callback.apply(this, arguments);
                }
            });
        }
    };
};

module.exports = apiproxy;
