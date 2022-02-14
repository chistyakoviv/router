"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Location = (function () {
    function Location(path, normalizedPath, route, params, query, hash) {
        this.path = path;
        this.normalizedPath = normalizedPath;
        this.route = route;
        this.params = params;
        this.query = query;
        this.hash = hash;
    }
    Location.prototype.getPath = function () {
        return this.path;
    };
    Location.prototype.getNormalizedPath = function () {
        return this.normalizedPath;
    };
    Location.prototype.getRoute = function () {
        return this.route ? this.route : null;
    };
    Location.prototype.apply = function (router) {
        var handler = this.route && this.route.getHandler();
        handler && handler(router);
    };
    Location.prototype.getParams = function () {
        return this.params ? this.params : null;
    };
    Location.prototype.getName = function () {
        var name = this.route && this.route.getName();
        return name ? name : null;
    };
    Location.prototype.getQuery = function () {
        if (this.parsedQuery)
            return this.parsedQuery;
        var query = {};
        if (this.query) {
            this.query.split('&').forEach(function (param) {
                var parts = param.split('=');
                query[parts[0]] = parts[1];
            });
        }
        return this.parsedQuery = query;
    };
    Location.prototype.getHash = function () {
        return this.hash ? this.hash : null;
    };
    Location.prototype.isSame = function (location) {
        return this.getPath() === location.getPath();
    };
    Location.prototype.getPrev = function () {
        return this.prev ? this.prev : null;
    };
    Location.prototype.isPathChanged = function () {
        if (!this.prev)
            return true;
        return this.normalizedPath !== this.prev.normalizedPath;
    };
    Location.prototype.isQueryChanged = function () {
        if (!this.prev)
            return true;
        return this.query !== this.prev.query;
    };
    Location.prototype.isHashChanged = function () {
        if (!this.prev)
            return true;
        return this.hash !== this.prev.hash;
    };
    Location.prototype.setPrev = function (location) {
        location.prev = undefined;
        this.prev = location;
    };
    Location.createDefault = function () {
        return new Location('/', '/');
    };
    return Location;
}());
exports.default = Location;
;
