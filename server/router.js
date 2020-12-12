"use strict";
exports.__esModule = true;
exports.handleRequest = void 0;
var url = require("url");
var fs = require("fs");
var test = require("./test/test");
var panda = require("./panda");
function renderHTML(filepath, response) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile(filepath, null, function (err, data) {
        if (err) {
            response.writeHead(404);
            response.write('File not found: ./index.html');
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
    // Transfer all "/panda/xxx" requests to panda
    var pathSplit = path.split('/');
    if (pathSplit.length >= 1 && pathSplit[1] == 'panda')
        return panda.run(href, response);
    switch (path) {
        case '/':
            renderHTML('./index.html', response);
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
