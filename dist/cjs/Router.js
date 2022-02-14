"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = exports.HTML5History = exports.Route = void 0;
var HistoryApi_1 = require("./interfaces/HistoryApi");
var UrlHelper_1 = require("./helpers/UrlHelper");
var Resolver_1 = require("./Resolver");
var RouteCollection_1 = require("./RouteCollection");
var Route_1 = require("./Route");
exports.Route = Route_1.default;
var Location_1 = require("./Location");
var HTML5History_1 = require("./history/HTML5History");
exports.HTML5History = HTML5History_1.default;
var Router = (function () {
    function Router(routes, history, resolver) {
        var _this = this;
        if (history === void 0) { history = new HTML5History_1.default(); }
        if (resolver === void 0) { resolver = new Resolver_1.default(); }
        this.onLocationChange = function (destination) {
            var location = _this.ensureLocation(destination);
            _this.transitionTo(location);
        };
        this.history = history;
        this.resolver = resolver;
        this.routes = new RouteCollection_1.default(routes);
        this.location = Location_1.default.createDefault();
    }
    Router.prototype.init = function () {
        this.history.on(HistoryApi_1.HistoryEvents.POPSTATE, this.onLocationChange);
        this.location = this.ensureLocation();
        this.location.apply(this);
    };
    Router.prototype.ensureLocation = function (destination) {
        if (!destination)
            return this.resolve({ path: UrlHelper_1.default.getPath() }) || Location_1.default.createDefault();
        return this.resolve(destination) || Location_1.default.createDefault();
    };
    Router.prototype.transitionTo = function (location) {
        location.setPrev(this.location);
        this.location = location;
        this.location.apply(this);
    };
    Router.prototype.resolve = function (destination) {
        if (destination.name) {
            var route_1 = this.routes.find(destination.name);
            if (!route_1)
                return null;
            destination.path = this.resolver.resolve(route_1.getPath(), destination.params);
        }
        if (!destination.path)
            return null;
        var _a = UrlHelper_1.default.parsePath(destination.path), path = _a.path, query = _a.query, hash = _a.hash;
        var _b = this.routes.match(path), matchedPath = _b.matchedPath, route = _b.route, params = _b.params;
        return new Location_1.default(destination.path, path, route, params, query, hash);
    };
    Router.prototype.match = function (destination) {
        var location = this.resolve(destination);
        return !!(location && location.getRoute());
    };
    Router.prototype.push = function (destination) {
        var location = this.resolve(destination);
        if (!location) {
            throw new Error("Can't push location: Invalid params.");
        }
        if (this.location.isSame(location)) {
            throw new Error("The destination location " + location.getPath() + " is the current location.");
        }
        this.history.push(location.getPath());
        this.transitionTo(location);
    };
    Router.prototype.replace = function (destination) {
        var location = this.resolve(destination);
        if (!location) {
            throw new Error("Can't replace location: Invalid params.");
        }
        if (this.location.isSame(location)) {
            throw new Error("The destination location " + location.getPath() + " is the current location.");
        }
        this.history.replace(location.getPath());
        this.transitionTo(location);
    };
    Router.prototype.go = function (n) {
        this.history.go(n);
    };
    Router.prototype.back = function () {
        this.history.back();
    };
    Router.prototype.forward = function () {
        this.history.forward();
    };
    Router.prototype.getLocation = function () {
        return this.location;
    };
    return Router;
}());
exports.Router = Router;
;
