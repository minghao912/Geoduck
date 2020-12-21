"use strict";
exports.__esModule = true;
var https = require("https");
var fs = require("fs");
var router = require("./router");
// SSL stuff
var options = {
    key: fs.readFileSync("/etc/ssl/cloudflare/cert.key"),
    cert: fs.readFileSync("/etc/ssl/cloudflare/cert.pem")
};
https.createServer(router.handleRequest).listen(8443, '0.0.0.0');
