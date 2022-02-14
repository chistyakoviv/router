"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RouteCollection = (function () {
    function RouteCollection(routes) {
        this.routes = [];
        this.routes = routes;
    }
    RouteCollection.prototype.match = function (path) {
        for (var i = 0; i < this.routes.length; i++) {
            var match = this.routes[i].match(path);
            if (match)
                return match;
        }
        return {};
    };
    RouteCollection.prototype.find = function (name) {
        for (var i = 0; i < this.routes.length; i++) {
            if (this.routes[i].getName() === name)
                return this.routes[i];
        }
        return null;
    };
    return RouteCollection;
}());
exports.default = RouteCollection;
;
