"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_to_regexp_1 = require("path-to-regexp");
var Cache_1 = require("./Cache");
var Resolver = (function () {
    function Resolver() {
        this.cache = new Cache_1.default();
    }
    Resolver.prototype.resolve = function (path, params) {
        try {
            var filler = this.cache.get(path, function () { return path_to_regexp_1.compile(path); });
            return filler(params || {}, { pretty: true });
        }
        catch (e) {
            throw new Error("Missing param for route " + path + ": " + e.message);
        }
    };
    return Resolver;
}());
exports.default = Resolver;
;
