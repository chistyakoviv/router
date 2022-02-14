"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cache = (function () {
    function Cache() {
        this.items = {};
    }
    Cache.prototype.get = function (key, value) {
        if (this.items[key])
            return this.items[key];
        this.set(key, value());
        return this.items[key];
    };
    Cache.prototype.set = function (key, value) {
        this.items[key] = value;
    };
    return Cache;
}());
exports.default = Cache;
;
