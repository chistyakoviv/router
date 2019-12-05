'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var HistoryEvents;
(function (HistoryEvents) {
    HistoryEvents["POPSTATE"] = "popstate";
})(HistoryEvents || (HistoryEvents = {}));
//# sourceMappingURL=HistoryApi.js.map

var UrlHelper = /** @class */ (function () {
    function UrlHelper() {
    }
    UrlHelper.getPath = function () {
        var path = decodeURI(window.location.pathname);
        return (path || '/') + window.location.search + window.location.hash;
    };
    UrlHelper.parsePath = function (path) {
        var hash = '';
        var query = '';
        var hashIndex = path.indexOf('#');
        if (~hashIndex) {
            hash = path.slice(hashIndex);
            path = path.slice(0, hashIndex);
        }
        var queryIndex = path.indexOf('?');
        if (~queryIndex) {
            query = path.slice(queryIndex + 1);
            path = path.slice(0, queryIndex);
        }
        return { path: path, query: query, hash: hash };
    };
    return UrlHelper;
}());
//# sourceMappingURL=UrlHelper.js.map

/**
 * Tokenize input string.
 */
function lexer(str) {
    var tokens = [];
    var i = 0;
    while (i < str.length) {
        var char = str[i];
        if (char === "*" || char === "+" || char === "?") {
            tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
            continue;
        }
        if (char === "\\") {
            tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
            continue;
        }
        if (char === "{") {
            tokens.push({ type: "OPEN", index: i, value: str[i++] });
            continue;
        }
        if (char === "}") {
            tokens.push({ type: "CLOSE", index: i, value: str[i++] });
            continue;
        }
        if (char === ":") {
            var name = "";
            var j = i + 1;
            while (j < str.length) {
                var code = str.charCodeAt(j);
                if (
                // `0-9`
                (code >= 48 && code <= 57) ||
                    // `A-Z`
                    (code >= 65 && code <= 90) ||
                    // `a-z`
                    (code >= 97 && code <= 122) ||
                    // `_`
                    code === 95) {
                    name += str[j++];
                    continue;
                }
                break;
            }
            if (!name)
                throw new TypeError("Missing parameter name at " + i);
            tokens.push({ type: "NAME", index: i, value: name });
            i = j;
            continue;
        }
        if (char === "(") {
            var count = 1;
            var pattern = "";
            var j = i + 1;
            if (str[j] === "?") {
                throw new TypeError("Pattern cannot start with \"?\" at " + j);
            }
            while (j < str.length) {
                if (str[j] === "\\") {
                    pattern += str[j++] + str[j++];
                    continue;
                }
                if (str[j] === ")") {
                    count--;
                    if (count === 0) {
                        j++;
                        break;
                    }
                }
                else if (str[j] === "(") {
                    count++;
                    if (str[j + 1] !== "?") {
                        throw new TypeError("Capturing groups are not allowed at " + j);
                    }
                }
                pattern += str[j++];
            }
            if (count)
                throw new TypeError("Unbalanced pattern at " + i);
            if (!pattern)
                throw new TypeError("Missing pattern at " + i);
            tokens.push({ type: "PATTERN", index: i, value: pattern });
            i = j;
            continue;
        }
        tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
    tokens.push({ type: "END", index: i, value: "" });
    return tokens;
}
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
    if (options === void 0) { options = {}; }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^" + escapeString(options.delimiter || "/#?") + "]+?";
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function (type) {
        if (i < tokens.length && tokens[i].type === type)
            return tokens[i++].value;
    };
    var mustConsume = function (type) {
        var value = tryConsume(type);
        if (value !== undefined)
            return value;
        var _a = tokens[i], nextType = _a.type, index = _a.index;
        throw new TypeError("Unexpected " + nextType + " at " + index + ", expected " + type);
    };
    var consumeText = function () {
        var result = "";
        var value;
        // tslint:disable-next-line
        while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
            result += value;
        }
        return result;
    };
    while (i < tokens.length) {
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
            var prefix = char || "";
            if (prefixes.indexOf(prefix) === -1) {
                path += prefix;
                prefix = "";
            }
            if (path) {
                result.push(path);
                path = "";
            }
            result.push({
                name: name || key++,
                prefix: prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || ""
            });
            continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
        if (value) {
            path += value;
            continue;
        }
        if (path) {
            result.push(path);
            path = "";
        }
        var open = tryConsume("OPEN");
        if (open) {
            var prefix = consumeText();
            var name_1 = tryConsume("NAME") || "";
            var pattern_1 = tryConsume("PATTERN") || "";
            var suffix = consumeText();
            mustConsume("CLOSE");
            result.push({
                name: name_1 || (pattern_1 ? key++ : ""),
                pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                prefix: prefix,
                suffix: suffix,
                modifier: tryConsume("MODIFIER") || ""
            });
            continue;
        }
        mustConsume("END");
    }
    return result;
}
/**
 * Compile a string to a template function for the path.
 */
