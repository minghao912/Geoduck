"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.run = void 0;
var opencc_1 = require("opencc");
/**
 * Runs PandaCC
 * @param url The GET request URL. In form "/direction?query=abc"
 * @param response The http response element.
 *
 * This example converts "汉字" from Simplified to Traditional
 * @example run("/s2t?query=汉字", response)
 */
function run(url, response) {
    response.writeHead(200, { "Content-Type": "application/json" });
    // a path in form "/panda/s2t" would return 's2t'
    var path = handleURL(url);
    var dir = path[0];
    var query = path[1];
    getData(dir, query).then(function (panda) {
        console.log(panda);
        response.write(JSON.stringify(panda));
        response.end();
    })["catch"](function (err) {
        console.log(err);
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.write('File not found');
        response.end();
    });
}
exports.run = run;
function getData(direction, query) {
    return __awaiter(this, void 0, void 0, function () {
        var data, converter, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = {
                        "original": "",
                        "conversion": ""
                    };
                    if (["s2t", "t2s"].indexOf(direction) > -1) // Only supported conversion directions
                        converter = new opencc_1.OpenCC(direction + ".json");
                    return [4 /*yield*/, converter.convertPromise(query)];
                case 1:
                    result = _a.sent();
                    data = {
                        "original": query,
                        "conversion": result
                    };
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            resolve(data);
                            reject(null);
                        })];
            }
        });
    });
}
function handleURL(url) {
    var path = url.split(/[/?]/); // Split on "/" or "?"
    var dir = path[2];
    var queryEncoded = path[3]; // This uses HTML URL Encoding, e.g. "%E6%B1", so need to decode it to Unicode
    var queryDecoded = decodeURIComponent(queryEncoded);
    console.log("> Panda received path " + path);
    console.log("> Parsed direction: " + dir);
    console.log("> Parsed query: " + queryEncoded.substring(6) + ", decoded to: " + queryDecoded.substring(6));
    return [dir, queryDecoded];
}
