"use strict";
exports.__esModule = true;
exports.handleRequest = void 0;
var url = require("url");
var fs = require("fs");
var test = require("./test/test");
//import * as panda from './panda';
var panda_linux = require("./panda_linux");
function renderHTML(filepath, response) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile(filepath, null, function (err, data) {
        if (err) {
            response.writeHead(404);
            response.write('File not found: ' + filepath);
        }
        else {
            response.write(data);
        }
        response.end();
    });
}
function handleRequest(request, response) {
    var path = url.parse(request.url).pathname;
    var href = url.parse(request.url).href; // includes ?xxx portion
    // Set CORS headers
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Request-Method', '*');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader('Access-Control-Allow-Headers', '*');
    // Transfer all "/panda/xxx" requests to panda
    var pathSplit = path.split('/');
    var firstDirectory;
    if (pathSplit.length >= 1) {
        firstDirectory = pathSplit[1];
        /*// For "/panda/xxx"
        if (firstDirectory == 'panda')
            return panda.run(href, response);*/
        // For "/panda_linux/xxx"
        if (firstDirectory == 'panda_linux')
            return panda_linux.run(href, response);
    }
    // All other paths
    switch (path) {
        case '/':
            renderHTML('./test/index.html', response);
            break;
        case '/test':
            test.run(response);
            break;
        default:
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.write('File not found');
            response.end();
            break;
    }
}
exports.handleRequest = handleRequest;
