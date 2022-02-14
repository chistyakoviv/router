"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_to_regexp_1 = require("path-to-regexp");
var DecoratorHelper_1 = require("./helpers/DecoratorHelper");
var PathHelper_1 = require("./helpers/PathHelper");
var Route = (function () {
    function Route(path, handler, name) {
        this.path = path;
        this.name = name;
        this.handler = handler;
        this.matcher = path_to_regexp_1.match(this.path, { decode: decodeURIComponent });
    }
    Route.prototype.match = function (path) {
        var matched = this.matcher(path);
        if (!matched)
            return null;
        return { matchedPath: matched.path, route: this, params: matched.params };
    };
    Route.prototype.getPath = function () {
        return this.path;
    };
    Route.prototype.getName = function () {
        return this.name ? this.name : null;
    };
    Route.prototype.setName = function (name) {
        this.name = name;
    };
    Route.prototype.getHandler = function () {
        return this.handler ? this.handler : null;
    };
    Route.create = function (path, handler, name) {
        var params = DecoratorHelper_1.default.getParams();
        if (params.as) {
            name = params.as + name;
        }
        if (params.path) {
            path = PathHelper_1.default.join(params.path, path);
        }
        if (params.middlewares.length > 0) {
            handler = DecoratorHelper_1.default.applyMiddleware(handler, params.middlewares);
        }
        Route.wrappedRoutes.push(new Route(path, handler, name));
    };
    Route.group = function (params, fn) {
        DecoratorHelper_1.default.wrap(params, fn);
    };
    Route.build = function () {
        var routes = Route.wrappedRoutes;
        Route.wrappedRoutes = [];
        return routes;
    };
    Route.wrappedRoutes = [];
    return Route;
}());
exports.default = Route;
;