function compile(str, options) {
    return tokensToFunction(parse(str, options), options);
}
/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens, options) {
    if (options === void 0) { options = {}; }
    var reFlags = flags(options);
    var _a = options.encode, encode = _a === void 0 ? function (x) { return x; } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
    // Compile all the tokens into regexps.
    var matches = tokens.map(function (token) {
        if (typeof token === "object") {
            return new RegExp("^(?:" + token.pattern + ")$", reFlags);
        }
    });
    return function (data) {
        var path = "";
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (typeof token === "string") {
                path += token;
                continue;
            }
            var value = data ? data[token.name] : undefined;
            var optional = token.modifier === "?" || token.modifier === "*";
            var repeat = token.modifier === "*" || token.modifier === "+";
            if (Array.isArray(value)) {
                if (!repeat) {
                    throw new TypeError("Expected \"" + token.name + "\" to not repeat, but got an array");
                }
                if (value.length === 0) {
                    if (optional)
                        continue;
                    throw new TypeError("Expected \"" + token.name + "\" to not be empty");
                }
                for (var j = 0; j < value.length; j++) {
                    var segment = encode(value[j], token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError("Expected all \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
                    }
                    path += token.prefix + segment + token.suffix;
                }
                continue;
            }
            if (typeof value === "string" || typeof value === "number") {
                var segment = encode(String(value), token);
                if (validate && !matches[i].test(segment)) {
                    throw new TypeError("Expected \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
                }
                path += token.prefix + segment + token.suffix;
                continue;
            }
            if (optional)
                continue;
            var typeOfMessage = repeat ? "an array" : "a string";
            throw new TypeError("Expected \"" + token.name + "\" to be " + typeOfMessage);
        }
        return path;
    };
}
/**
 * Create path match function from `path-to-regexp` spec.
 */
function match(str, options) {
    var keys = [];
    var re = pathToRegexp(str, keys, options);
    return regexpToFunction(re, keys, options);
}
/**
 * Create a path match function from `path-to-regexp` output.
 */
function regexpToFunction(re, keys, options) {
    if (options === void 0) { options = {}; }
    var _a = options.decode, decode = _a === void 0 ? function (x) { return x; } : _a;
    return function (pathname) {
        var m = re.exec(pathname);
        if (!m)
            return false;
        var path = m[0], index = m.index;
        var params = Object.create(null);
        var _loop_1 = function (i) {
            // tslint:disable-next-line
            if (m[i] === undefined)
                return "continue";
            var key = keys[i - 1];
            if (key.modifier === "*" || key.modifier === "+") {
                params[key.name] = m[i].split(key.prefix + key.suffix).map(function (value) {
                    return decode(value, key);
                });
            }
            else {
                params[key.name] = decode(m[i], key);
            }
        };
        for (var i = 1; i < m.length; i++) {
            _loop_1(i);
        }
        return { path: path, index: index, params: params };
    };
}
/**
 * Escape a regular expression string.
 */
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */
function flags(options) {
    return options && options.sensitive ? "" : "i";
}
/**
 * Pull out keys from a regexp.
 */
function regexpToRegexp(path, keys) {
    if (!keys)
        return path;
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g);
    if (groups) {
        for (var i = 0; i < groups.length; i++) {
            keys.push({
                name: i,
                prefix: "",
                suffix: "",
                modifier: "",
                pattern: ""
            });
        }
    }
    return path;
}
/**
 * Transform an array into a regexp.
 */
function arrayToRegexp(paths, keys, options) {
    var parts = paths.map(function (path) { return pathToRegexp(path, keys, options).source; });
    return new RegExp("(?:" + parts.join("|") + ")", flags(options));
}
/**
 * Create a path regexp from string input.
 */
function stringToRegexp(path, keys, options) {
    return tokensToRegexp(parse(path, options), keys, options);
}
/**
 * Expose a function for taking tokens and returning a RegExp.
 */
