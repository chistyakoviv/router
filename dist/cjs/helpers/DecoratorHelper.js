"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PathHelper_1 = require("./PathHelper");
;
var DecoratorHelper = (function () {
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
        var params = { 'middlewares': [] };
        for (var i = 0; i < wrappers.length; i++) {
            for (var nextParam in wrappers[i]) {
                if (wrappers[i][nextParam]) {
                    switch (nextParam) {
                        case 'path':
                            params[nextParam] = PathHelper_1.default.join(params[nextParam], wrappers[i][nextParam]);
                            break;
                        case 'middleware':
                            params['middlewares'].push(wrappers[i][nextParam]);
                            break;
                        default:
                            params[nextParam] = (params[nextParam] ? params[nextParam] : '') + wrappers[i][nextParam];
                    }
                }
            }
        }
        return params;
    };
    DecoratorHelper.applyMiddleware = function (handler, middlewares) {
        if (handler === void 0) { handler = function () { }; }
        middlewares = middlewares.slice();
        middlewares.reverse();
        return middlewares.reduce(function (prev, current) { return DecoratorHelper.compose(current, prev); }, handler);
    };
    DecoratorHelper.compose = function (f, g) {
        return function (a) {
            return f(a, g);
        };
    };
    DecoratorHelper.wrappers = [];
    return DecoratorHelper;
}());
exports.default = DecoratorHelper;
;
