var express = require('express');
var path = require('path');
var app = express();
var port = '3000';
var server;

exports.config = {
    framework: 'jasmine2',
    directConnect: true,
    // baseUrl: 'http://localhost:' + port + '/m1',
    specs: ['./e2e/*_spec.js'],
    multiCapabilities: [
        {
            browserName: 'chrome'
        }
    ],
    useAllAngular2AppRoots: true,
    beforeLaunch: function() {
        app.use(express.static('./'));
        server = app.listen(port);
    },
    afterLaunch: function() {
        server.close();
    }
}