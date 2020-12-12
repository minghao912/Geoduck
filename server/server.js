"use strict";
exports.__esModule = true;
var http = require("http");
var router = require("./router");
http.createServer(router.handleRequest).listen(8080);