function tokensToRegexp(tokens, keys, options) {
    if (options === void 0) { options = {}; }
    var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function (x) { return x; } : _d;
    var endsWith = "[" + escapeString(options.endsWith || "") + "]|$";
    var delimiter = "[" + escapeString(options.delimiter || "/#?") + "]";
    var route = start ? "^" : "";
    // Iterate over the tokens and create our regexp string.
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (typeof token === "string") {
            route += escapeString(encode(token));
        }
        else {
            var prefix = escapeString(encode(token.prefix));
            var suffix = escapeString(encode(token.suffix));
            if (token.pattern) {
                if (keys)
                    keys.push(token);
                if (prefix || suffix) {
                    if (token.modifier === "+" || token.modifier === "*") {
                        var mod = token.modifier === "*" ? "?" : "";
                        route += "(?:" + prefix + "((?:" + token.pattern + ")(?:" + suffix + prefix + "(?:" + token.pattern + "))*)" + suffix + ")" + mod;
                    }
                    else {
                        route += "(?:" + prefix + "(" + token.pattern + ")" + suffix + ")" + token.modifier;
                    }
                }
                else {
                    route += "(" + token.pattern + ")" + token.modifier;
                }
            }
            else {
                route += "(?:" + prefix + suffix + ")" + token.modifier;
            }
        }
    }
    if (end) {
        if (!strict)
            route += delimiter + "?";
        route += !options.endsWith ? "$" : "(?=" + endsWith + ")";
    }
    else {
        var endToken = tokens[tokens.length - 1];
        var isEndDelimited = typeof endToken === "string"
            ? delimiter.indexOf(endToken[endToken.length - 1]) > -1
            : // tslint:disable-next-line
                endToken === undefined;
        if (!strict) {
            route += "(?:" + delimiter + "(?=" + endsWith + "))?";
        }
        if (!isEndDelimited) {
            route += "(?=" + delimiter + "|" + endsWith + ")";
        }
    }
    return new RegExp(route, flags(options));
}
/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 */
function pathToRegexp(path, keys, options) {
    if (path instanceof RegExp)
        return regexpToRegexp(path, keys);
    if (Array.isArray(path))
        return arrayToRegexp(path, keys, options);
    return stringToRegexp(path, keys, options);
}
//# sourceMappingURL=index.js.map

