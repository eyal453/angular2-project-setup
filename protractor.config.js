var express = require('express');
var app = express();
var port = '3000';
var server;

exports.config = {
    framework: 'jasmine2',
    directConnect: true,
    baseUrl: 'http://localhost:' + port,
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