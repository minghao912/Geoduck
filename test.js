"use strict";
exports.__esModule = true;
exports.run = void 0;
var fs = require("fs");
function run(response) {
    response.writeHead(200, { "Content-Type": "application/json" });
    fs.readFile('./test.json', null, function (err, data) {
        if (err) {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.write("File not found");
        }
        else {
            response.write(data);
        }
        response.end();
    });
}
exports.run = run;