var Cache = /** @class */ (function () {
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
//# sourceMappingURL=Cache.js.map

var Resolver = /** @class */ (function () {
    function Resolver() {
        this.cache = new Cache();
    }
    Resolver.prototype.resolve = function (path, params) {
        try {
            var filler = this.cache.get(path, function () { return compile(path); });
            return filler(params || {}, { pretty: true });
        }
        catch (e) {
            throw new Error("Missing param for route " + path + ": " + e.message);
        }
    };
    return Resolver;
}());
//# sourceMappingURL=Resolver.js.map

var RouteCollection = /** @class */ (function () {
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
//# sourceMappingURL=RouteCollection.js.map

var PathHelper = /** @class */ (function () {
    function PathHelper() {
    }
    PathHelper.removeTrailingSlash = function (path) {
        return path && path.replace(/\/?$/, '') || '';
    };
    PathHelper.cleanPath = function (path) {
        return path && path.replace(/\/\//, '/') || '';
    };
    PathHelper.join = function (lstr, rstr) {
        return PathHelper.cleanPath(PathHelper.removeTrailingSlash(lstr) + "/" + rstr);
    };
    return PathHelper;
}());
//# sourceMappingURL=PathHelper.js.map

var DecoratorHelper = /** @class */ (function () {
    function DecoratorHelper() {
    }
    DecoratorHelper.wrap = function (params, fn) {
        var wrappers = DecoratorHelper.wrappers;
        wrappers.push(params);
        fn();
        wrappers.pop();
    };
    DecoratorHelper.getParams = function () {
        var wrappers = DecoratorHelper.wrappers;
        var params = {};
        for (var i = 0; i < wrappers.length; i++) {
            for (var nextParam in wrappers[i]) {
                if (wrappers[i][nextParam]) {
                    switch (nextParam) {
                        case 'path':
                            params[nextParam] = PathHelper.join(params[nextParam], wrappers[i][nextParam]);
                            break;
                        default:
                            params[nextParam] = params[nextParam] ? params[nextParam] : '' + wrappers[i][nextParam];
                    }
                }
            }
        }
        return params;
    };
    DecoratorHelper.wrappers = [];
    return DecoratorHelper;
}());
//# sourceMappingURL=DecoratorHelper.js.map

var Route = /** @class */ (function () {
    function Route(path, handler, name) {
        this.path = path;
        this.name = name;
        this.handler = handler;
        this.matcher = match(this.path, { decode: decodeURIComponent });
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
        var params = DecoratorHelper.getParams();
        if (params.as) {
            name = params.as + name;
        }
        if (params.path) {
            path = PathHelper.join(params.path, path);
        }
        Route.wrappedRoutes.push(new Route(path, handler, name));
    };
    Route.group = function (params, fn) {
        DecoratorHelper.wrap(params, fn);
    };
    Route.build = function () {
        var routes = Route.wrappedRoutes;
        Route.wrappedRoutes = [];
        return routes;
    };
    Route.wrappedRoutes = [];
    return Route;
}());

var Location = /** @class */ (function () {
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
    Location.prototype.apply = function () {
        var handler = this.route && this.route.getHandler();
        handler && handler(this);
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
    Location.createDefault = function () {
        return new Location('/', '/');
    };
    return Location;
}());
//# sourceMappingURL=Location.js.map

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var BaseHistory = /** @class */ (function () {
    function BaseHistory() {
        var _a;
        this.events = (_a = {}, _a[HistoryEvents.POPSTATE] = [], _a);
    }
    BaseHistory.prototype.go = function (n) { };
    BaseHistory.prototype.push = function (path) { };
    BaseHistory.prototype.replace = function (path) { };
    BaseHistory.prototype.back = function () { };
    BaseHistory.prototype.forward = function () { };
    BaseHistory.prototype.on = function (name, callback) {
        this.events[name].push(callback);
    };
    BaseHistory.prototype.off = function (name, callback) {
        var index = this.events[name].indexOf(callback);
        if (~index) {
            this.events[name].splice(index, 1);
        }
    };
    return BaseHistory;
}());
//# sourceMappingURL=BaseHistory.js.map

var HTML5History = /** @class */ (function (_super) {
    __extends(HTML5History, _super);
    function HTML5History() {
        var _this = _super.call(this) || this;
        _this.onLocationChange = function (e) {
            _this.events[HistoryEvents.POPSTATE].forEach(function (cb) { return cb({ path: UrlHelper.getPath() }); });
        };
        window.addEventListener('popstate', _this.onLocationChange);
        return _this;
    }
    HTML5History.prototype.pushState = function (path, replace) {
        // try...catch the pushState call to get around Safari
        // DOM Exception 18 where it limits to 100 pushState calls
        // @see https://github.com/vuejs/vue-router/blob/dev/src/util/push-state.js
        try {
            if (replace) {
                window.history.replaceState({}, '', path);
            }
            else {
                window.history.pushState({}, '', path);
            }
        }
        catch (e) {
            window.location[replace ? 'replace' : 'assign'](path);
        }
    };
    HTML5History.prototype.back = function () {
        window.history.back();
    };
    HTML5History.prototype.forward = function () {
        window.history.forward();
    };
    HTML5History.prototype.go = function (n) {
        window.history.go(n);
    };
    HTML5History.prototype.push = function (path) {
        this.pushState(path);
    };
    HTML5History.prototype.replace = function (path) {
        this.pushState(path, true);
    };
    return HTML5History;
}(BaseHistory));
//# sourceMappingURL=HTML5History.js.map

/*!
 * @author Chistyakov Ilya <ichistyakovv@gmail.com>
 */
var Router = /** @class */ (function () {
    function Router(routes, history, resolver) {
        var _this = this;
        if (history === void 0) { history = new HTML5History(); }
        if (resolver === void 0) { resolver = new Resolver(); }
        this.onLocationChange = function (destination) {
            var location = _this.ensureLocation(destination);
            _this.transitionTo(location);
        };
        this.history = history;
        this.resolver = resolver;
        this.routes = new RouteCollection(routes);
        this.location = this.ensureLocation();
        this.history.on(HistoryEvents.POPSTATE, this.onLocationChange);
        this.location.apply();
    }
    Router.prototype.ensureLocation = function (destination) {
        if (!destination)
            return this.resolve({ path: UrlHelper.getPath() }) || Location.createDefault();
        return this.resolve(destination) || Location.createDefault();
    };
    Router.prototype.transitionTo = function (location) {
        this.location = location;
        this.location.apply();
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
        var _a = UrlHelper.parsePath(destination.path), path = _a.path, query = _a.query, hash = _a.hash;
        var _b = this.routes.match(path), matchedPath = _b.matchedPath, route = _b.route, params = _b.params;
        return new Location(destination.path, path, route, params, query, hash);
    };
    Router.prototype.match = function (destination) {
        return !!this.resolve(destination);
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
//# sourceMappingURL=Router.js.map

exports.HTML5History = HTML5History;
exports.Route = Route;
exports.Router = Router;
//# sourceMappingURL=router.js.map
